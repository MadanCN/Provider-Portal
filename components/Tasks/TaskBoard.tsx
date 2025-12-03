
import React, { useState } from 'react';
import { 
  CheckSquare, Clock, AlertCircle, Plus, Search, Filter, 
  ChevronDown, MoreHorizontal, User, Calendar 
} from 'lucide-react';
import { MOCK_TASKS } from '../../constants';
import { Task, TaskStatus } from '../../types';
import NewTaskModal from './NewTaskModal';
import TaskDetailPanel from './TaskDetailPanel';

const TaskBoard: React.FC = () => {
  const [filter, setFilter] = useState<'My Tasks' | 'All Tasks'>('My Tasks');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Local state for tasks
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);

  const currentUser = 'Dr. Smith'; // Mock current user

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (t.patientName && t.patientName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesOwner = filter === 'All Tasks' || t.assignedTo === currentUser;
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;

    return matchesSearch && matchesOwner && matchesStatus;
  });

  // Sort: High Priority & Overdue first
  filteredTasks.sort((a, b) => {
    if (a.priority === 'High' && b.priority !== 'High') return -1;
    if (a.priority !== 'High' && b.priority === 'High') return 1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  // Counters
  const overdueCount = tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'Completed').length;
  const dueTodayCount = tasks.filter(t => {
    const d = new Date(t.dueDate);
    const today = new Date();
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear() && t.status !== 'Completed';
  }).length;

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleCreateTask = (newTask: Task) => {
     setTasks(prev => [newTask, ...prev]);
     setIsNewTaskModalOpen(false);
  };

  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col bg-slate-50 dark:bg-slate-900">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Tasks</h2>
           <p className="text-sm text-slate-500">Manage to-dos and follow-ups</p>
        </div>
        <button 
          onClick={() => setIsNewTaskModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition shadow-sm"
        >
          <Plus size={16} />
          <span>New Task</span>
        </button>
      </div>

      {/* Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
         <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg">
               <AlertCircle size={20} />
            </div>
            <div>
               <p className="text-2xl font-bold text-slate-800 dark:text-white">{overdueCount}</p>
               <p className="text-xs text-slate-500 uppercase font-bold">Overdue</p>
            </div>
         </div>
         <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg">
               <Clock size={20} />
            </div>
            <div>
               <p className="text-2xl font-bold text-slate-800 dark:text-white">{dueTodayCount}</p>
               <p className="text-xs text-slate-500 uppercase font-bold">Due Today</p>
            </div>
         </div>
         <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
               <CheckSquare size={20} />
            </div>
            <div>
               <p className="text-2xl font-bold text-slate-800 dark:text-white">{tasks.filter(t => t.assignedTo === currentUser && t.status !== 'Completed').length}</p>
               <p className="text-xs text-slate-500 uppercase font-bold">My Open Tasks</p>
            </div>
         </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col flex-1 overflow-hidden">
         {/* Toolbar */}
         <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex gap-2 w-full md:w-auto">
               <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                  <button 
                     onClick={() => setFilter('My Tasks')}
                     className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${filter === 'My Tasks' ? 'bg-white dark:bg-slate-600 shadow text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
                  >
                     My Tasks
                  </button>
                  <button 
                     onClick={() => setFilter('All Tasks')}
                     className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${filter === 'All Tasks' ? 'bg-white dark:bg-slate-600 shadow text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
                  >
                     All Tasks
                  </button>
               </div>
               
               <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none"
               >
                  <option value="All">All Status</option>
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
               </select>
            </div>

            <div className="relative w-full md:w-64">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
               <input 
                  type="text" 
                  placeholder="Search tasks..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
               />
            </div>
         </div>

         {/* Task List */}
         <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
               <thead className="bg-slate-50 dark:bg-slate-900/50 uppercase text-xs font-semibold border-b border-slate-200 dark:border-slate-700 sticky top-0 backdrop-blur-sm z-10">
                  <tr>
                     <th className="px-6 py-3 w-10"></th>
                     <th className="px-6 py-3">Task</th>
                     <th className="px-6 py-3">Patient</th>
                     <th className="px-6 py-3">Priority</th>
                     <th className="px-6 py-3">Due Date</th>
                     <th className="px-6 py-3">Assigned To</th>
                     <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredTasks.length > 0 ? filteredTasks.map(task => {
                     const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Completed';
                     const isCompleted = task.status === 'Completed';

                     return (
                        <tr 
                           key={task.id} 
                           onClick={() => setSelectedTask(task)}
                           className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group ${isCompleted ? 'opacity-60 bg-slate-50/50 dark:bg-slate-900/50' : ''}`}
                        >
                           <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                              <button 
                                 onClick={() => handleStatusChange(task.id, isCompleted ? 'In Progress' : 'Completed')}
                                 className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                    isCompleted 
                                    ? 'bg-green-500 border-green-500 text-white' 
                                    : 'border-slate-300 dark:border-slate-600 hover:border-primary-500'
                                 }`}
                              >
                                 {isCompleted && <CheckSquare size={14} />}
                              </button>
                           </td>
                           <td className="px-6 py-4">
                              <div className={`font-medium ${isCompleted ? 'line-through text-slate-500' : 'text-slate-800 dark:text-white'}`}>
                                 {task.title}
                              </div>
                              <div className="text-xs text-slate-500">{task.category}</div>
                           </td>
                           <td className="px-6 py-4">
                              {task.patientName ? (
                                 <div>
                                    <div className="font-medium text-slate-800 dark:text-slate-300">{task.patientName}</div>
                                    <div className="text-xs text-slate-500">MRN: {task.patientMrn}</div>
                                 </div>
                              ) : <span className="text-slate-400 italic">-</span>}
                           </td>
                           <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
                                 task.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                                 task.priority === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                                 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                              }`}>
                                 {task.priority === 'High' && <AlertCircle size={10} />}
                                 {task.priority}
                              </span>
                           </td>
                           <td className="px-6 py-4">
                              <div className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-600 font-bold' : ''}`}>
                                 <Calendar size={14} />
                                 <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                 {isOverdue && <span className="text-[10px] bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 px-1.5 rounded">OD</span>}
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                 <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs">
                                    <User size={12} />
                                 </div>
                                 <span className="text-sm">{task.assignedTo}</span>
                              </div>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                                 <MoreHorizontal size={16} />
                              </button>
                           </td>
                        </tr>
                     );
                  }) : (
                     <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500">
                           No tasks found matching filters.
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* Modals & Panels */}
      {isNewTaskModalOpen && <NewTaskModal onClose={() => setIsNewTaskModalOpen(false)} onCreate={handleCreateTask} />}
      {selectedTask && <TaskDetailPanel task={selectedTask} onClose={() => setSelectedTask(null)} onUpdateStatus={handleStatusChange} />}
    </div>
  );
};

export default TaskBoard;
