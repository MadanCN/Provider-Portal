import React from 'react';
import { Appointment, AppointmentStatus, AppointmentType } from '../../types';

interface AppointmentCalendarProps {
  appointments: Appointment[];
  viewMode: 'Day' | 'Week' | 'Month';
  currentDate: Date;
  onAppointmentClick: (appointment: Appointment) => void;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({ appointments, viewMode, currentDate, onAppointmentClick }) => {
  const hours = Array.from({ length: 13 }, (_, i) => i + 7); // 7 AM to 7 PM

  const getDayAppointments = (date: Date) => {
    return appointments.filter(appt => {
      const apptDate = new Date(appt.startTime);
      return apptDate.getDate() === date.getDate() &&
             apptDate.getMonth() === date.getMonth() &&
             apptDate.getFullYear() === date.getFullYear();
    });
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.CHECKED_IN: return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800';
      case AppointmentStatus.IN_PROGRESS: return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800';
      case AppointmentStatus.CANCELLED: return 'bg-red-50 text-red-700 border-red-100 opacity-60 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900';
      case AppointmentStatus.COMPLETED: return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
      default: return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
    }
  };

  // --- Month View ---
  if (viewMode === 'Month') {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDay }, (_, i) => i);

    return (
      <div className="h-full bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
         {/* Day Headers */}
         <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
               <div key={day} className="py-2 text-center text-xs font-semibold uppercase text-slate-500">{day}</div>
            ))}
         </div>
         
         {/* Calendar Grid */}
         <div className="flex-1 grid grid-cols-7 auto-rows-fr">
            {blanks.map(blank => <div key={`blank-${blank}`} className="bg-slate-50/50 dark:bg-slate-900/50 border-r border-b border-slate-100 dark:border-slate-800" />)}
            
            {days.map(day => {
               const currentDayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
               const dayAppts = getDayAppointments(currentDayDate);
               const isToday = new Date().toDateString() === currentDayDate.toDateString();

               return (
                  <div key={day} className={`min-h-[100px] border-r border-b border-slate-100 dark:border-slate-800 p-2 relative group ${isToday ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                     <span className={`text-sm font-medium ${isToday ? 'bg-primary-600 text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-slate-700 dark:text-slate-300'}`}>
                       {day}
                     </span>
                     
                     <div className="mt-1 space-y-1">
                        {dayAppts.slice(0, 3).map(appt => (
                           <div 
                             key={appt.id}
                             onClick={() => onAppointmentClick(appt)}
                             className={`text-[10px] px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-80 border-l-2 ${getStatusColor(appt.status)}`}
                           >
                             {new Date(appt.startTime).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})} {appt.patient.name}
                           </div>
                        ))}
                        {dayAppts.length > 3 && (
                           <div className="text-[10px] text-slate-400 pl-1">+ {dayAppts.length - 3} more</div>
                        )}
                     </div>
                     {/* Hover add button placeholder */}
                     <button className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 p-1 bg-primary-50 text-primary-600 rounded hover:bg-primary-100">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                     </button>
                  </div>
               );
            })}
         </div>
      </div>
    );
  }

  // --- Day View ---
  if (viewMode === 'Day') {
    const dayAppts = getDayAppointments(currentDate);

    return (
      <div className="h-full bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto relative">
           {/* Current Time Indicator (Visual Mock) */}
           <div className="absolute left-0 right-0 top-[35%] border-t-2 border-red-500 z-10 pointer-events-none opacity-50">
              <div className="absolute -top-2 -left-1 w-2 h-2 rounded-full bg-red-500"></div>
           </div>

           {hours.map(hour => (
             <div key={hour} className="flex border-b border-slate-100 dark:border-slate-800 min-h-[80px]">
               <div className="w-16 flex-shrink-0 border-r border-slate-200 dark:border-slate-700 p-2 text-xs text-slate-500 text-right">
                 {hour > 12 ? `${hour - 12} PM` : `${hour} ${hour === 12 ? 'PM' : 'AM'}`}
               </div>
               <div className="flex-1 relative p-1">
                 {/* Slots for this hour */}
                 {dayAppts.filter(a => new Date(a.startTime).getHours() === hour).map(appt => {
                    const minutes = new Date(appt.startTime).getMinutes();
                    const top = (minutes / 60) * 100;
                    const height = (appt.durationMinutes / 60) * 100;
                    
                    return (
                      <div 
                        key={appt.id}
                        onClick={() => onAppointmentClick(appt)}
                        className={`absolute left-2 right-2 rounded border px-2 py-1 cursor-pointer shadow-sm hover:shadow-md transition-all z-0 hover:z-10 ${getStatusColor(appt.status)}`}
                        style={{ top: `${top}%`, height: `${height}%`, minHeight: '30px' }}
                      >
                         <div className="flex justify-between">
                            <span className="font-semibold text-xs">{appt.patient.name}</span>
                            <span className="text-[10px] opacity-80">{appt.type}</span>
                         </div>
                         <div className="text-[10px] flex items-center gap-1">
                            <span>{new Date(appt.startTime).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})}</span>
                            <span>•</span>
                            <span>{appt.location}</span>
                         </div>
                      </div>
                    )
                 })}
               </div>
             </div>
           ))}
        </div>
      </div>
    );
  }

  // --- Week View ---
  // Simplified Week View: Columns = Days, Rows = Hours
  const weekStart = new Date(currentDate);
  weekStart.setDate(currentDate.getDate() - currentDate.getDay()); // Start on Sunday
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  return (
    <div className="h-full bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
       {/* Header */}
       <div className="flex border-b border-slate-200 dark:border-slate-700 ml-16">
          {weekDays.map(day => {
            const isToday = new Date().toDateString() === day.toDateString();
            return (
              <div key={day.toISOString()} className={`flex-1 py-2 text-center border-l border-slate-100 dark:border-slate-800 ${isToday ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                 <div className="text-xs text-slate-500 uppercase">{day.toLocaleDateString('en-US', {weekday: 'short'})}</div>
                 <div className={`text-sm font-bold inline-block w-7 h-7 leading-7 rounded-full ${isToday ? 'bg-primary-600 text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                    {day.getDate()}
                 </div>
              </div>
            )
          })}
       </div>

       {/* Grid */}
       <div className="flex-1 overflow-y-auto">
          {hours.map(hour => (
             <div key={hour} className="flex min-h-[60px] border-b border-slate-100 dark:border-slate-800">
                <div className="w-16 flex-shrink-0 border-r border-slate-200 dark:border-slate-700 p-2 text-xs text-slate-500 text-right">
                   {hour > 12 ? `${hour - 12} PM` : `${hour} ${hour === 12 ? 'PM' : 'AM'}`}
                </div>
                {weekDays.map(day => {
                   const cellAppts = getDayAppointments(day).filter(a => new Date(a.startTime).getHours() === hour);
                   return (
                      <div key={day.toISOString()} className="flex-1 border-l border-slate-100 dark:border-slate-800 relative p-0.5 group">
                         {cellAppts.map(appt => (
                            <div 
                              key={appt.id}
                              onClick={() => onAppointmentClick(appt)}
                              className={`mb-1 rounded px-1 py-0.5 text-[10px] truncate cursor-pointer border-l-2 ${getStatusColor(appt.status)}`}
                            >
                               <span className="font-semibold">{new Date(appt.startTime).toLocaleTimeString([], {hour:'numeric', minute:'2-digit'})}</span> {appt.patient.name}
                            </div>
                         ))}
                         {/* Placeholder for click-to-add */}
                         <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none group-hover:pointer-events-auto cursor-pointer hover:bg-primary-50/20" />
                      </div>
                   )
                })}
             </div>
          ))}
       </div>
    </div>
  );
};

export default AppointmentCalendar;