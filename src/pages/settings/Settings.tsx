import React, { useState } from 'react';
import { MapPin, User, Clock, CreditCard, Trash, Mail, Calendar } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

// Sample data for demonstration
const initialUserProfile = {
  fullName: 'Alex Johnson',
  email: 'alex@example.com',
  homeAddress: '123 Main St, Anytown, CA 94000',
  workAddress: '456 Business Ave, Suite 200, Anytown, CA 94001',
  timezone: 'America/Los_Angeles',
  autoAccept: false,
  emailRetention: '6m' as '3m' | '6m' | '1y',
};

const initialConnectedAccounts = [
  {
    id: '1',
    type: 'email',
    provider: 'Gmail',
    account: 'alex@gmail.com',
    connected: true,
  },
  {
    id: '2',
    type: 'calendar',
    provider: 'Google Calendar',
    account: 'alex@gmail.com',
    connected: true,
  },
  {
    id: '3',
    type: 'email',
    provider: 'Outlook',
    account: 'alex@outlook.com',
    connected: false,
  },
];

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'connections' | 'subscription'>('general');
  const [profile, setProfile] = useState(initialUserProfile);
  const [connectedAccounts, setConnectedAccounts] = useState(initialConnectedAccounts);
  const [isEditing, setIsEditing] = useState(false);
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setProfile({
      ...profile,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };
  
  const handleSaveProfile = () => {
    // Save profile to database
    console.log('Saving profile:', profile);
    setIsEditing(false);
  };
  
  const handleConnectAccount = (provider: string, type: 'email' | 'calendar') => {
    console.log(`Connecting ${type} account: ${provider}`);
    // This would trigger OAuth flow in a real app
  };
  
  const handleDisconnectAccount = (id: string) => {
    setConnectedAccounts(
      connectedAccounts.map((account) =>
        account.id === id ? { ...account, connected: false } : account
      )
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
              Your Details
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your account settings and preferences
            </p>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mb-6">
          <div className="sm:hidden">
            <select
              id="tabs"
              name="tabs"
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as any)}
            >
              <option value="general">General</option>
              <option value="connections">Connections</option>
              <option value="subscription">Subscription</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <nav className="flex space-x-4" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('general')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'general'
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <User className="h-4 w-4 inline-block mr-1" />
                General
              </button>
              <button
                onClick={() => setActiveTab('connections')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'connections'
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Mail className="h-4 w-4 inline-block mr-1" />
                Connections
              </button>
              <button
                onClick={() => setActiveTab('subscription')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'subscription'
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <CreditCard className="h-4 w-4 inline-block mr-1" />
                Subscription
              </button>
            </nav>
          </div>
        </div>
        
        {/* Tab content */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  Personal Information
                </h3>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setProfile(initialUserProfile);
                        setIsEditing(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSaveProfile}
                    >
                      Save
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Input
                    label="Full Name"
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    leftElement={<User size={18} />}
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    disabled={true} // Email should not be editable
                    leftElement={<Mail size={18} />}
                    helper="You cannot change your email address"
                  />
                </div>
                
                <div>
                  <Input
                    label="Home Address"
                    name="homeAddress"
                    value={profile.homeAddress}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    leftElement={<MapPin size={18} />}
                  />
                </div>
                
                <div>
                  <Input
                    label="Work Address"
                    name="workAddress"
                    value={profile.workAddress}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    leftElement={<MapPin size={18} />}
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Timezone
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock size={18} className="text-gray-500" />
                      </div>
                      <select
                        id="timezone"
                        name="timezone"
                        className="block w-full pl-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-white"
                        value={profile.timezone}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                      >
                        <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                        <option value="America/Denver">Mountain Time (US & Canada)</option>
                        <option value="America/Chicago">Central Time (US & Canada)</option>
                        <option value="America/New_York">Eastern Time (US & Canada)</option>
                        <option value="America/Anchorage">Alaska</option>
                        <option value="Pacific/Honolulu">Hawaii</option>
                        <option value="Europe/London">London</option>
                        <option value="Europe/Paris">Paris</option>
                        <option value="Asia/Tokyo">Tokyo</option>
                        <option value="Australia/Sydney">Sydney</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="emailRetention" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Retention
                    </label>
                    <select
                      id="emailRetention"
                      name="emailRetention"
                      className="block w-full py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-white"
                      value={profile.emailRetention}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    >
                      <option value="3m">3 months</option>
                      <option value="6m">6 months</option>
                      <option value="1y">1 year</option>
                    </select>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Emails older than this will be automatically purged
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="autoAccept"
                    name="autoAccept"
                    type="checkbox"
                    checked={profile.autoAccept}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded disabled:opacity-50"
                  />
                  <label htmlFor="autoAccept" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Auto-accept all incoming requests
                  </label>
                </div>
              </div>
            </div>
          )}
          
          {/* Connections */}
          {activeTab === 'connections' && (
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-6">
                Your Connected Accounts
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-medium text-gray-900 dark:text-white mb-3">
                    Email Accounts
                  </h4>
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-md">
                    {connectedAccounts
                      .filter((account) => account.type === 'email')
                      .map((account) => (
                        <li key={account.id} className="px-4 py-3 flex items-center justify-between">
                          <div className="flex items-center">
                            <Mail className="h-5 w-5 text-gray-400" />
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {account.provider}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {account.account}
                              </p>
                            </div>
                          </div>
                          {account.connected ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-error-500 dark:text-error-400 border-error-300 dark:border-error-700 hover:bg-error-50 dark:hover:bg-error-900/20"
                              leftIcon={<Trash size={16} />}
                              onClick={() => handleDisconnectAccount(account.id)}
                            >
                              Disconnect
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleConnectAccount(account.provider, 'email')}
                            >
                              Connect
                            </Button>
                          )}
                        </li>
                      ))}
                    <li className="px-4 py-3 flex justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Mail size={16} />}
                        onClick={() => handleConnectAccount('New Email', 'email')}
                      >
                        Connect new email account
                      </Button>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-base font-medium text-gray-900 dark:text-white mb-3">
                    Calendar Accounts
                  </h4>
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-md">
                    {connectedAccounts
                      .filter((account) => account.type === 'calendar')
                      .map((account) => (
                        <li key={account.id} className="px-4 py-3 flex items-center justify-between">
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {account.provider}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {account.account}
                              </p>
                            </div>
                          </div>
                          {account.connected ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-error-500 dark:text-error-400 border-error-300 dark:border-error-700 hover:bg-error-50 dark:hover:bg-error-900/20"
                              leftIcon={<Trash size={16} />}
                              onClick={() => handleDisconnectAccount(account.id)}
                            >
                              Disconnect
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleConnectAccount(account.provider, 'calendar')}
                            >
                              Connect
                            </Button>
                          )}
                        </li>
                      ))}
                    <li className="px-4 py-3 flex justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Calendar size={16} />}
                        onClick={() => handleConnectAccount('New Calendar', 'calendar')}
                      >
                        Connect new calendar
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {/* Subscription */}
          {activeTab === 'subscription' && (
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-6">
                Your Subscription
              </h3>
              
              <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-md p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CreditCard className="h-5 w-5 text-primary-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-primary-800 dark:text-primary-300">
                      Trial Period Active
                    </h3>
                    <div className="mt-2 text-sm text-primary-700 dark:text-primary-400">
                      <p>You're currently on a free trial that ends in 5 days. Enjoy all premium features!</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="px-4 py-5 bg-gray-50 dark:bg-gray-800 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white">
                      Current Plan: <span className="text-primary-600 dark:text-primary-400">Free Trial</span>
                    </h3>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Billing Cycle
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                          Monthly
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Next Billing Date
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                          June 22, 2025
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Amount
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                          $12.99 / month
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Payment Method
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                          Visa •••• 4242
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div className="px-4 py-4 sm:px-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      Update payment method
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20"
                    >
                      Cancel subscription
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-base font-medium text-gray-900 dark:text-white mb-3">
                    Billing History
                  </h4>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 grid grid-cols-4">
                      <div>Date</div>
                      <div>Description</div>
                      <div>Amount</div>
                      <div>Status</div>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      <div className="px-4 py-3 text-sm text-gray-900 dark:text-white grid grid-cols-4">
                        <div>Jun 22, 2025</div>
                        <div>Subscription Payment</div>
                        <div>$12.99</div>
                        <div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200">
                            Paid
                          </span>
                        </div>
                      </div>
                      <div className="px-4 py-3 text-sm text-gray-900 dark:text-white grid grid-cols-4">
                        <div>May 22, 2025</div>
                        <div>Subscription Payment</div>
                        <div>$12.99</div>
                        <div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200">
                            Paid
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;