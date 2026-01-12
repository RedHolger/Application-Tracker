import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";


// TODO: Replace the following with your app's Firebase project configuration
// You can get this from the Firebase Console > Project Settings > General > Your Apps > SDK Setup and Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnEbsAgCeA9H8rPGMLy15sAiX_xpo57IA",
  authDomain: "master-22af5.firebaseapp.com",
  projectId: "master-22af5",
  storageBucket: "master-22af5.firebasestorage.app",
  messagingSenderId: "740134359256",
  appId: "1:740134359256:web:82e0aa2c0c5becf94807ad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// eslint-disable-next-line no-unused-vars
const analytics = getAnalytics(app);
// Initialize Cloud Firestore with long-polling to avoid hanging on restricted networks
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
