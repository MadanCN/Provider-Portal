
import React, { useState } from 'react';
import { 
  Inbox, Send, Archive, Users, Flag, Plus, Menu 
} from 'lucide-react';
import { MOCK_MESSAGE_THREADS } from '../../constants';
import { MessageFolder } from '../../types';
import MessageList from './MessageList';
import MessageDetail from './MessageDetail';
import NewMessageModal from './NewMessageModal';

const MessagesDashboard: React.FC = () => {
  const [activeFolder, setActiveFolder] = useState<MessageFolder>('Inbox');
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Local state for threads to support local updates (flag, archive)
  const [threads, setThreads] = useState(MOCK_MESSAGE_THREADS);

  // Computed: Filter Threads
  const filteredThreads = threads.filter(t => {
    // Search Filter
    const matchesSearch = 
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.patientName && t.patientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      t.messages.some(m => m.content.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    // Folder Filter
    if (activeFolder === 'Inbox') return t.folder === 'Inbox' && t.status === 'Open';
    if (activeFolder === 'Flagged') return t.isFlagged;
    if (activeFolder === 'Unread') return t.isUnread;
    if (activeFolder === 'Sent') return t.messages[t.messages.length-1].senderRole === 'Provider'; // Simplified logic
    if (activeFolder === 'Archived') return t.folder === 'Archived';
    if (activeFolder === 'Team') return t.folder === 'Team';
    
    return t.folder === activeFolder;
  });

  const activeThread = selectedThreadId ? threads.find(t => t.id === selectedThreadId) || null : null;

  const handleFlagToggle = (id: string) => {
    setThreads(prev => prev.map(t => t.id === id ? { ...t, isFlagged: !t.isFlagged } : t));
  };

  const handleArchive = (id: string) => {
     setThreads(prev => prev.map(t => t.id === id ? { ...t, folder: 'Archived', status: 'Closed' } : t));
     if (selectedThreadId === id) setSelectedThreadId(null);
  };

  const folders: { id: MessageFolder, label: string, icon: React.ReactNode, count?: number }[] = [
    { id: 'Inbox', label: 'Inbox', icon: <Inbox size={18} />, count: threads.filter(t => t.folder === 'Inbox' && t.isUnread).length },
    { id: 'Flagged', label: 'Flagged', icon: <Flag size={18} />, count: threads.filter(t => t.isFlagged).length },
    { id: 'Team', label: 'Team', icon: <Users size={18} /> },
    { id: 'Sent', label: 'Sent', icon: <Send size={18} /> },
    { id: 'Archived', label: 'Archived', icon: <Archive size={18} /> },
  ];

  return (
    <div className="h-[calc(100vh-64px)] flex bg-slate-50 dark:bg-slate-900 overflow-hidden">
       {/* Sidebar Folders */}
       <div className="w-64 bg-slate-100 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col shrink-0">
          <div className="p-4">
             <button 
               onClick={() => setIsNewMessageOpen(true)}
               className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-lg font-bold shadow-sm transition"
             >
                <Plus size={18} /> Compose
             </button>
          </div>
          
          <nav className="flex-1 px-2 space-y-1">
             {folders.map(folder => (
                <button
                   key={folder.id}
                   onClick={() => setActiveFolder(folder.id)}
                   className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeFolder === folder.id 
                      ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/50'
                   }`}
                >
                   <div className="flex items-center gap-3">
                      {folder.icon}
                      <span>{folder.label}</span>
                   </div>
                   {folder.count ? (
                      <span className="bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-xs px-2 py-0.5 rounded-full font-bold">
                         {folder.count}
                      </span>
                   ) : null}
                </button>
             ))}
          </nav>
       </div>

       {/* Thread List */}
       <div className={`${selectedThreadId ? 'hidden md:flex' : 'flex'} w-full md:w-auto h-full`}>
          <MessageList 
            threads={filteredThreads} 
            selectedThreadId={selectedThreadId} 
            onSelectThread={setSelectedThreadId}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
       </div>

       {/* Detail View */}
       <div className={`${!selectedThreadId ? 'hidden md:flex' : 'flex'} flex-1 h-full`}>
          <MessageDetail 
            thread={activeThread} 
            onFlagToggle={handleFlagToggle}
            onArchive={handleArchive}
          />
       </div>

       {/* Compose Modal */}
       {isNewMessageOpen && (
          <NewMessageModal onClose={() => setIsNewMessageOpen(false)} />
       )}
    </div>
  );
};

export default MessagesDashboard;
