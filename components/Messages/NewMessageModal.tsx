
import React, { useState } from 'react';
import { X, Search, Paperclip, Send } from 'lucide-react';

interface NewMessageModalProps {
  onClose: () => void;
}

const NewMessageModal: React.FC<NewMessageModalProps> = ({ onClose }) => {
  const [recipientType, setRecipientType] = useState<'Patient' | 'Team'>('Patient');
  const [recipient, setRecipient] = useState('');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">New Message</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4 flex-1 overflow-y-auto">
           {/* Recipient Toggle */}
           <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit">
              <button 
                onClick={() => setRecipientType('Patient')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${recipientType === 'Patient' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}
              >
                 To Patient
              </button>
              <button 
                onClick={() => setRecipientType('Team')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${recipientType === 'Team' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}
              >
                 To Staff/Team
              </button>
           </div>

           {/* Fields */}
           <div className="space-y-4">
              <div className="relative">
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">To:</label>
                 <Search className="absolute left-3 top-8 text-slate-400" size={16} />
                 <input 
                   type="text" 
                   value={recipient}
                   onChange={e => setRecipient(e.target.value)}
                   className="w-full pl-9 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                   placeholder={recipientType === 'Patient' ? "Search patient name or MRN..." : "Search provider or staff name..."}
                 />
              </div>
              
              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subject:</label>
                 <input 
                   type="text" 
                   className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                   placeholder="Message subject..."
                 />
              </div>

              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Message:</label>
                 <textarea 
                   className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white min-h-[200px]"
                   placeholder="Type your message..."
                 ></textarea>
              </div>
           </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
           <button className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm font-medium">
              <Paperclip size={18} /> Attach File
           </button>
           <div className="flex gap-3">
              <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg text-sm font-medium">Discard</button>
              <button 
                 onClick={() => { alert('Message sent!'); onClose(); }}
                 className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm"
              >
                 <Send size={16} /> Send Message
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default NewMessageModal;
