import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApplications } from '../context/ApplicationContext';
import { Edit2, Trash2, ExternalLink, FileText, DollarSign, Copy, Check, Key, User, Database, AlertTriangle, ArrowUpCircle, Calendar, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import { formatDistanceToNow, parseISO, isPast, isToday } from 'date-fns';

const StatusBadge = ({ status }) => {
  const styles = {
    'Not Started': 'bg-gray-100 text-gray-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'Submitted': 'bg-yellow-100 text-yellow-800',
    'Accepted': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800',
    'Waitlisted': 'bg-purple-100 text-purple-800',
  };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", styles[status] || styles['Not Started'])}>
      {status}
    </span>
  );
};

const CopyButton = ({ text, label }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-500 hover:text-gray-700"
      title={`Copy ${label}`}
    >
      {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
    </button>
  );
};

const DeadlineBadge = ({ date }) => {
  if (!date) return null;
  
  const deadlineDate = parseISO(date);
  const isExpired = isPast(deadlineDate) && !isToday(deadlineDate);
  const isDueSoon = !isExpired && (deadlineDate - new Date() < 7 * 24 * 60 * 60 * 1000); // 7 days

  return (
    <div className={cn(
      "flex items-center text-xs font-medium px-2 py-1 rounded mt-2",
      isExpired ? "bg-red-100 text-red-800" : 
      isDueSoon ? "bg-orange-100 text-orange-800" : 
      "bg-gray-100 text-gray-600"
    )}>
      <Clock className="h-3 w-3 mr-1" />
      {isExpired ? 'Overdue' : 'Due'} {formatDistanceToNow(deadlineDate, { addSuffix: true })}
    </div>
  );
};

const Dashboard = () => {
  const { applications, deleteApplication, loading, storageMode, firestoreError, seedData, syncLocalData } = useApplications();

  const stats = {
    total: applications.length,
    submitted: applications.filter(a => a.status === 'Submitted').length,
    accepted: applications.filter(a => a.status === 'Accepted').length,
    pendingFees: applications.filter(a => !a.feePaid && a.applicationFee > 0).length,
  };

  const openPortal = (url) => {
    if (!url) return;
    const width = 1000;
    const height = 800;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    window.open(
      url,
      'UniversityPortal',
      `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
    );
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-20">
        {firestoreError && (
          <div className="max-w-2xl mx-auto mb-6 bg-amber-50 border border-amber-200 text-amber-900 rounded-md p-4 text-left">
            <p className="font-medium">
              {storageMode === 'local' ? 'Firestore is not connected, using local data.' : 'Database Error'}
            </p>
            <p className="mt-1 text-sm break-words">{firestoreError}</p>
          </div>
        )}
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">No applications yet</h2>
        <p className="text-gray-500 mb-6">Start tracking your master's applications today.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/add"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Your First Application
          </Link>
          {storageMode === 'firestore' && (
            <button
              onClick={seedData}
              className="inline-flex items-center text-gray-600 px-6 py-3 rounded-md hover:bg-gray-100 border border-gray-300 transition-colors"
            >
              <Database className="h-4 w-4 mr-2" />
              Load Sample Data
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {firestoreError && (
        <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-900 rounded-md p-4 flex">
          <div className="flex-shrink-0">
             <AlertTriangle className="h-5 w-5 text-amber-400" />
          </div>
          <div className="ml-3">
            <p className="font-medium">
              {storageMode === 'local' ? 'Firestore is not connected, using local data.' : 'Database Error'}
            </p>
            <p className="mt-1 text-sm break-words">{firestoreError}</p>
          </div>
        </div>
      )}
      
      {/* Sync Button Toolbar */}
      {storageMode === 'firestore' && (
          <div className="flex justify-end mb-4">
              <button
                  onClick={syncLocalData}
                  className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-2 rounded-md transition-colors"
                  title="Upload any missing applications from your local storage to the cloud"
              >
                  <ArrowUpCircle className="h-4 w-4" />
                  <span>Import Local Data to Cloud</span>
              </button>
          </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Total Applications</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Submitted</p>
          <p className="text-2xl font-bold text-blue-600">{stats.submitted}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Accepted</p>
          <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Unpaid Fees</p>
          <p className="text-2xl font-bold text-orange-600">{stats.pendingFees}</p>
        </div>
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.map((app) => (
          <div key={app.id} className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{app.universityName}</h3>
                  <div className="flex flex-col">
                  <p className="text-sm text-gray-500 line-clamp-1">{app.program}</p>
                  {app.applicationId && (
                    <p className="text-xs text-gray-400 font-mono mt-0.5">ID: {app.applicationId}</p>
                  )}
                  <div className="flex">
                    <DeadlineBadge date={app.deadline} />
                  </div>
                </div>
                </div>
                <StatusBadge status={app.status} />
              </div>

              <div className="space-y-3 mb-4">
                {app.portalUrl && (
                   <button
                     onClick={() => openPortal(app.portalUrl)}
                     className="w-full flex items-center justify-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium mb-3"
                   >
                     <ExternalLink className="h-4 w-4" />
                     <span>Open Portal</span>
                   </button>
                )}

                {(app.username || app.password) && (
                  <div className="bg-gray-50 rounded-md p-2 space-y-2">
                    {app.username && (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-600 overflow-hidden">
                          <User className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                          <span className="truncate font-mono text-xs">{app.username}</span>
                        </div>
                        <CopyButton text={app.username} label="Username / ID" />
                      </div>
                    )}
                    {app.password && (
                      <div className="flex items-center justify-between text-sm">
                         <div className="flex items-center text-gray-600 overflow-hidden">
                          <Key className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                          <span className="truncate font-mono text-xs">••••••••</span>
                        </div>
                        <CopyButton text={app.password} label="Password" />
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-sm pt-2">
                  <span className="text-gray-500 flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" /> Fee:
                  </span>
                  <span className={cn("font-medium", app.feePaid ? "text-green-600" : "text-orange-600")}>
                    {app.applicationFee ? `$${app.applicationFee}` : 'N/A'} {app.feePaid ? '(Paid)' : '(Unpaid)'}
                  </span>
                </div>
                
                {app.scholarship && (
                  <div className="text-sm bg-blue-50 text-blue-800 px-2 py-1 rounded">
                    🎓 Scholarship: {app.scholarship}
                  </div>
                )}
              </div>

              {app.documents && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 mb-1 flex items-center">
                    <FileText className="h-3 w-3 mr-1" /> Documents
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {app.documents.split(',').map((doc, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200">
                        {doc.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center">
              <Link
                to={`/edit/${app.id}`}
                className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Edit2 className="h-4 w-4 mr-1.5" />
                Edit
              </Link>
              <button
                onClick={() => deleteApplication(app.id)}
                className="flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-1.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Dashboard;
