
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pill, RefreshCw, Clock, CheckCircle, Plus, Search, AlertCircle, FileText, ChevronRight } from 'lucide-react';
import { MOCK_REFILL_REQUESTS, MOCK_PRESCRIPTIONS } from '../../constants';

const PrescriptionDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'Refills' | 'History'>('Refills');

  const pendingRefills = MOCK_REFILL_REQUESTS.filter(r => r.status === 'Pending');

  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 dark:text-white">E-Prescribing</h2>
           <p className="text-sm text-slate-500">Manage medications, refills, and EPCS compliance.</p>
        </div>
        <button 
          onClick={() => navigate('/prescriptions/new')}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition shadow-sm"
        >
          <Plus size={16} />
          <span>New Prescription</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
         {/* Main Content Area */}
         <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex gap-4">
               <button 
                 onClick={() => setActiveTab('Refills')}
                 className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'Refills' ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'}`}
               >
                  <RefreshCw size={16} />
                  <span>Refill Requests</span>
                  {pendingRefills.length > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">{pendingRefills.length}</span>}
               </button>
               <button 
                 onClick={() => setActiveTab('History')}
                 className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'History' ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'}`}
               >
                  <Clock size={16} />
                  <span>Prescription History</span>
               </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
               {activeTab === 'Refills' && (
                  <div className="space-y-4">
                     {pendingRefills.length === 0 ? (
                        <div className="text-center py-10 text-slate-400">
                           <CheckCircle size={48} className="mx-auto mb-2 opacity-20" />
                           <p>No pending refill requests.</p>
                        </div>
                     ) : (
                        pendingRefills.map(req => (
                           <div key={req.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                              <div className="flex justify-between items-start mb-2">
                                 <div>
                                    <h4 className="font-bold text-slate-800 dark:text-white">{req.patientName}</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{req.medicationName}</p>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                       <span>{req.pharmacyName}</span>
                                       <span>•</span>
                                       <span>Last Filled: {new Date(req.lastFillDate).toLocaleDateString()}</span>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <span className="text-xs font-bold text-primary-600 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded">
                                       Req: {req.requestedRefills} Refills
                                    </span>
                                    <p className="text-[10px] text-slate-400 mt-1">{req.receivedAt}</p>
                                 </div>
                              </div>
                              <div className="flex gap-3 mt-4">
                                 <button className="flex-1 bg-primary-600 text-white py-1.5 rounded text-sm font-medium hover:bg-primary-700 transition">Approve</button>
                                 <button className="flex-1 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 py-1.5 rounded text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700">Modify</button>
                                 <button className="flex-1 border border-red-200 text-red-600 py-1.5 rounded text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20">Deny</button>
                              </div>
                           </div>
                        ))
                     )}
                  </div>
               )}

               {activeTab === 'History' && (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                     {MOCK_PRESCRIPTIONS.map(rx => (
                        <div key={rx.id} className="py-3 flex justify-between items-center">
                           <div className="flex items-center gap-3">
                              <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded text-slate-500">
                                 <Pill size={18} />
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-slate-800 dark:text-white">{rx.medication.name} {rx.medication.strength}</p>
                                 <p className="text-xs text-slate-500">{rx.patientName} • {new Date(rx.prescribedDate).toLocaleDateString()}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                 rx.status === 'Active' ? 'bg-green-100 text-green-700' :
                                 rx.status === 'Filled' ? 'bg-blue-100 text-blue-700' :
                                 'bg-slate-100 text-slate-600'
                              }`}>
                                 {rx.status}
                              </span>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>

         {/* Sidebar / Stats */}
         <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
               <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <AlertCircle size={18} className="text-amber-500" /> Compliance Alerts
               </h3>
               <div className="space-y-3">
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-lg">
                     <p className="text-xs font-bold text-amber-800 dark:text-amber-200 mb-1">DEA License Expiring</p>
                     <p className="text-xs text-amber-700 dark:text-amber-300">Your DEA registration expires in 45 days. Please review renewal requirements.</p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
                     <p className="text-xs font-bold text-blue-800 dark:text-blue-200 mb-1">EPCS Audit</p>
                     <p className="text-xs text-blue-700 dark:text-blue-300">Monthly audit log report is ready for review.</p>
                  </div>
               </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-lg p-5 text-white">
               <h3 className="font-bold text-lg mb-1">EPCS Status</h3>
               <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium opacity-90">Active & Compliant</span>
               </div>
               <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white/10 rounded-lg p-2">
                     <p className="text-2xl font-bold">98%</p>
                     <p className="text-[10px] opacity-80 uppercase tracking-wide">E-Rx Rate</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-2">
                     <p className="text-2xl font-bold">12</p>
                     <p className="text-[10px] opacity-80 uppercase tracking-wide">Controlled Subs</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default PrescriptionDashboard;
