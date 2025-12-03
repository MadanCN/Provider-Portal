
import React from 'react';
import { Search, Flag, Circle } from 'lucide-react';
import { MessageThread } from '../../types';

interface MessageListProps {
  threads: MessageThread[];
  selectedThreadId: string | null;
  onSelectThread: (id: string) => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({ 
  threads, 
  selectedThreadId, 
  onSelectThread,
  searchTerm,
  onSearchChange
}) => {
  return (
    <div className="flex flex-col h-full border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 w-full md:w-80 lg:w-96 shrink-0">
      {/* Search */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search messages..." 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {threads.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {threads.map(thread => (
              <div 
                key={thread.id} 
                onClick={() => onSelectThread(thread.id)}
                className={`p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${selectedThreadId === thread.id ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500' : 'border-l-4 border-transparent'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2 overflow-hidden">
                    {thread.isUnread && <Circle size={8} className="fill-blue-500 text-blue-500 shrink-0" />}
                    <span className={`text-sm truncate ${thread.isUnread ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                      {thread.patientName || thread.participants.join(', ')}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">{thread.lastMessageAt}</span>
                </div>
                
                <h4 className={`text-xs truncate mb-1 ${thread.isUnread ? 'font-semibold text-slate-800 dark:text-slate-200' : 'text-slate-600 dark:text-slate-400'}`}>
                  {thread.subject}
                </h4>
                
                <p className="text-xs text-slate-500 dark:text-slate-500 line-clamp-2">
                  {thread.messages[thread.messages.length - 1].content}
                </p>

                <div className="flex items-center gap-2 mt-2">
                   {thread.isFlagged && <Flag size={12} className="text-red-500 fill-red-500" />}
                   <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-[10px] rounded text-slate-500">
                      {thread.category}
                   </span>
                   {thread.priority === 'Urgent' && (
                      <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-[10px] rounded text-red-600 font-bold">
                         URGENT
                      </span>
                   )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 text-sm">
             No messages found.
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageList;
