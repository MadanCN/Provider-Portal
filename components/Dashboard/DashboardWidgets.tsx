import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  AlertCircle, CheckCircle2, Clock, FileText, Activity, 
  Calendar, UserPlus, FileWarning, ArrowRight 
} from 'lucide-react';
import { 
  MOCK_APPOINTMENTS, MOCK_ALERTS, MOCK_NOTES, MOCK_ACTIVITY,
} from '../../constants';
import { Appointment, AppointmentStatus } from '../../types';

// --- Helper Components ---
const WidgetHeader: React.FC<{ title: string; icon?: React.ReactNode }> = ({ title, icon }) => (
  <div className="flex items-center space-x-2 mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">
    {icon && <span className="text-primary-600 dark:text-primary-400">{icon}</span>}
    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 uppercase tracking-wide">{title}</h3>
  </div>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-32 text-slate-400 dark:text-slate-500">
    <p className="text-sm">{message}</p>
  </div>
);

// --- Widgets ---

export const AlertPanelWidget: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <WidgetHeader title="Priority Alerts" icon={<AlertCircle size={18} />} />
      <div className="flex-1 overflow-y-auto pr-2 space-y-2 scrollbar-hide">
        {MOCK_ALERTS.map(alert => (
          <div key={alert.id} className={`p-3 rounded-lg border-l-4 shadow-sm flex justify-between items-start transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
            alert.priority === 'CRITICAL' ? 'border-red-500 bg-red-50/50 dark:bg-red-900/10' : 
            alert.priority === 'HIGH' ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-900/10' : 
            'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
          }`}>
            <div>
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                   alert.priority === 'CRITICAL' ? 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900' : 
                   'text-slate-600 bg-slate-100 dark:text-slate-300 dark:bg-slate-700'
                }`}>
                  {alert.category}
                </span>
                <span className="font-medium text-sm text-slate-800 dark:text-slate-200">{alert.title}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{alert.description}</p>
            </div>
            <span className="text-[10px] text-slate-400 whitespace-nowrap">10m ago</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TodayScheduleWidget: React.FC = () => {
  const todaysAppts = MOCK_APPOINTMENTS.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  
  return (
    <div className="h-full flex flex-col">
      <WidgetHeader title="Today's Schedule" icon={<Calendar size={18} />} />
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-hide">
        {todaysAppts.map(appt => {
          const time = new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const isCompleted = appt.status === AppointmentStatus.COMPLETED;
          
          return (
            <div key={appt.id} className="flex items-center group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md p-1 transition-colors">
              <div className="w-16 flex-shrink-0 text-center">
                <span className="block text-sm font-bold text-slate-700 dark:text-slate-300">{time}</span>
                <span className="block text-[10px] text-slate-400">{appt.durationMinutes}m</span>
              </div>
              <div className="flex-1 border-l-2 border-slate-200 dark:border-slate-700 pl-3 ml-2 relative">
                <div className={`absolute -left-[5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${
                  appt.status === AppointmentStatus.CHECKED_IN ? 'bg-green-500' :
                  appt.status === AppointmentStatus.IN_PROGRESS ? 'bg-blue-500 animate-pulse' :
                  'bg-slate-300 dark:bg-slate-600'
                }`} />
                <h4 className={`text-sm font-medium ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-200'}`}>
                  {appt.patient.name}
                </h4>
                <div className="flex items-center space-x-2 text-xs text-slate-500">
                  <span>{appt.type}</span>
                  {appt.reason && <span>• {appt.reason}</span>}
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity px-2">
                 <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500">
                    <ArrowRight size={14} />
                 </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const NewAppointmentsWidget: React.FC = () => {
  const newAppts = MOCK_APPOINTMENTS.filter(a => a.isNew);
  
  return (
    <div className="h-full flex flex-col">
       <WidgetHeader title="New Appointments" icon={<UserPlus size={18} />} />
       <div className="flex-1 overflow-y-auto scrollbar-hide">
         {newAppts.length === 0 ? <EmptyState message="No new appointments" /> : (
           <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
             <thead className="bg-slate-50 dark:bg-slate-800/50 uppercase tracking-wider font-semibold">
               <tr>
                 <th className="px-3 py-2">Patient</th>
                 <th className="px-3 py-2">Scheduled For</th>
                 <th className="px-3 py-2">Added</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
               {newAppts.map(appt => (
                 <tr key={appt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                   <td className="px-3 py-2 font-medium text-slate-800 dark:text-slate-200">{appt.patient.name}</td>
                   <td className="px-3 py-2">{new Date(appt.startTime).toLocaleDateString()}</td>
                   <td className="px-3 py-2 text-primary-600 dark:text-primary-400">Today</td>
                 </tr>
               ))}
             </tbody>
           </table>
         )}
       </div>
    </div>
  );
};

export const PendingNotesWidget: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <WidgetHeader title="Pending Notes" icon={<FileWarning size={18} />} />
      <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
        {MOCK_NOTES.map(note => (
          <div key={note.id} className="flex justify-between items-center p-2 rounded border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 transition-all">
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{note.patientName}</p>
              <p className="text-xs text-slate-500">{note.type} • {note.visitDate}</p>
            </div>
            <div className="text-right">
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                note.daysPending > 5 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
              }`}>
                {note.daysPending} days
              </span>
              <button className="block mt-1 text-xs text-primary-600 hover:underline ml-auto">Sign Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PatientCompositionChart: React.FC = () => {
  const data = [
    { name: 'Mon', New: 4, FollowUp: 12 },
    { name: 'Tue', New: 3, FollowUp: 15 },
    { name: 'Wed', New: 5, FollowUp: 10 },
    { name: 'Thu', New: 2, FollowUp: 14 },
    { name: 'Fri', New: 6, FollowUp: 11 },
  ];

  return (
    <div className="h-full flex flex-col">
      <WidgetHeader title="Patient Mix" icon={<Activity size={18} />} />
      <div className="flex-1 min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
            <Bar dataKey="New" stackId="a" fill="#6366f1" radius={[0, 0, 4, 4]} />
            <Bar dataKey="FollowUp" stackId="a" fill="#e0e7ff" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const AppointmentStatusChart: React.FC = () => {
  const data = [
    { name: 'Completed', value: 65, color: '#22c55e' },
    { name: 'No Show', value: 10, color: '#ef4444' },
    { name: 'Cancelled', value: 15, color: '#f59e0b' },
    { name: 'Scheduled', value: 10, color: '#3b82f6' },
  ];

  return (
    <div className="h-full flex flex-col">
      <WidgetHeader title="Appt Status (Week)" icon={<CheckCircle2 size={18} />} />
      <div className="flex-1 min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const RecentActivityWidget: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <WidgetHeader title="Recent Activity" icon={<Clock size={18} />} />
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
        {MOCK_ACTIVITY.map(act => (
          <div key={act.id} className="relative pl-4 border-l border-slate-200 dark:border-slate-700 pb-2 last:pb-0">
            <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600 ring-4 ring-white dark:ring-slate-900"></div>
            <p className="text-sm text-slate-800 dark:text-slate-200 leading-snug">{act.description}</p>
            <span className="text-[10px] text-slate-400">{act.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const UpcomingAppointmentsWidget: React.FC = () => {
    // Re-using logic or simplified view
    return (
        <div className="h-full flex flex-col">
            <WidgetHeader title="Upcoming" icon={<Calendar size={18}/>} />
            <div className="flex-1 flex flex-col justify-center items-center text-slate-400">
                <FileText size={24} className="mb-2 opacity-50"/>
                <span className="text-xs">View full schedule</span>
            </div>
        </div>
    )
}