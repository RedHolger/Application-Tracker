import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useApplications } from '../context/ApplicationContext';
import { Save, ArrowLeft } from 'lucide-react';

const ApplicationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addApplication, updateApplication, getApplication } = useApplications();
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      status: 'Not Started',
      feePaid: false,
      documents: '',
    }
  });

  useEffect(() => {
    if (id) {
      const app = getApplication(id);
      if (app) {
        Object.keys(app).forEach(key => {
          setValue(key, app[key]);
        });
      }
    }
  }, [id, getApplication, setValue]);

  const onSubmit = (data) => {
    if (id) {
      updateApplication(id, data);
    } else {
      addApplication(data);
    }
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
      </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">{id ? 'Edit Application' : 'New Application'}</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">University Name</label>
              <input
                {...register('universityName', { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Stanford University"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
              <input
                {...register('program', { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. MS in Computer Science"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application ID / Reference No.</label>
              <input
                {...register('applicationId')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. APP-2024-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Portal URL</label>
              <input
                {...register('portalUrl')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. https://apply.stanford.edu/login"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Portal Username / ID</label>
              <input
                {...register('username')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Portal Password</label>
              <input
                {...register('password')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Not Started</option>
                <option>In Progress</option>
                <option>Submitted</option>
                <option>Accepted</option>
                <option>Rejected</option>
                <option>Waitlisted</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Action Required?</label>
              <div className="flex items-start space-x-4">
                 <div className="flex items-center h-5 mt-2">
                    <input
                      id="actionRequired"
                      type="checkbox"
                      {...register('actionRequired')}
                      className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300 rounded"
                    />
                 </div>
                 <div className="flex-1">
                    <input
                      {...register('actionDetails')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Details (e.g., Upload Transcript, Send Scores)"
                    />
                    <p className="mt-1 text-xs text-gray-500">Check if this university needs immediate attention.</p>
                 </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application Fee</label>
              <div className="flex items-center space-x-4">
                <input
                  {...register('applicationFee')}
                  type="number"
                  placeholder="Amount"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register('feePaid')}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span className="text-sm text-gray-700">Paid</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Scholarship / Funding</label>
              <input
                {...register('scholarship')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. $10,000 / RA position"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
              <input
                {...register('deadline')}
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Documents (comma separated)</label>
            <textarea
              {...register('documents')}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Resume, SOP, LOR1, LOR2, Transcript"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Application Response / Notes</label>
            <textarea
              {...register('notes')}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any response details, interview dates, or general notes..."
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="flex items-center bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Save className="h-5 w-5 mr-2" />
              Save Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
