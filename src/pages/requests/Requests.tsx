import React, { useState } from 'react';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Calendar, CheckSquare, Clock } from 'lucide-react';
import Button from '../../components/ui/Button';

// Sample data for demonstration
const initialRequests = [
  {
    id: '1',
    type: 'event',
    title: 'Client meeting with ABC Corp',
    description: 'Discuss new project requirements and timeline',
    startTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 14, 0),
    endTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 15, 0),
    location: 'Conference Room B',
    isRemote: false,
    category: 'work',
    importance: 'high',
    status: 'pending',
    emailSourceId: 'email123',
  },
  {
    id: '2',
    type: 'task',
    title: 'Complete quarterly report',
    description: 'Compile Q2 analytics and prepare executive summary',
    category: 'work',
    importance: 'high',
    status: 'pending',
    emailSourceId: 'email456',
  },
  {
    id: '3',
    type: 'event',
    title: 'Team lunch',
    description: 'Monthly team bonding activity',
    startTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 3, 12, 30),
    endTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 3, 14, 0),
    location: 'The Bistro',
    isRemote: false,
    category: 'work',
    importance: 'medium',
    status: 'pending',
    emailSourceId: 'email789',
  },
  {
    id: '4',
    type: 'task',
    title: 'Review design proposals',
    description: 'Give feedback on UI designs for the mobile app',
    category: 'work',
    importance: 'medium',
    status: 'pending',
    emailSourceId: 'email101',
  },
];

const Requests: React.FC = () => {
  const [requests, setRequests] = useState(initialRequests);
  const [autoAccept, setAutoAccept] = useState(false);
  
  const handleAccept = (id: string) => {
    setRequests(
      requests.map((request) =>
        request.id === id ? { ...request, status: 'accepted' } : request
      )
    );
  };
  
  const handleReject = (id: string) => {
    setRequests(
      requests.map((request) =>
        request.id === id ? { ...request, status: 'rejected' } : request
      )
    );
  };
  
  const pendingRequests = requests.filter((request) => request.status === 'pending');
  const processedRequests = requests.filter((request) => request.status !== 'pending');
  
  // Importance styles
  const importanceStyles: Record<string, string> = {
    high: 'border-l-4 border-error-500',
    medium: 'border-l-4 border-warning-500',
    low: 'border-l-4 border-success-500',
  };
  
  // Category styles
  const categoryStyles: Record<string, string> = {
    work: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200',
    personal: 'bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-200',
  };

  const formatDateRange = (start?: Date, end?: Date) => {
    if (!start || !end) return '';
    return `${format(start, 'MMM d, h:mm a')} - ${format(end, 'h:mm a')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
              Incoming Requests
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Review and accept commitments extracted from your emails
            </p>
          </div>
        </div>

        {/* Auto-accept toggle */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Auto-accept all requests</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                When enabled, all incoming requests will be automatically accepted
              </p>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="toggle"
                checked={autoAccept}
                onChange={() => setAutoAccept(!autoAccept)}
                className="sr-only"
              />
              <label
                htmlFor="toggle"
                className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
                  autoAccept ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${
                    autoAccept ? 'translate-x-4' : 'translate-x-0'
                  }`}
                ></span>
              </label>
            </div>
          </div>
        </div>

        {/* Pending requests */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-8">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Pending Requests ({pendingRequests.length})
            </h3>
          </div>
          
          {pendingRequests.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No pending requests</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                You don't have any pending requests to review
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {pendingRequests.map((request) => (
                <li
                  key={request.id}
                  className={`px-4 py-4 sm:px-6 ${importanceStyles[request.importance] || ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {request.type === 'event' ? (
                          <Calendar className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                        ) : (
                          <CheckSquare className="h-6 w-6 text-accent-500 dark:text-accent-400" />
                        )}
                      </div>
                      <div className="ml-4">
                        <h4 className="text-base font-medium text-gray-900 dark:text-white">
                          {request.title}
                        </h4>
                        {request.description && (
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {request.description}
                          </p>
                        )}
                        {request.startTime && request.endTime && (
                          <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                            {formatDateRange(request.startTime, request.endTime)}
                          </p>
                        )}
                        {request.location && (
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {request.isRemote ? '🌐 Remote' : `📍 ${request.location}`}
                          </p>
                        )}
                        <div className="mt-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              categoryStyles[request.category] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            }`}
                          >
                            {request.category}
                          </span>
                          <span
                            className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                          >
                            {request.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-error-500 dark:text-error-400 border-error-300 dark:border-error-700 hover:bg-error-50 dark:hover:bg-error-900/20"
                        onClick={() => handleReject(request.id)}
                        leftIcon={<XCircle size={16} />}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-success-500 dark:text-success-400 border-success-300 dark:border-success-700 hover:bg-success-50 dark:hover:bg-success-900/20"
                        onClick={() => handleAccept(request.id)}
                        leftIcon={<CheckCircle size={16} />}
                      >
                        Accept
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Processed requests */}
        {processedRequests.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Processed Requests
              </h3>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {processedRequests.map((request) => (
                <li
                  key={request.id}
                  className={`px-4 py-4 sm:px-6 ${importanceStyles[request.importance] || ''} opacity-75`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {request.type === 'event' ? (
                          <Calendar className="h-6 w-6 text-gray-400" />
                        ) : (
                          <CheckSquare className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="ml-4">
                        <h4 className="text-base font-medium text-gray-700 dark:text-gray-300">
                          {request.title}
                        </h4>
                        {request.description && (
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {request.description}
                          </p>
                        )}
                        <div className="mt-2 flex items-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              request.status === 'accepted'
                                ? 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200'
                                : 'bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200'
                            }`}
                          >
                            {request.status === 'accepted' ? 'Accepted' : 'Rejected'}
                          </span>
                          <span
                            className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              categoryStyles[request.category] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            }`}
                          >
                            {request.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;