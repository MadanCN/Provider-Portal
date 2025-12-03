import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List, Plus, Clock } from 'lucide-react';
import { MOCK_APPOINTMENTS } from '../../constants';
import { Appointment, AppointmentStatus } from '../../types';
import AppointmentCalendar from './AppointmentCalendar';
import AppointmentList from './AppointmentList';
import AppointmentDetailPanel from './AppointmentDetailPanel';

type ViewMode = 'Calendar' | 'List';
type CalendarView = 'Day' | 'Week' | 'Month';

const Appointments: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('Calendar');
  const [calendarView, setCalendarView] = useState<CalendarView>('Week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
  // Local state for appointments to allow status updates
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);

  const handleStatusChange = (id: string, newStatus: AppointmentStatus) => {
    setAppointments(prev => prev.map(appt => 
      appt.id === id ? { ...appt, status: newStatus } : appt
    ));
    // Update selected appt if open
    if (selectedAppointment && selectedAppointment.id === id) {
      setSelectedAppointment(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (calendarView === 'Day') newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    if (calendarView === 'Week') newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    if (calendarView === 'Month') newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const goToToday = () => setCurrentDate(new Date());

  const getHeaderDateLabel = () => {
    if (calendarView === 'Day') return currentDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
    if (calendarView === 'Month') return currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    // Week Logic
    const start = new Date(currentDate);
    start.setDate(currentDate.getDate() - currentDate.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col p-6 bg-slate-50 dark:bg-slate-900">
      
      {/* Module Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4 flex-shrink-0">
        <div>
           <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Appointments</h1>
           <p className="text-sm text-slate-500">Manage schedule and patient visits</p>
        </div>
        
        <div className="flex items-center space-x-3 w-full md:w-auto">
           {/* View Toggle */}
           <div className="flex bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-1">
              <button 
                onClick={() => setViewMode('Calendar')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'Calendar' ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'}`}
              >
                 <CalendarIcon size={16} />
                 <span>Calendar</span>
              </button>
              <button 
                onClick={() => setViewMode('List')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'List' ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'}`}
              >
                 <List size={16} />
                 <span>List</span>
              </button>
           </div>
           
           <button className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors ml-auto">
              <Plus size={18} />
              <span className="hidden sm:inline">New Appointment</span>
           </button>
        </div>
      </div>

      {/* Toolbar (Only for Calendar View primarily) */}
      {viewMode === 'Calendar' && (
        <div className="flex flex-wrap items-center justify-between mb-4 gap-3 flex-shrink-0">
           <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-1">
              <button onClick={() => navigateDate('prev')} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300">
                 <ChevronLeft size={20} />
              </button>
              <button onClick={goToToday} className="px-3 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700 rounded py-1 text-slate-700 dark:text-slate-200">
                 Today
              </button>
              <button onClick={() => navigateDate('next')} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300">
                 <ChevronRight size={20} />
              </button>
           </div>
           
           <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 min-w-[200px] text-center">
              {getHeaderDateLabel()}
           </h2>

           <div className="flex bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-1">
              {(['Day', 'Week', 'Month'] as CalendarView[]).map(v => (
                 <button 
                   key={v}
                   onClick={() => setCalendarView(v)}
                   className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${calendarView === v ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                 >
                    {v}
                 </button>
              ))}
           </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 min-h-0 relative">
         {viewMode === 'Calendar' ? (
            <AppointmentCalendar 
               appointments={appointments} 
               viewMode={calendarView} 
               currentDate={currentDate} 
               onAppointmentClick={setSelectedAppointment}
            />
         ) : (
            <AppointmentList 
               appointments={appointments}
               onAppointmentClick={setSelectedAppointment}
            />
         )}
      </div>

      {/* Detail Slide-over */}
      <AppointmentDetailPanel 
         appointment={selectedAppointment} 
         onClose={() => setSelectedAppointment(null)}
         onStatusChange={handleStatusChange}
      />
      
    </div>
  );
};

export default Appointments;