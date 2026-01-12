import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

const ApplicationContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useApplications = () => useContext(ApplicationContext);

const defaultApps = [
  {
    universityName: 'Munster Technological University',
    program: "Master's Program",
    applicationId: 'MV07012026083543',
    portalUrl: 'https://international.cit.ie/apply',
    status: 'Submitted',
    feePaid: false,
    applicationFee: 0,
    scholarship: '',
    documents: 'Passport, CV, Degree Certificate, Transcripts, English Proficiency, SOP',
    notes: 'Merge documents into 1 PDF. Reply to email with PDF. Do not change subject. 4 week processing period.'
  },
  {
    universityName: 'University College Dublin',
    program: 'MSc Advanced Artificial Intelligence FT (T413)',
    applicationId: 'IA-0000147275',
    portalUrl: 'https://crm.ucd.ie/apply/s/login/',
    username: '',
    password: '',
    status: 'Submitted',
    feePaid: true,
    applicationFee: 70,
    scholarship: '',
    documents: 'References, English Language, College, Awards, Publications, General Questions, Funding & Sponsorship, Files, Terms & Conditions, Employment',
    notes: 'Applicant ID: 26127133. Preliminary Ref: PAR-0000147461. Fee Paid: €70.00 on Jan 11, 2026.'
  }
];

export const ApplicationProvider = ({ children }) => {
  // Initialize with local data immediately for instant load
  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('applications');
    if (saved) {
      return JSON.parse(saved);
    }
    // Initial default state if nothing in local storage
    return defaultApps.map(app => ({...app, id: uuidv4(), createdAt: new Date().toISOString()}));
  });
  
  // Only show loading if we really have no data to show (rare)
  const [loading, setLoading] = useState(false);
  const [storageMode, setStorageMode] = useState('connecting');
  const [firestoreError, setFirestoreError] = useState(null);

  // Subscribe to Firestore updates
  useEffect(() => {
    let unsubscribe = () => {};
    
    // Safety timeout: If Firestore takes too long, just ensure we are in local mode
    const timeoutId = setTimeout(() => {
        setStorageMode(prev => {
            if (prev === 'connecting') {
                console.warn("Firestore connection timed out.");
                setFirestoreError("Connection timed out. Using local data.");
                return 'local';
            }
            return prev;
        });
    }, 3000);

    try {
      const q = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));
      unsubscribe = onSnapshot(q, (snapshot) => {
        clearTimeout(timeoutId); // Connection established
        
        const apps = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log("Firestore snapshot update:", apps.length, "documents");

        // If database is empty (first run), migrate default apps
        if (apps.length === 0 && !localStorage.getItem('migrated')) {
          console.log('Migrating default apps to Firestore...');
          
          // Use Promise.all to wait for all uploads and catch errors
          Promise.all(defaultApps.map(async (app) => {
             await addDoc(collection(db, 'applications'), {
               ...app,
               createdAt: new Date().toISOString()
             });
          })).then(() => {
             console.log("Migration successful");
             setFirestoreError(null);
             setStorageMode('firestore');
          }).catch((err) => {
             console.error("Migration failed:", err);
             queueMicrotask(() => {
                setFirestoreError("Migration failed (Check Permissions): " + err.message);
                setStorageMode('local');
             });
          });
          
          localStorage.setItem('migrated', 'true');
        } else {
          setApplications(apps);
          setFirestoreError(null);
          setStorageMode('firestore');
        }
        setLoading(false);
      }, (error) => {
        clearTimeout(timeoutId);
        console.error("Firestore error:", error);
        queueMicrotask(() => {
          setFirestoreError(error?.message || String(error));
          setStorageMode('local');
        });
        setLoading(false);
      });
    } catch (err) {
      clearTimeout(timeoutId);
      console.error("Firebase init error:", err);
      queueMicrotask(() => {
        setFirestoreError(err?.message || String(err));
        setStorageMode('local');
        setLoading(false);
      });
    }
    
    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  const addApplication = async (data) => {
    try {
      await addDoc(collection(db, 'applications'), {
        ...data,
        createdAt: new Date().toISOString()
      });
    } catch (e) {
      console.error("Error adding document: ", e);
      // Fallback local add
      const newApp = { id: uuidv4(), createdAt: new Date().toISOString(), ...data };
      setApplications(prev => [newApp, ...prev]);
    }
  };

  const updateApplication = async (id, data) => {
    try {
      const appRef = doc(db, 'applications', id);
      await updateDoc(appRef, data);
    } catch (e) {
      console.error("Error updating document: ", e);
      // Fallback local update
      setApplications(prev => prev.map(app => app.id === id ? { ...app, ...data } : app));
    }
  };

  const deleteApplication = async (id) => {
    try {
      await deleteDoc(doc(db, 'applications', id));
    } catch (e) {
      console.error("Error deleting document: ", e);
      // Fallback local delete
      setApplications(prev => prev.filter(app => app.id !== id));
    }
  };

  const getApplication = (id) => applications.find(app => app.id === id);

  const seedData = async () => {
    setLoading(true);
    try {
      for (const app of defaultApps) {
        await addDoc(collection(db, 'applications'), {
          ...app,
          createdAt: new Date().toISOString()
        });
      }
      localStorage.setItem('migrated', 'true');
      console.log("Data seeded successfully");
    } catch (error) {
      console.error("Error seeding data:", error);
      setFirestoreError("Failed to seed data: " + (error?.message || String(error)));
    } finally {
      setLoading(false);
    }
  };

  const syncLocalData = async () => {
    setLoading(true);
    try {
      const saved = localStorage.getItem('applications');
      if (!saved) {
        console.log("No local data to sync.");
        setLoading(false);
        return;
      }
      
      const localApps = JSON.parse(saved);
      console.log(`Found ${localApps.length} local apps to sync...`);
      
      // Get current Firestore apps to avoid duplicates
      // We use the current 'applications' state which should be populated from Firestore
      const existingSignatures = new Set(applications.map(app => 
        `${app.universityName}|${app.program}|${app.applicationId || ''}`
      ));
      
      let addedCount = 0;
      for (const localApp of localApps) {
         const signature = `${localApp.universityName}|${localApp.program}|${localApp.applicationId || ''}`;
         
         if (existingSignatures.has(signature)) {
             console.log(`Skipping duplicate: ${localApp.universityName}`);
             continue;
         }
         
         // Remove local ID so Firestore generates a valid one
         // eslint-disable-next-line no-unused-vars
         const { id, ...appData } = localApp; 
         
         await addDoc(collection(db, 'applications'), {
             ...appData,
             createdAt: appData.createdAt || new Date().toISOString()
         });
         addedCount++;
      }
      
      console.log(`Successfully synced ${addedCount} new applications to Firestore.`);
    } catch (error) {
        console.error("Sync failed:", error);
        setFirestoreError("Sync failed: " + error.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <ApplicationContext.Provider value={{ applications, addApplication, updateApplication, deleteApplication, getApplication, loading, storageMode, firestoreError, seedData, syncLocalData }}>
      {children}
    </ApplicationContext.Provider>
  );
};
