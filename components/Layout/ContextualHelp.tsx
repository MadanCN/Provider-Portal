
import React from 'react';
import { X, ExternalLink, FileText, Video, MessageCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { CONTEXTUAL_HELP_MAP } from '../../constants';

interface ContextualHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContextualHelp: React.FC<ContextualHelpProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const currentPath = location.pathname; // e.g. /patients, /appointments
  
  // Find matching help topics. 
  // Simple matching: checks if current path starts with the key in map
  const helpKey = Object.keys(CONTEXTUAL_HELP_MAP).find(key => currentPath.startsWith(key));
  const articles = helpKey ? CONTEXTUAL_HELP_MAP[helpKey] : [];

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={onClose} />}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 right-0 z-50 w-80 bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 border-l border-slate-200 dark:border-slate-700 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-primary-600 text-white">
          <div className="flex items-center gap-2">
             <FileText size={20} />
             <h2 className="font-bold text-lg">Page Help</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition">
             <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
           
           {/* Contextual Articles */}
           <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Relevant Guides</h3>
              {articles.length > 0 ? (
                 <div className="space-y-3">
                    {articles.map(article => (
                       <div key={article.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">{article.title}</h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400">{article.content}</p>
                          {article.relatedLinks && (
                             <div className="mt-2 space-y-1">
                                {article.relatedLinks.map((link, idx) => (
                                   <a key={idx} href={link.url} className="text-xs text-primary-600 hover:underline flex items-center gap-1">
                                      {link.label} <ExternalLink size={10} />
                                   </a>
                                ))}
                             </div>
                          )}
                       </div>
                    ))}
                 </div>
              ) : (
                 <p className="text-sm text-slate-500 italic">No specific guides found for this page.</p>
              )}
           </div>

           {/* General Resources */}
           <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Resources</h3>
              <ul className="space-y-2">
                 <li>
                    <a href="#" className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 hover:text-primary-600 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition">
                       <Video size={16} className="text-slate-400" /> Video Tutorials
                    </a>
                 </li>
                 <li>
                    <a href="#" className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 hover:text-primary-600 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition">
                       <FileText size={16} className="text-slate-400" /> User Manual (PDF)
                    </a>
                 </li>
              </ul>
           </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
           <button className="w-full py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-sm text-sm font-medium text-slate-700 dark:text-white flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-600 transition">
              <MessageCircle size={16} /> Contact Support
           </button>
        </div>

      </div>
    </>
  );
};

export default ContextualHelp;
