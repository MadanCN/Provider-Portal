
import React, { useState } from 'react';
import { X, Search, Calendar, User, Tag } from 'lucide-react';
import { Task, TaskPriority } from '../../types';
import { MOCK_PATIENTS } from '../../constants';

interface NewTaskModalProps {
  onClose: () => void;
  onCreate: (task: Task) => void;
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [assignee, setAssignee] = useState('Dr. Smith');
  const [category, setCategory] = useState('Administrative');
  const [selectedPatientId, setSelectedPatientId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = MOCK_PATIENTS.find(p => p.id === selectedPatientId);
    
    const newTask: Task = {
      id: `t${Date.now()}`,
      title,
      description,
      priority,
      dueDate: new Date(dueDate).toISOString(),
      status: 'Not Started',
      assignedTo: assignee,
      category,
      createdBy: 'Dr. Smith',
      createdAt: new Date().toISOString(),
      patientId: patient?.id,
      patientName: patient ? `${patient.firstName} ${patient.lastName}` : undefined,
      patientMrn: patient?.mrn
    };
    
    onCreate(newTask);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Create New Task</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
           <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Task Title <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Call Patient regarding Lab Results" 
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 dark:text-white"
              />
           </div>

           <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Add details..." 
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 dark:text-white min-h-[80px]"
              ></textarea>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Priority</label>
                 <select 
                   value={priority}
                   onChange={e => setPriority(e.target.value as TaskPriority)}
                   className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 dark:text-white"
                 >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                 </select>
              </div>
              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Due Date</label>
                 <input 
                   type="date" 
                   value={dueDate}
                   onChange={e => setDueDate(e.target.value)}
                   className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 dark:text-white"
                 />
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assign To</label>
                 <select 
                   value={assignee}
                   onChange={e => setAssignee(e.target.value)}
                   className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 dark:text-white"
                 >
                    <option value="Dr. Smith">Me (Dr. Smith)</option>
                    <option value="MA Team">MA Team</option>
                    <option value="Front Desk">Front Desk</option>
                    <option value="Billing Team">Billing Team</option>
                 </select>
              </div>
              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                 <select 
                   value={category}
                   onChange={e => setCategory(e.target.value)}
                   className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 dark:text-white"
                 >
                    <option value="Administrative">Administrative</option>
                    <option value="Patient Call">Patient Call</option>
                    <option value="Lab Review">Lab Review</option>
                    <option value="Prior Auth">Prior Auth</option>
                 </select>
              </div>
           </div>

           <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Link Patient (Optional)</label>
              <select 
                 value={selectedPatientId}
                 onChange={e => setSelectedPatientId(e.target.value)}
                 className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 dark:text-white"
              >
                 <option value="">-- No Patient --</option>
                 {MOCK_PATIENTS.map(p => (
                    <option key={p.id} value={p.id}>{p.firstName} {p.lastName} (MRN: {p.mrn})</option>
                 ))}
              </select>
           </div>

           <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
              <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-sm font-medium">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-bold shadow-sm">Create Task</button>
           </div>
        </form>
      </div>
    </div>
  );
};

export default NewTaskModal;
