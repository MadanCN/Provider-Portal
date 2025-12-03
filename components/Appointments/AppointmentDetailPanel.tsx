import React from 'react';
import { X, Calendar, Clock, MapPin, Video, Phone, Mail, User, ShieldCheck, FileText, CheckCircle2, XCircle, AlertCircle, MessageSquare, PlayCircle, Plus } from 'lucide-react';
import { Appointment, AppointmentStatus, AppointmentType } from '../../types';

interface AppointmentDetailPanelProps {
  appointment: Appointment | null;
  onClose: () => void;
  onStatusChange: (id: string, status: AppointmentStatus) => void;
}

const AppointmentDetailPanel: React.FC<AppointmentDetailPanelProps> = ({ appointment, onClose, onStatusChange }) => {
  if (!appointment) return null;

  const isTelehealth = appointment.type === AppointmentType.TELEHEALTH;
  const isPast = new Date(appointment.startTime) < new Date();

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/40 z-40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 overflow-y-auto border-l border-slate-200 dark:border-slate-700">
        
        {/* Header - Fixed */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 z-10 border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className={`px-2 py-0.5 text-xs font-bold rounded-full uppercase tracking-wide ${
                appointment.status === AppointmentStatus.CHECKED_IN ? 'bg-green-100 text-green-700' :
                appointment.status === AppointmentStatus.IN_PROGRESS ? 'bg-purple-100 text-purple-700' :
                appointment.status === AppointmentStatus.CANCELLED ? 'bg-red-100 text-red-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {appointment.status}
              </span>
              {appointment.isNew && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-700 uppercase tracking-wide">
                  New Patient
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{appointment.type}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          
          {/* Highlight Panel (Visit Info) */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div className="flex items-center space-x-3">
                 <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-primary-600 shadow-sm">
                   <Calendar size={18} />
                 </div>
                 <div>
                   <p className="text-xs text-slate-500 uppercase font-medium">Date</p>
                   <p className="text-sm font-semibold text-slate-900 dark:text-white">{new Date(appointment.startTime).toLocaleDateString()}</p>
                 </div>
               </div>
               <div className="flex items-center space-x-3">
                 <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-primary-600 shadow-sm">
                   <Clock size={18} />
                 </div>
                 <div>
                   <p className="text-xs text-slate-500 uppercase font-medium">Time</p>
                   <p className="text-sm font-semibold text-slate-900 dark:text-white">
                     {new Date(appointment.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} ({appointment.durationMinutes}m)
                   </p>
                 </div>
               </div>
               <div className="flex items-center space-x-3">
                 <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-primary-600 shadow-sm">
                   {isTelehealth ? <Video size={18} /> : <MapPin size={18} />}
                 </div>
                 <div>
                   <p className="text-xs text-slate-500 uppercase font-medium">Location</p>
                   {isTelehealth ? (
                     <a href={appointment.telehealthLink} target="_blank" rel="noreferrer" className="text-sm font-semibold text-primary-600 hover:underline flex items-center">
                       Join Video <span className="text-[10px] ml-1">↗</span>
                     </a>
                   ) : (
                     <p className="text-sm font-semibold text-slate-900 dark:text-white">{appointment.location}</p>
                   )}
                 </div>
               </div>
               <div className="flex items-center space-x-3">
                 <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-primary-600 shadow-sm">
                   <User size={18} />
                 </div>
                 <div>
                   <p className="text-xs text-slate-500 uppercase font-medium">Provider</p>
                   <p className="text-sm font-semibold text-slate-900 dark:text-white">{appointment.provider}</p>
                 </div>
               </div>
            </div>
            
            {appointment.reason && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500 uppercase font-medium mb-1">Chief Complaint / Reason</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700 italic">
                  "{appointment.reason}"
                </p>
              </div>
            )}
          </div>

          {/* Patient Demographics */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Patient Information</h3>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-lg">
                {appointment.patient.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{appointment.patient.name}</h4>
                    <p className="text-sm text-slate-500">{new Date(appointment.patient.dob).toLocaleDateString()} • MRN: {appointment.patient.mrn}</p>
                  </div>
                  <button className="text-xs text-primary-600 font-medium hover:underline">View Profile</button>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                    <Phone size={14} />
                    <span>{appointment.patient.phone || '(555) 000-0000'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                    <Mail size={14} />
                    <span>{appointment.patient.email || 'patient@email.com'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Insurance Section */}
          <div>
             <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Billing & Insurance</h3>
             <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <div className="flex items-center space-x-3">
                  <ShieldCheck className={appointment.insuranceStatus === 'Verified' ? "text-green-500" : "text-amber-500"} size={20} />
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Primary Insurance</p>
                    <p className="text-xs text-slate-500">{appointment.insuranceStatus || 'Pending Verification'}</p>
                  </div>
                </div>
                <button className="text-xs border border-slate-300 dark:border-slate-600 px-2 py-1 rounded hover:bg-slate-50 dark:hover:bg-slate-700">Details</button>
             </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
             <div className="grid grid-cols-2 gap-3">
                {appointment.status === AppointmentStatus.SCHEDULED && (
                  <button 
                    onClick={() => onStatusChange(appointment.id, AppointmentStatus.CHECKED_IN)}
                    className="flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-lg font-medium transition-colors"
                  >
                    <CheckCircle2 size={18} />
                    <span>Check In</span>
                  </button>
                )}
                
                {appointment.status === AppointmentStatus.CHECKED_IN && (
                  <button 
                    onClick={() => onStatusChange(appointment.id, AppointmentStatus.IN_PROGRESS)}
                    className="flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-lg font-medium transition-colors"
                  >
                    <PlayCircle size={18} />
                    <span>Start Visit</span>
                  </button>
                )}

                {appointment.status === AppointmentStatus.IN_PROGRESS && (
                   <button 
                    onClick={() => onStatusChange(appointment.id, AppointmentStatus.COMPLETED)}
                    className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium transition-colors"
                  >
                    <FileText size={18} />
                    <span>Sign & Complete</span>
                  </button>
                )}

                {isTelehealth && appointment.status !== AppointmentStatus.COMPLETED && appointment.status !== AppointmentStatus.CANCELLED && (
                  <button className="flex items-center justify-center space-x-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 py-2.5 rounded-lg font-medium transition-colors">
                    <Video size={18} />
                    <span>Join Session</span>
                  </button>
                )}
                
                <button className="flex items-center justify-center space-x-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 py-2.5 rounded-lg font-medium transition-colors">
                   <MessageSquare size={18} />
                   <span>Message</span>
                </button>
             </div>
             
             <div className="grid grid-cols-3 gap-3">
                <button className="col-span-1 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-transparent hover:border-slate-300 dark:hover:border-slate-600 rounded">Reschedule</button>
                <button 
                  onClick={() => onStatusChange(appointment.id, AppointmentStatus.CANCELLED)}
                  className="col-span-1 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => onStatusChange(appointment.id, AppointmentStatus.NO_SHOW)}
                  className="col-span-1 py-2 text-sm text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded"
                >
                  No Show
                </button>
             </div>
          </div>
          
          {/* Clinical Notes Quick Add */}
          <div className="pt-2">
             <button className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 hover:border-primary-500 hover:text-primary-600 transition-colors flex items-center justify-center space-x-2">
                <Plus size={18} />
                <span>Add Clinical Note</span>
             </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default AppointmentDetailPanel;