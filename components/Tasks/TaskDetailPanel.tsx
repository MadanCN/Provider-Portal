
import React, { useState } from 'react';
import { X, Calendar, User, Tag, CheckCircle, AlertCircle, Clock, Trash2 } from 'lucide-react';
import { Task, TaskStatus } from '../../types';

interface TaskDetailPanelProps {
  task: Task;
  onClose: () => void;
  onUpdateStatus: (id: string, status: TaskStatus) => void;
}

const TaskDetailPanel: React.FC<TaskDetailPanelProps> = ({ task, onClose, onUpdateStatus }) => {
  const [comment, setComment] = useState('');
  
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Completed';

  const handleAddComment = () => {
    if (!comment.trim()) return;
    alert('Comment added (Mock)');
    setComment('');
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 flex flex-col border-l border-slate-200 dark:border-slate-700">
         
         {/* Header */}
         <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-start">
            <div className="flex-1 pr-4">
               <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                     task.priority === 'High' ? 'bg-red-100 text-red-700' :
                     task.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                     'bg-blue-100 text-blue-700'
                  }`}>
                     {task.priority} Priority
                  </span>
                  {isOverdue && <span className="bg-red-500 text-white px-2 py-0.5 rounded text-[10px] font-bold">OVERDUE</span>}
               </div>
               <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{task.title}</h2>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition">
               <X size={24} />
            </button>
         </div>

         {/* Content */}
         <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Status & Actions */}
            <div className="flex gap-2">
               <select 
                  value={task.status}
                  onChange={(e) => onUpdateStatus(task.id, e.target.value as TaskStatus)}
                  className="flex-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium"
               >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
               </select>
               {task.status !== 'Completed' && (
                  <button 
                     onClick={() => onUpdateStatus(task.id, 'Completed')}
                     className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold shadow-sm"
                  >
                     <CheckCircle size={16} /> Complete
                  </button>
               )}
            </div>

            {/* Description */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
               <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Description</h4>
               <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{task.description || 'No description provided.'}</p>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 text-sm">
               <div className="flex items-start gap-3">
                  <Calendar size={18} className="text-slate-400 mt-0.5" />
                  <div>
                     <p className="font-bold text-slate-700 dark:text-slate-300">Due Date</p>
                     <p className={`text-slate-500 ${isOverdue ? 'text-red-500 font-medium' : ''}`}>{new Date(task.dueDate).toLocaleDateString()}</p>
                  </div>
               </div>
               <div className="flex items-start gap-3">
                  <User size={18} className="text-slate-400 mt-0.5" />
                  <div>
                     <p className="font-bold text-slate-700 dark:text-slate-300">Assigned To</p>
                     <p className="text-slate-500">{task.assignedTo}</p>
                  </div>
               </div>
               <div className="flex items-start gap-3">
                  <Tag size={18} className="text-slate-400 mt-0.5" />
                  <div>
                     <p className="font-bold text-slate-700 dark:text-slate-300">Category</p>
                     <p className="text-slate-500">{task.category}</p>
                  </div>
               </div>
            </div>

            {/* Patient Context */}
            {task.patientId && (
               <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Patient Context</h4>
                  <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                     <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold">
                        {task.patientName?.charAt(0)}
                     </div>
                     <div>
                        <p className="font-bold text-sm text-slate-800 dark:text-white">{task.patientName}</p>
                        <p className="text-xs text-slate-500">MRN: {task.patientMrn}</p>
                     </div>
                     <button className="ml-auto text-xs text-primary-600 hover:underline">View Chart</button>
                  </div>
               </div>
            )}

            {/* Comments (Mock) */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
               <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">Comments</h4>
               <div className="space-y-4 mb-4">
                  <div className="flex gap-3 text-sm">
                     <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs">DS</div>
                     <div>
                        <div className="flex items-center gap-2 mb-0.5">
                           <span className="font-bold text-slate-700 dark:text-slate-300">Dr. Smith</span>
                           <span className="text-[10px] text-slate-400">Oct 25, 9:00 AM</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">Created task for follow-up.</p>
                     </div>
                  </div>
               </div>
               
               <div className="flex gap-2">
                  <input 
                     type="text" 
                     value={comment}
                     onChange={e => setComment(e.target.value)}
                     placeholder="Add a comment..." 
                     className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800"
                  />
                  <button onClick={handleAddComment} className="px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 rounded-lg text-sm font-medium">Post</button>
               </div>
            </div>

         </div>
         
         {/* Footer */}
         <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
            <button className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1">
               <Trash2 size={14} /> Delete Task
            </button>
            <div className="text-xs text-slate-400">Created {new Date(task.createdAt).toLocaleDateString()}</div>
         </div>
      </div>
    </>
  );
};

export default TaskDetailPanel;
