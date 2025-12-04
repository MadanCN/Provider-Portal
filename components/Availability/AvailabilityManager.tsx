
import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, Clock, Plus, Trash2, 
  ChevronLeft, ChevronRight, CheckCircle, X, Repeat 
} from 'lucide-react';
import { MOCK_AVAILABILITY } from '../../constants';
import { AvailabilitySlot, AvailabilityType } from '../../types';

const AvailabilityManager: React.FC = () => {
  const [slots, setSlots] = useState<AvailabilitySlot[]>(MOCK_AVAILABILITY);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSlot, setNewSlot] = useState<{
    title: string;
    type: AvailabilityType;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    isRecurring: boolean;
    recurringDays: number[];
  }>({
    title: '',
    type: 'Leave',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '17:00',
    isRecurring: false,
    recurringDays: [1, 2, 3, 4, 5] // Default Mon-Fri
  });

  // --- Calendar Logic (Weekly View) ---
  const hours = Array.from({ length: 13 }, (_, i) => i + 7); // 7 AM to 7 PM

  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day; // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  };

  const currentWeekStart = getWeekStart(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(currentWeekStart);
    d.setDate(currentWeekStart.getDate() + i);
    return d;
  });

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const goToToday = () => setCurrentDate(new Date());

  // --- Slot Logic ---

  const getSlotsForDay = (day: Date) => {
    return slots.filter(s => {
      const slotStart = new Date(s.start);
      const slotEnd = new Date(s.end);
      
      // 1. Check direct date match
      const isSameDate = slotStart.getDate() === day.getDate() && 
                         slotStart.getMonth() === day.getMonth() && 
                         slotStart.getFullYear() === day.getFullYear();

      // 2. Check Recurring
      if (s.isRecurring) {
         // Check if this day of week is included in recurringDays
         if (s.recurringDays && s.recurringDays.includes(day.getDay())) {
            return true;
         }
         return false; // Only show on specific days
      }

      // 3. Check Multi-day span (Simple check: is day within start/end range)
      if (day >= new Date(slotStart.setHours(0,0,0,0)) && day <= new Date(slotEnd.setHours(23,59,59,999))) {
         return true;
      }

      return isSameDate;
    });
  };

  const handleAddSlot = () => {
    const start = new Date(`${newSlot.startDate}T${newSlot.startTime}`);
    const end = new Date(`${newSlot.endDate}T${newSlot.endTime}`);
    
    const slot: AvailabilitySlot = {
      id: `av_${Date.now()}`,
      title: newSlot.title,
      type: newSlot.type,
      start: start.toISOString(),
      end: end.toISOString(),
      isRecurring: newSlot.isRecurring,
      recurrenceRule: newSlot.isRecurring ? 'Weekly' : undefined,
      recurringDays: newSlot.isRecurring ? newSlot.recurringDays : undefined,
      color: newSlot.type === 'Leave' ? 'red' : 'orange'
    };

    setSlots([...slots, slot]);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if(confirm('Delete this availability slot?')) {
      setSlots(slots.filter(s => s.id !== id));
    }
  };

  const toggleRecurringDay = (dayIndex: number) => {
     setNewSlot(prev => {
        const days = prev.recurringDays.includes(dayIndex) 
           ? prev.recurringDays.filter(d => d !== dayIndex)
           : [...prev.recurringDays, dayIndex];
        return { ...prev, recurringDays: days };
     });
  };

  const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="p-6 h-[calc(100vh-64px)] overflow-y-auto bg-slate-50 dark:bg-slate-900">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Availability</h2>
           <p className="text-sm text-slate-500">Manage time off, breaks, and shifts</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition shadow-sm"
        >
          <Plus size={16} />
          <span>Add Time Off / Break</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100%-80px)]">
         {/* Calendar View (Weekly Grid) */}
         <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
            {/* Calendar Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
               <div className="flex items-center gap-4">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                     {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </h3>
                  <button onClick={goToToday} className="text-xs font-bold px-2 py-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-50">Today</button>
               </div>
               <div className="flex space-x-2">
                  <button onClick={() => navigateWeek('prev')} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300"><ChevronLeft size={20}/></button>
                  <button onClick={() => navigateWeek('next')} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300"><ChevronRight size={20}/></button>
               </div>
            </div>

            {/* Grid Header (Days) */}
            <div className="flex border-b border-slate-200 dark:border-slate-700">
               <div className="w-16 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50"></div>
               {weekDays.map((day, i) => {
                  const isToday = new Date().toDateString() === day.toDateString();
                  return (
                     <div key={i} className={`flex-1 py-2 text-center border-r border-slate-100 dark:border-slate-800 last:border-0 ${isToday ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                        <div className="text-xs font-bold text-slate-500 uppercase">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                        <div className={`text-sm font-bold ${isToday ? 'text-primary-600 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300'}`}>
                           {day.getDate()}
                        </div>
                     </div>
                  );
               })}
            </div>
            
            {/* Grid Body (Time Slots) */}
            <div className="flex-1 overflow-y-auto relative">
               {hours.map(hour => (
                  <div key={hour} className="flex border-b border-slate-100 dark:border-slate-800 min-h-[60px]">
                     <div className="w-16 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-400 text-right p-2 sticky left-0">
                        {hour > 12 ? `${hour - 12} PM` : `${hour} ${hour === 12 ? 'PM' : 'AM'}`}
                     </div>
                     {weekDays.map((day, i) => (
                        <div key={i} className="flex-1 border-r border-slate-100 dark:border-slate-800 last:border-0 relative">
                           {/* Render Slots */}
                           {getSlotsForDay(day).filter(s => {
                              const startH = new Date(s.start).getHours();
                              return startH === hour;
                           }).map(slot => {
                              const startMin = new Date(slot.start).getMinutes();
                              const durationH = (new Date(slot.end).getTime() - new Date(slot.start).getTime()) / (1000 * 60 * 60);
                              
                              // Visual Adjustments for recurring items to span correctly in the daily bucket
                              // If it's recurring, we assume time is relative to the day it's rendered in
                              const top = (startMin / 60) * 100;
                              const height = durationH * 100;

                              return (
                                 <div 
                                    key={slot.id}
                                    className={`absolute left-1 right-1 rounded px-2 py-1 text-xs border-l-2 shadow-sm z-10 overflow-hidden cursor-pointer hover:opacity-90 ${
                                       slot.type === 'Leave' 
                                       ? 'bg-red-50 border-red-500 text-red-700 dark:bg-red-900/40 dark:text-red-200' 
                                       : 'bg-amber-50 border-amber-500 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200'
                                    }`}
                                    style={{ 
                                       top: `${top}%`, 
                                       height: `${height}%`,
                                       minHeight: '24px'
                                    }}
                                    title={`${slot.title} (${slot.type})`}
                                    onClick={() => handleDelete(slot.id)}
                                 >
                                    <div className="font-bold truncate">{slot.title}</div>
                                    <div className="text-[10px] opacity-80 truncate">
                                       {new Date(slot.start).toLocaleTimeString([], {hour:'numeric', minute:'2-digit'})} - {new Date(slot.end).toLocaleTimeString([], {hour:'numeric', minute:'2-digit'})}
                                    </div>
                                 </div>
                              );
                           })}
                        </div>
                     ))}
                  </div>
               ))}
            </div>
         </div>

         {/* Sidebar List */}
         <div className="space-y-6 flex flex-col">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex-1 overflow-y-auto">
               <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <Clock size={18} /> Scheduled Time Off
               </h3>
               <div className="space-y-3">
                  {slots.length === 0 && <p className="text-sm text-slate-400 italic">No availability rules set.</p>}
                  {slots.map(slot => (
                     <div key={slot.id} className="p-3 border border-slate-100 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 group">
                        <div className="flex justify-between items-start">
                           <div>
                              <p className="font-bold text-sm text-slate-800 dark:text-white">{slot.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                 <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                    slot.type === 'Leave' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                                 }`}>{slot.type}</span>
                                 {slot.isRecurring && <span className="text-[10px] flex items-center gap-0.5 text-slate-500"><Repeat size={10}/> Recurring</span>}
                              </div>
                           </div>
                           <button onClick={() => handleDelete(slot.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Trash2 size={16} />
                           </button>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                           {slot.isRecurring 
                              ? `Weekly on ${slot.recurringDays?.map(d => WEEKDAY_LABELS[d]).join(', ')}` 
                              : new Date(slot.start).toLocaleDateString()
                           }
                        </p>
                        <p className="text-xs text-slate-400">
                           {new Date(slot.start).toLocaleTimeString([], {hour:'numeric', minute:'2-digit'})} - {new Date(slot.end).toLocaleTimeString([], {hour:'numeric', minute:'2-digit'})}
                        </p>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      {/* Add Slot Modal */}
      {isModalOpen && (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
               <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">Add Availability</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
               </div>
               
               <div className="p-6 space-y-4">
                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
                     <input 
                        type="text" 
                        value={newSlot.title}
                        onChange={e => setNewSlot({...newSlot, title: e.target.value})}
                        placeholder="e.g. Vacation, Lunch" 
                        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 dark:text-white"
                     />
                  </div>
                  
                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                     <select 
                        value={newSlot.type}
                        onChange={e => setNewSlot({...newSlot, type: e.target.value as AvailabilityType})}
                        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 dark:text-white"
                     >
                        <option value="Leave">Leave / Time Off</option>
                        <option value="Break">Break</option>
                        <option value="OnCall">On Call</option>
                     </select>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                     <input 
                        type="checkbox" 
                        id="recurring"
                        checked={newSlot.isRecurring}
                        onChange={e => setNewSlot({...newSlot, isRecurring: e.target.checked})}
                        className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                     />
                     <label htmlFor="recurring" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">Recurring Schedule</label>
                  </div>

                  {newSlot.isRecurring ? (
                     <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Repeats On</label>
                        <div className="flex justify-between gap-1">
                           {WEEKDAY_LABELS.map((day, idx) => (
                              <button
                                 key={idx}
                                 onClick={() => toggleRecurringDay(idx)}
                                 className={`w-9 h-9 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                                    newSlot.recurringDays.includes(idx)
                                    ? 'bg-primary-600 text-white shadow-md transform scale-105'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                                 }`}
                              >
                                 {day}
                              </button>
                           ))}
                        </div>
                     </div>
                  ) : (
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Start Date</label>
                           <input 
                              type="date" 
                              value={newSlot.startDate}
                              onChange={e => setNewSlot({...newSlot, startDate: e.target.value})}
                              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 dark:text-white"
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">End Date</label>
                           <input 
                              type="date" 
                              value={newSlot.endDate}
                              onChange={e => setNewSlot({...newSlot, endDate: e.target.value})}
                              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 dark:text-white"
                           />
                        </div>
                     </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Start Time</label>
                        <input 
                           type="time" 
                           value={newSlot.startTime}
                           onChange={e => setNewSlot({...newSlot, startTime: e.target.value})}
                           className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 dark:text-white"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">End Time</label>
                        <input 
                           type="time" 
                           value={newSlot.endTime}
                           onChange={e => setNewSlot({...newSlot, endTime: e.target.value})}
                           className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 dark:text-white"
                        />
                     </div>
                  </div>
               </div>

               <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
                  <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded text-sm font-medium">Cancel</button>
                  <button onClick={handleAddSlot} className="px-6 py-2 bg-primary-600 text-white rounded text-sm font-bold hover:bg-primary-700 shadow-sm">Save Slot</button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default AvailabilityManager;
