
import React, { useState, useRef, useEffect } from 'react';
import { 
  Archive, Trash2, Flag, MoreHorizontal, Reply, Paperclip, Send, 
  User, Sparkles, ChevronDown 
} from 'lucide-react';
import { MessageThread, MessageTemplate } from '../../types';
import { MOCK_MESSAGE_TEMPLATES } from '../../constants';

interface MessageDetailProps {
  thread: MessageThread | null;
  onFlagToggle: (id: string) => void;
  onArchive: (id: string) => void;
}

const MessageDetail: React.FC<MessageDetailProps> = ({ thread, onFlagToggle, onArchive }) => {
  const [replyText, setReplyText] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread]);

  if (!thread) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-400">
         Select a conversation to read
      </div>
    );
  }

  const handleInsertTemplate = (template: MessageTemplate) => {
    setReplyText(prev => prev + template.text);
    setShowTemplates(false);
  };

  const handleSend = () => {
    if (!replyText.trim()) return;
    alert(`Sent: ${replyText}`);
    setReplyText('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-800 overflow-hidden">
       {/* Header */}
       <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-start shrink-0">
          <div>
             <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">{thread.subject}</h2>
                <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded text-xs">
                   {thread.category}
                </span>
                {thread.priority === 'Urgent' && (
                   <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-bold">URGENT</span>
                )}
             </div>
             <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                   {thread.patientName || thread.participants.join(', ')}
                </span>
                {thread.patientId && <span className="text-xs bg-primary-50 text-primary-700 px-1.5 rounded">Patient</span>}
             </div>
          </div>
          <div className="flex items-center gap-2">
             <button 
               onClick={() => onFlagToggle(thread.id)}
               className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition ${thread.isFlagged ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-slate-400'}`}
               title="Flag"
             >
                <Flag size={18} fill={thread.isFlagged ? "currentColor" : "none"} />
             </button>
             <button 
               onClick={() => onArchive(thread.id)}
               className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition"
               title="Archive"
             >
                <Archive size={18} />
             </button>
             <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition">
                <MoreHorizontal size={18} />
             </button>
          </div>
       </div>

       {/* Messages Area */}
       <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-slate-900">
          {thread.messages.map(msg => (
             <div key={msg.id} className={`flex gap-4 ${msg.senderRole === 'Provider' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                   msg.senderRole === 'Provider' ? 'bg-primary-600 text-white' : 
                   msg.senderRole === 'System' ? 'bg-red-100 text-red-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                   {msg.senderRole === 'System' ? '!' : <User size={14} />}
                </div>
                <div className={`flex flex-col max-w-[80%] ${msg.senderRole === 'Provider' ? 'items-end' : 'items-start'}`}>
                   <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{msg.senderName}</span>
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                   </div>
                   <div className={`p-4 rounded-lg text-sm shadow-sm ${
                      msg.senderRole === 'Provider' ? 'bg-primary-600 text-white rounded-tr-none' : 
                      msg.senderRole === 'System' ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-100 dark:border-red-900' :
                      'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-tl-none'
                   }`}>
                      {msg.content}
                   </div>
                </div>
             </div>
          ))}
          <div ref={messagesEndRef} />
       </div>

       {/* Reply Area */}
       <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0">
          <div className="relative border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all bg-white dark:bg-slate-900">
             <textarea 
               value={replyText}
               onChange={(e) => setReplyText(e.target.value)}
               placeholder="Type your reply... (Use . for templates)"
               className="w-full p-3 min-h-[100px] resize-none focus:outline-none bg-transparent text-sm text-slate-800 dark:text-slate-200"
             />
             
             {/* Toolbar */}
             <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800/50 rounded-b-lg border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1">
                   <div className="relative">
                      <button 
                        onClick={() => setShowTemplates(!showTemplates)}
                        className="p-1.5 text-slate-500 hover:text-primary-600 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition flex items-center gap-1 text-xs font-medium"
                      >
                         <Sparkles size={16} /> Templates <ChevronDown size={12}/>
                      </button>
                      
                      {showTemplates && (
                         <div className="absolute bottom-full left-0 mb-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-10">
                            <div className="p-2 bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-500 uppercase">Smart Phrases</div>
                            <div className="max-h-48 overflow-y-auto">
                               {MOCK_MESSAGE_TEMPLATES.map(t => (
                                  <button 
                                    key={t.id}
                                    onClick={() => handleInsertTemplate(t)}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 transition border-b border-slate-100 dark:border-slate-700 last:border-0"
                                  >
                                     <span className="font-mono text-xs opacity-50 mr-2">{t.trigger}</span>
                                     {t.label}
                                  </button>
                               ))}
                            </div>
                         </div>
                      )}
                   </div>
                   <button className="p-1.5 text-slate-500 hover:text-slate-700 rounded transition">
                      <Paperclip size={16} />
                   </button>
                </div>
                
                <button 
                  onClick={handleSend}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition shadow-sm"
                >
                   <Send size={16} /> Send Reply
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};

export default MessageDetail;
