import React, { useState } from 'react';
import { Appointment, AppointmentStatus } from '../../types';
import { Search, Filter, MoreHorizontal, Video, MapPin, CheckSquare, Square } from 'lucide-react';

interface AppointmentListProps {
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ appointments, onAppointmentClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = appointments.filter(a => 
    a.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map(a => a.id)));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col h-full overflow-hidden">
       {/* List Controls */}
       <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-64">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input 
               type="text" 
               placeholder="Search appointments..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none text-slate-700 dark:text-slate-200"
             />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
             <button className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                <Filter size={16} />
                <span>Filter</span>
             </button>
             {selectedIds.size > 0 && (
                <button className="px-3 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm hover:bg-red-100 flex items-center gap-2">
                   Cancel Selected ({selectedIds.size})
                </button>
             )}
          </div>
       </div>

       {/* Table */}
       <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
             <thead className="bg-slate-50 dark:bg-slate-900/50 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700 shadow-sm">
                <tr>
                   <th className="px-4 py-3 w-10">
                      <button onClick={toggleSelectAll} className="text-slate-400 hover:text-slate-600">
                         {selectedIds.size > 0 && selectedIds.size === filtered.length ? <CheckSquare size={16} /> : <Square size={16} />}
                      </button>
                   </th>
                   <th className="px-4 py-3">Time</th>
                   <th className="px-4 py-3">Patient</th>
                   <th className="px-4 py-3">Type</th>
                   <th className="px-4 py-3">Status</th>
                   <th className="px-4 py-3">Location</th>
                   <th className="px-4 py-3">Duration</th>
                   <th className="px-4 py-3 text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map(appt => (
                   <tr key={appt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer" onClick={() => onAppointmentClick(appt)}>
                      <td className="px-4 py-3" onClick={(e) => {e.stopPropagation(); toggleSelect(appt.id)}}>
                         <button className={`text-slate-400 hover:text-primary-600 ${selectedIds.has(appt.id) ? 'text-primary-600' : ''}`}>
                            {selectedIds.has(appt.id) ? <CheckSquare size={16} /> : <Square size={16} />}
                         </button>
                      </td>
                      <td className="px-4 py-3">
                         <div className="font-medium text-slate-800 dark:text-slate-200">
                            {new Date(appt.startTime).toLocaleDateString()}
                         </div>
                         <div className="text-xs text-slate-500">
                            {new Date(appt.startTime).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})}
                         </div>
                      </td>
                      <td className="px-4 py-3">
                         <div className="font-medium text-slate-800 dark:text-slate-200">{appt.patient.name}</div>
                         <div className="text-xs text-slate-500">DOB: {new Date(appt.patient.dob).toLocaleDateString()}</div>
                      </td>
                      <td className="px-4 py-3">
                         <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs text-slate-600 dark:text-slate-300">
                           {appt.type}
                         </span>
                      </td>
                      <td className="px-4 py-3">
                         <span className={`px-2 py-1 rounded-full text-xs font-bold 
                           ${appt.status === AppointmentStatus.CHECKED_IN ? 'bg-green-100 text-green-700' : 
                             appt.status === AppointmentStatus.CANCELLED ? 'bg-red-100 text-red-700' : 
                             appt.status === AppointmentStatus.IN_PROGRESS ? 'bg-purple-100 text-purple-700' :
                             'bg-blue-100 text-blue-700'}`}>
                            {appt.status}
                         </span>
                      </td>
                      <td className="px-4 py-3">
                         <div className="flex items-center gap-1.5 text-xs">
                            {appt.type === 'Telehealth' ? <Video size={14} className="text-primary-500"/> : <MapPin size={14} className="text-slate-400"/>}
                            {appt.location}
                         </div>
                      </td>
                      <td className="px-4 py-3">{appt.durationMinutes} min</td>
                      <td className="px-4 py-3 text-right">
                         <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                            <MoreHorizontal size={16} />
                         </button>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );
};

export default AppointmentList;