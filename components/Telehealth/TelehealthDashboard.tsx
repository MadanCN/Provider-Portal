
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Clock, User, CheckCircle, AlertCircle, Calendar, Play, Settings, MoreHorizontal } from 'lucide-react';
import { MOCK_TELEHEALTH_SESSIONS, MOCK_WAITING_ROOM } from '../../constants';

const TelehealthDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 h-[calc(100vh-64px)] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Telehealth</h2>
           <p className="text-sm text-slate-500">Virtual Care Command Center</p>
        </div>
        <div className="flex gap-3">
          <button 
             onClick={() => navigate('/telehealth/check')}
             className="flex items-center space-x-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
             <Settings size={16} />
             <span>System Check</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-sm">
             <Video size={16} />
             <span>Instant Session</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Virtual Waiting Room */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
               <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-indigo-50 dark:bg-indigo-900/20">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                     <h3 className="font-bold text-slate-800 dark:text-white">Virtual Waiting Room</h3>
                     <span className="bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 text-xs px-2 py-0.5 rounded-full font-bold">
                        {MOCK_WAITING_ROOM.length} Waiting
                     </span>
                  </div>
               </div>
               
               <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {MOCK_WAITING_ROOM.length > 0 ? MOCK_WAITING_ROOM.map(patient => (
                     <div key={patient.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                              <User size={24} />
                           </div>
                           <div>
                              <h4 className="font-bold text-slate-900 dark:text-white">{patient.patientName}</h4>
                              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                 <span className="flex items-center gap-1"><Clock size={12}/> Arrived: {patient.arrivedAt}</span>
                                 <span className={`flex items-center gap-1 font-medium ${patient.status === 'Ready' ? 'text-green-600' : 'text-amber-500'}`}>
                                    {patient.status === 'Ready' ? <CheckCircle size={12}/> : <AlertCircle size={12}/>}
                                    Tech Check: {patient.status}
                                 </span>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="text-right">
                              <span className="block text-xs uppercase text-slate-400 font-bold">Wait Time</span>
                              <span className="text-lg font-mono font-bold text-red-500">{patient.waitTime}</span>
                           </div>
                           <button 
                              onClick={() => navigate('/telehealth/session/ts1')}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors"
                           >
                              <Video size={16} /> Admit
                           </button>
                        </div>
                     </div>
                  )) : (
                     <div className="p-8 text-center text-slate-400">
                        <User size={48} className="mx-auto mb-2 opacity-20" />
                        <p>Waiting room is empty.</p>
                     </div>
                  )}
               </div>
            </div>

            {/* Upcoming Schedule */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
               <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                     <Calendar size={18} className="text-slate-500" /> Upcoming Sessions
                  </h3>
               </div>
               <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {MOCK_TELEHEALTH_SESSIONS.filter(s => s.status === 'Scheduled').map(session => (
                     <div key={session.id} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="flex flex-col items-center bg-slate-50 dark:bg-slate-700 rounded p-2 min-w-[60px]">
                              <span className="text-xs text-slate-500 font-bold uppercase">{new Date(session.scheduledTime).toLocaleDateString(undefined, {weekday: 'short'})}</span>
                              <span className="text-lg font-bold text-slate-800 dark:text-white">{new Date(session.scheduledTime).getDate()}</span>
                           </div>
                           <div>
                              <div className="flex items-center gap-2">
                                 <h4 className="font-bold text-slate-900 dark:text-white">{session.patientName}</h4>
                                 <span className="bg-blue-50 text-blue-600 text-[10px] px-1.5 py-0.5 rounded border border-blue-100 uppercase font-bold">{session.status}</span>
                              </div>
                              <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                                 <Clock size={14} /> {new Date(session.scheduledTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {session.reason}
                              </p>
                           </div>
                        </div>
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-slate-600">
                           <MoreHorizontal size={18} />
                        </button>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Stats Sidebar */}
         <div className="space-y-6">
            <div className="bg-indigo-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
               <div className="relative z-10">
                  <h3 className="font-bold text-lg mb-1">Connection Quality</h3>
                  <div className="flex items-end gap-2 mb-4">
                     <span className="text-3xl font-bold">Excellent</span>
                     <span className="text-sm opacity-80 mb-1">HD Ready</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm opacity-90">
                     <div>
                        <span className="block text-xs uppercase tracking-wide opacity-70">Bandwidth</span>
                        <span className="font-mono">105 Mbps</span>
                     </div>
                     <div>
                        <span className="block text-xs uppercase tracking-wide opacity-70">Latency</span>
                        <span className="font-mono">12 ms</span>
                     </div>
                  </div>
               </div>
               <div className="absolute right-0 bottom-0 opacity-10">
                  <Video size={120} />
               </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
               <h3 className="font-bold text-slate-800 dark:text-white mb-4">Recent Completed</h3>
               <div className="space-y-3">
                  {MOCK_TELEHEALTH_SESSIONS.filter(s => s.status === 'Completed').map(s => (
                     <div key={s.id} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                              {s.patientName.charAt(0)}
                           </div>
                           <span className="text-slate-700 dark:text-slate-300">{s.patientName}</span>
                        </div>
                        <span className="text-slate-500 text-xs">{s.duration}m</span>
                     </div>
                  ))}
               </div>
               <button className="w-full mt-4 py-2 text-xs text-center text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 rounded border border-dashed border-slate-300 dark:border-slate-600">
                  View All History
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default TelehealthDashboard;