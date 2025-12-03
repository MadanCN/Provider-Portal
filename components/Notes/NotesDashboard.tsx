
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, Plus, User, Layout, ArrowRight, X } from 'lucide-react';
import { MOCK_NOTES, NOTE_TEMPLATES, MOCK_PATIENTS } from '../../constants';

const NotesDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'Inbox' | 'Drafts' | 'Signed'>('Inbox');
  const [searchTerm, setSearchTerm] = useState('');
  
  // New Note Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');

  const getFilteredNotes = () => {
    let filtered = MOCK_NOTES.filter(n => 
      n.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      n.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (activeTab === 'Drafts') {
      return filtered.filter(n => n.status === 'Draft');
    } else if (activeTab === 'Signed') {
      return filtered.filter(n => n.status === 'Signed');
    } else {
      return filtered.filter(n => n.status !== 'Signed');
    }
  };

  const notes = getFilteredNotes();

  const handleStartNote = () => {
     if (selectedPatientId && selectedTemplateId) {
        navigate(`/notes/new?patientId=${selectedPatientId}&templateId=${selectedTemplateId}`);
        setIsModalOpen(false);
     }
  };

  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Clinical Notes</h2>
           <p className="text-sm text-slate-500">Documentation Inbox & History</p>
        </div>
        <div className="flex gap-3">
          <button 
             onClick={() => navigate('/notes/templates')}
             className="flex items-center space-x-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
             <Layout size={16} />
             <span>Manage Templates</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition shadow-sm"
          >
            <Plus size={16} />
            <span>New Note</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col flex-1 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 justify-between items-center">
           <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
              {(['Inbox', 'Drafts', 'Signed'] as const).map(tab => (
                 <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                       activeTab === tab 
                       ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' 
                       : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                 >
                    {tab}
                 </button>
              ))}
           </div>
           
           <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                 type="text" 
                 placeholder="Search notes..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
           </div>
        </div>

        {/* Note List */}
        <div className="flex-1 overflow-y-auto">
           {notes.length > 0 ? (
             <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {notes.map(note => (
                   <div key={note.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                      <div className="flex justify-between items-start mb-1">
                         <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${note.status === 'Signed' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                               <FileText size={18} />
                            </div>
                            <div>
                               <h4 className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-primary-600 transition-colors">{note.subject}</h4>
                               <div className="flex items-center gap-2 text-xs text-slate-500">
                                  <span className="flex items-center gap-1"><User size={12}/> {note.patientName}</span>
                                  <span>•</span>
                                  <span>{note.type}</span>
                               </div>
                            </div>
                         </div>
                         <div className="text-right">
                            <span className="text-xs text-slate-400 font-mono">{note.lastModified}</span>
                            <div className={`mt-1 inline-flex px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                               note.status === 'Signed' ? 'bg-green-100 text-green-700' : 
                               note.status === 'Draft' ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-700'
                            }`}>
                               {note.status}
                            </div>
                         </div>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 pl-12 line-clamp-1">{note.content || 'No preview available.'}</p>
                   </div>
                ))}
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <FileText size={48} className="mb-4 opacity-20" />
                <p>No notes found in {activeTab}</p>
             </div>
           )}
        </div>
      </div>

      {/* New Note Modal */}
      {isModalOpen && (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
               <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 dark:text-white">Create New Clinical Note</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                     <X size={20}/>
                  </button>
               </div>
               
               <div className="p-6 space-y-4">
                  <div>
                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select Patient</label>
                     <select 
                        className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 dark:text-white"
                        value={selectedPatientId}
                        onChange={e => setSelectedPatientId(e.target.value)}
                     >
                        <option value="">-- Choose Patient --</option>
                        {MOCK_PATIENTS.map(p => (
                           <option key={p.id} value={p.id}>{p.firstName} {p.lastName} (MRN: {p.mrn})</option>
                        ))}
                     </select>
                  </div>
                  
                  <div>
                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select Template</label>
                     <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg p-2">
                        {NOTE_TEMPLATES.map(t => (
                           <div 
                              key={t.id}
                              onClick={() => setSelectedTemplateId(t.id)}
                              className={`p-3 rounded-lg cursor-pointer border flex justify-between items-center ${
                                 selectedTemplateId === t.id 
                                 ? 'bg-primary-50 border-primary-500 ring-1 ring-primary-500' 
                                 : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-primary-300'
                              }`}
                           >
                              <div>
                                 <p className="font-bold text-sm text-slate-800 dark:text-white">{t.name}</p>
                                 <p className="text-xs text-slate-500">{t.description}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
                  <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 text-sm font-medium hover:bg-slate-200 rounded-lg">Cancel</button>
                  <button 
                     onClick={handleStartNote}
                     disabled={!selectedPatientId || !selectedTemplateId}
                     className="px-6 py-2 bg-primary-600 text-white text-sm font-bold rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                     Start Documenting <ArrowRight size={16} />
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default NotesDashboard;
