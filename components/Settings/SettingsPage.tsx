
import React, { useState } from 'react';
import { 
  User, Bell, Shield, Smartphone, Monitor, Moon, Volume2, 
  Lock, Key, Globe, Mail 
} from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Account');

  const tabs = [
    { id: 'Account', icon: <User size={18} /> },
    { id: 'Notifications', icon: <Bell size={18} /> },
    { id: 'Security', icon: <Shield size={18} /> },
    { id: 'Display', icon: <Monitor size={18} /> },
  ];

  return (
    <div className="p-6 h-[calc(100vh-64px)] overflow-y-auto bg-slate-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Settings</h2>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 flex-shrink-0">
             <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                {tabs.map(tab => (
                   <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors ${
                         activeTab === tab.id 
                         ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-l-4 border-primary-600' 
                         : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border-l-4 border-transparent'
                      }`}
                   >
                      {tab.icon}
                      <span>{tab.id}</span>
                   </button>
                ))}
             </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
             
             {activeTab === 'Account' && (
                <div className="space-y-6">
                   <h3 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">Profile Information</h3>
                   
                   <div className="flex items-center gap-4 mb-6">
                      <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-2xl font-bold text-slate-500">
                         DS
                      </div>
                      <div>
                         <button className="px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm font-medium hover:bg-slate-50">Change Avatar</button>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                         <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">First Name</label>
                         <input type="text" defaultValue="David" className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-transparent" />
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
                         <input type="text" defaultValue="Smith" className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-transparent" />
                      </div>
                      <div className="md:col-span-2">
                         <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                         <div className="flex items-center">
                            <Mail size={16} className="text-slate-400 mr-2" />
                            <input type="email" defaultValue="dr.smith@practmd.com" className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-transparent" />
                         </div>
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                         <input type="text" defaultValue="Medical Doctor (MD)" disabled className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-md bg-slate-100 dark:bg-slate-900 text-slate-500" />
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">NPI Number</label>
                         <input type="text" defaultValue="1234567890" disabled className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-md bg-slate-100 dark:bg-slate-900 text-slate-500" />
                      </div>
                   </div>
                   
                   <div className="flex justify-end pt-4">
                      <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition">Save Changes</button>
                   </div>
                </div>
             )}

             {activeTab === 'Notifications' && (
                <div className="space-y-6">
                   <h3 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">Notification Preferences</h3>
                   
                   {[
                      { title: 'New Appointment', desc: 'Receive alerts when a new appointment is booked.' },
                      { title: 'Message Received', desc: 'Get notified when a patient sends a secure message.' },
                      { title: 'Lab Results', desc: 'Alerts for new lab results requiring review.' },
                      { title: 'Task Assignments', desc: 'Notifications when tasks are assigned to you.' },
                      { title: 'System Updates', desc: 'News about Pract MD features and maintenance.' },
                   ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2">
                         <div>
                            <p className="font-medium text-slate-800 dark:text-white">{item.title}</p>
                            <p className="text-sm text-slate-500">{item.desc}</p>
                         </div>
                         <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name={`toggle-${idx}`} id={`toggle-${idx}`} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-300 checked:right-0 checked:border-green-400" defaultChecked />
                            <label htmlFor={`toggle-${idx}`} className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-300 cursor-pointer checked:bg-green-400"></label>
                         </div>
                      </div>
                   ))}
                </div>
             )}

             {activeTab === 'Security' && (
                <div className="space-y-6">
                   <h3 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">Security Settings</h3>
                   
                   <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full">
                               <Key size={20} className="text-slate-600 dark:text-slate-300"/>
                            </div>
                            <div>
                               <p className="font-medium text-slate-800 dark:text-white">Change Password</p>
                               <p className="text-sm text-slate-500">Last changed 3 months ago</p>
                            </div>
                         </div>
                         <button className="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-700">Update</button>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full">
                               <Smartphone size={20} className="text-slate-600 dark:text-slate-300"/>
                            </div>
                            <div>
                               <p className="font-medium text-slate-800 dark:text-white">Two-Factor Authentication (2FA)</p>
                               <p className="text-sm text-green-600 font-medium flex items-center gap-1">Enabled <Shield size={12}/></p>
                            </div>
                         </div>
                         <button className="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-700">Configure</button>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full">
                               <Lock size={20} className="text-slate-600 dark:text-slate-300"/>
                            </div>
                            <div>
                               <p className="font-medium text-slate-800 dark:text-white">Active Sessions</p>
                               <p className="text-sm text-slate-500">2 devices currently logged in</p>
                            </div>
                         </div>
                         <button className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">Log Out All</button>
                      </div>
                   </div>
                </div>
             )}
             
             {activeTab === 'Display' && (
                <div className="space-y-6">
                   <h3 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">Interface Preferences</h3>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                         <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Theme</label>
                         <select className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-transparent">
                            <option>System Default</option>
                            <option>Light Mode</option>
                            <option>Dark Mode</option>
                         </select>
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Density</label>
                         <select className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-transparent">
                            <option>Comfortable</option>
                            <option>Compact</option>
                         </select>
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Language</label>
                         <div className="flex items-center">
                            <Globe size={16} className="mr-2 text-slate-400" />
                            <select className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-transparent">
                               <option>English (US)</option>
                               <option>Spanish</option>
                               <option>French</option>
                            </select>
                         </div>
                      </div>
                   </div>
                </div>
             )}

          </div>
        </div>
      </div>
      
      <style>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #68D391;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #68D391;
        }
        .toggle-checkbox {
          right: auto;
          left: 0;
          transition: all 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default SettingsPage;
