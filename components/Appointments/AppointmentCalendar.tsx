
import React from 'react';
import { Appointment, AppointmentStatus, AvailabilitySlot } from '../../types';

interface AppointmentCalendarProps {
  appointments: Appointment[];
  availabilitySlots?: AvailabilitySlot[];
  viewMode: 'Day' | 'Week' | 'Month';
  currentDate: Date;
  onAppointmentClick: (appointment: Appointment) => void;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({ appointments, availabilitySlots = [], viewMode, currentDate, onAppointmentClick }) => {
  const hours = Array.from({ length: 13 }, (_, i) => i + 7); // 7 AM to 7 PM

  const getDayAppointments = (date: Date) => {
    return appointments.filter(appt => {
      const apptDate = new Date(appt.startTime);
      return apptDate.getDate() === date.getDate() &&
             apptDate.getMonth() === date.getMonth() &&
             apptDate.getFullYear() === date.getFullYear();
    });
  };

  // Helper to determine if a slot intersects with a specific Hour on a specific Day
  const getSlotsForHour = (date: Date, hour: number) => {
    return availabilitySlots.filter(slot => {
      const slotStart = new Date(slot.start);
      const slotEnd = new Date(slot.end);
      
      // 1. Check Date Match (Specific or Recurring)
      let isDayMatch = false;
      if (slot.isRecurring) {
        if (slot.recurringDays?.includes(date.getDay())) {
          isDayMatch = true;
        }
      } else {
        // Simple date check (ignoring time for the day match part)
        const checkDate = new Date(date); 
        checkDate.setHours(0,0,0,0);
        const sDate = new Date(slotStart); 
        sDate.setHours(0,0,0,0);
        const eDate = new Date(slotEnd); 
        eDate.setHours(0,0,0,0);
        
        if (checkDate >= sDate && checkDate <= eDate) {
          isDayMatch = true;
        }
      }

      if (!isDayMatch) return false;

      // 2. Check Time Intersection
      const slotStartHour = slotStart.getHours();
      const slotEndHour = slotEnd.getHours();
      
      // Logic: Does the slot exist within this hour block?
      // A slot exists in hour X if:
      // - It starts in hour X (startHour == X)
      // - It ends in hour X (endHour == X, AND minutes > 0)
      // - It spans across hour X (startHour < X < endHour)
      
      if (hour > slotStartHour && hour < slotEndHour) return true;
      if (hour === slotStartHour) return true;
      if (hour === slotEndHour && slotEnd.getMinutes() > 0) return true;

      return false;
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

               // Check if there's an all-day leave
               const onLeave = availabilitySlots.some(s => {
                  if (s.type !== 'Leave') return false;
                  // Simplified recurring/date check for month view icon
                  if (s.isRecurring) return s.recurringDays?.includes(currentDayDate.getDay());
                  const sDate = new Date(s.start); sDate.setHours(0,0,0,0);
                  const eDate = new Date(s.end); eDate.setHours(0,0,0,0);
                  const cDate = new Date(currentDayDate); cDate.setHours(0,0,0,0);
                  return cDate >= sDate && cDate <= eDate;
               });

               return (
                  <div key={day} className={`min-h-[100px] border-r border-b border-slate-100 dark:border-slate-800 p-2 relative group ${isToday ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''} ${onLeave ? 'bg-slate-50 dark:bg-slate-900/50' : ''}`}>
                     <div className="flex justify-between items-start">
                        <span className={`text-sm font-medium ${isToday ? 'bg-primary-600 text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-slate-700 dark:text-slate-300'}`}>
                          {day}
                        </span>
                        {onLeave && <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-500 px-1.5 rounded">OFF</span>}
                     </div>
                     
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
                 
                 {/* Render Availability Blocks (Breaks/Leaves) */}
                 {getSlotsForHour(currentDate, hour).map(slot => {
                    // Calculate visual dimensions for slot
                    const sStart = new Date(slot.start);
                    const sEnd = new Date(slot.end);
                    
                    let startMin = sStart.getMinutes();
                    // If slot started in a previous hour, visual start is 0
                    if (sStart.getHours() < hour) startMin = 0;

                    let durationMin = (sEnd.getTime() - sStart.getTime()) / (1000 * 60);
                    // If slot extends beyond this hour, cap visual end
                    // But simpler to just calc local height
                    // Local start in minutes relative to this hour:
                    const top = (startMin / 60) * 100;
                    
                    // Duration within this hour box?
                    // End time in this hour
                    let endMin = 60;
                    if (sEnd.getHours() === hour) endMin = sEnd.getMinutes();
                    else if (sEnd.getHours() < hour) endMin = 0; // Should not happen given getSlotsForHour filter
                    
                    const height = ((endMin - startMin) / 60) * 100;

                    return (
                       <div 
                          key={`slot-${slot.id}-${hour}`}
                          className="absolute left-0 right-0 z-0 bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center border-y border-slate-200 dark:border-slate-600 opacity-80"
                          style={{ top: `${top}%`, height: `${height}%` }}
                          title={slot.title}
                       >
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{slot.title}</span>
                       </div>
                    );
                 })}

                 {/* Slots for this hour (Appointments) */}
                 {dayAppts.filter(a => new Date(a.startTime).getHours() === hour).map(appt => {
                    const minutes = new Date(appt.startTime).getMinutes();
                    const top = (minutes / 60) * 100;
                    const height = (appt.durationMinutes / 60) * 100;
                    
                    return (
                      <div 
                        key={appt.id}
                        onClick={() => onAppointmentClick(appt)}
                        className={`absolute left-2 right-2 rounded border px-2 py-1 cursor-pointer shadow-sm hover:shadow-md transition-all z-10 hover:z-20 ${getStatusColor(appt.status)}`}
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
  // Week View: Columns = Days, Rows = Hours
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
                   const blockSlots = getSlotsForHour(day, hour);

                   return (
                      <div key={day.toISOString()} className="flex-1 border-l border-slate-100 dark:border-slate-800 relative p-0.5 group">
                         
                         {/* Render Availability Blocks */}
                         {blockSlots.map(slot => {
                            const sStart = new Date(slot.start);
                            const sEnd = new Date(slot.end);
                            let startMin = sStart.getHours() < hour ? 0 : sStart.getMinutes();
                            let endMin = sEnd.getHours() > hour ? 60 : sEnd.getMinutes();
                            if (sEnd.getHours() === hour && sEnd.getMinutes() === 0) endMin = 0; // Handle exact hour end if logic falls through (usually captured by > hour) but simpler:
                            if (sEnd.getHours() > hour) endMin = 60;

                            const top = (startMin / 60) * 100;
                            const height = ((endMin - startMin) / 60) * 100;

                            return (
                               <div 
                                  key={`block-${slot.id}`}
                                  className="absolute left-0 right-0 bg-slate-100 dark:bg-slate-700/50 z-0 flex items-center justify-center opacity-80"
                                  style={{ top: `${top}%`, height: `${height}%` }}
                                  title={slot.title}
                               >
                                  <span className="text-[8px] text-slate-400 uppercase font-bold tracking-wider rotate-0 opacity-0 group-hover:opacity-100 transition-opacity">{slot.title}</span>
                               </div>
                            );
                         })}

                         {/* Render Appointments */}
                         {cellAppts.map(appt => (
                            <div 
                              key={appt.id}
                              onClick={() => onAppointmentClick(appt)}
                              className={`relative z-10 mb-1 rounded px-1 py-0.5 text-[10px] truncate cursor-pointer border-l-2 shadow-sm hover:shadow ${getStatusColor(appt.status)}`}
                            >
                               <span className="font-semibold">{new Date(appt.startTime).toLocaleTimeString([], {hour:'numeric', minute:'2-digit'})}</span> {appt.patient.name}
                            </div>
                         ))}
                         {/* Placeholder for click-to-add */}
                         <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none group-hover:pointer-events-auto cursor-pointer hover:bg-primary-50/20 z-0" />
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
