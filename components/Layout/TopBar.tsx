
import React, { useState } from 'react';
import { 
  Search, Moon, Sun, Bell, Menu, HelpCircle, X, Check, Info 
} from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '../../constants';
import { Notification } from '../../types';

interface TopBarProps {
  onMenuClick: () => void;
  isDark: boolean;
  toggleTheme: () => void;
  onToggleHelp: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick, isDark, toggleTheme, onToggleHelp }) => {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center">
        <button onClick={onMenuClick} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg mr-2">
          <Menu size={20} />
        </button>
        
        <div className="hidden md:flex items-center relative w-64">
           <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
           <input 
             type="text" 
             placeholder="Global Search..." 
             className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary-500 transition-all"
           />
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        <button 
          onClick={onToggleHelp}
          className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title="Page Help"
        >
           <HelpCircle size={20} />
        </button>

        <button onClick={toggleTheme} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
           {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        {/* Notification Bell */}
        <div className="relative">
           <button 
             onClick={() => setShowNotifications(!showNotifications)}
             className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative"
           >
              <Bell size={20} />
              {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>}
           </button>

           {/* Notification Dropdown */}
           {showNotifications && (
              <>
                 <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)}></div>
                 <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-20 overflow-hidden animate-in slide-in-from-top-2">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                       <h3 className="font-bold text-slate-800 dark:text-white">Notifications</h3>
                       {unreadCount > 0 && (
                          <button onClick={markAllRead} className="text-xs text-primary-600 hover:underline">Mark all read</button>
                       )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                       {notifications.length === 0 ? (
                          <div className="p-8 text-center text-slate-400 text-sm">No notifications</div>
                       ) : (
                          <div className="divide-y divide-slate-100 dark:divide-slate-800">
                             {notifications.map(notif => (
                                <div key={notif.id} className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative group ${!notif.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                                   <div className="flex gap-3">
                                      <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                                         notif.type === 'error' ? 'bg-red-500' : 
                                         notif.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                                      }`}></div>
                                      <div className="flex-1">
                                         <p className={`text-sm ${!notif.read ? 'font-bold text-slate-800 dark:text-white' : 'font-medium text-slate-600 dark:text-slate-300'}`}>{notif.title}</p>
                                         <p className="text-xs text-slate-500 mt-0.5">{notif.message}</p>
                                         <p className="text-[10px] text-slate-400 mt-1">{notif.time}</p>
                                      </div>
                                      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                         {!notif.read && (
                                            <button onClick={(e) => { e.stopPropagation(); markAsRead(notif.id); }} className="p-1 text-slate-400 hover:text-green-600" title="Mark Read"><Check size={14}/></button>
                                         )}
                                         <button onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }} className="p-1 text-slate-400 hover:text-red-600" title="Delete"><X size={14}/></button>
                                      </div>
                                   </div>
                                </div>
                             ))}
                          </div>
                       )}
                    </div>
                 </div>
              </>
           )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
