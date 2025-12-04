
import React, { useState, useEffect } from 'react';
import { 
  HashRouter as Router, 
  Routes, 
  Route, 
  NavLink, 
  useLocation,
  useNavigate
} from 'react-router-dom';
import { 
  LayoutDashboard, Calendar, Users, FileText, Settings, Bell, Search, 
  Menu, X, Moon, Sun, Video, MessageSquare, Pill, ClipboardList,
  BarChart2, HelpCircle, Clock
} from 'lucide-react';
import { MOCK_MESSAGE_THREADS } from './constants';

// Imported Components
import DashboardHome from './components/Dashboard/DashboardHome';
import PatientList from './components/Patients/PatientList';
import PatientDetail from './components/Patients/PatientDetail';
import Appointments from './components/Appointments/Appointments';
import NotesDashboard from './components/Notes/NotesDashboard';
import NoteEditor from './components/Notes/NoteEditor';
import TemplateManager from './components/Notes/TemplateManager';
import PrescriptionDashboard from './components/Prescriptions/PrescriptionDashboard';
import NewPrescription from './components/Prescriptions/NewPrescription';
import TelehealthDashboard from './components/Telehealth/TelehealthDashboard';
import VideoSession from './components/Telehealth/VideoSession';
import TechCheck from './components/Telehealth/TechCheck';
import MessagesDashboard from './components/Messages/MessagesDashboard';
import TaskBoard from './components/Tasks/TaskBoard';
import ReportsDashboard from './components/Reports/ReportsDashboard';
import AvailabilityManager from './components/Availability/AvailabilityManager';
import SettingsPage from './components/Settings/SettingsPage';
import SupportPage from './components/Support/SupportPage';
import UserProfile from './components/Profile/UserProfile';
import TopBar from './components/Layout/TopBar';
import ContextualHelp from './components/Layout/ContextualHelp';

// --- Sidebar ---
const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  
  const links = [
    { header: 'Clinical', items: [
      { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/' },
      { icon: <Calendar size={18} />, label: 'Appointments', path: '/appointments' },
      { icon: <Users size={18} />, label: 'Patients', path: '/patients' },
      { icon: <FileText size={18} />, label: 'Clinical Notes', path: '/notes' },
      { icon: <Pill size={18} />, label: 'Prescriptions', path: '/prescriptions' },
      { icon: <Video size={18} />, label: 'Telehealth', path: '/telehealth' },
    ]},
    { header: 'Administrative', items: [
      { icon: <ClipboardList size={18} />, label: 'Tasks', path: '/tasks' },
      { icon: <MessageSquare size={18} />, label: 'Messages', path: '/messages' },
      { icon: <BarChart2 size={18} />, label: 'Reports', path: '/reports' },
      { icon: <Clock size={18} />, label: 'Availability', path: '/availability' },
    ]},
    { header: 'System', items: [
      { icon: <HelpCircle size={18} />, label: 'Support', path: '/support' },
      { icon: <Settings size={18} />, label: 'Settings', path: '/settings' },
    ]}
  ];

  const unreadMsgCount = MOCK_MESSAGE_THREADS.filter(t => t.isUnread && t.folder === 'Inbox').length;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" onClick={onClose} />}
      
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 transition-transform duration-300 transform flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">P</div>
            <span className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Pract MD</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-500 hover:text-slate-700">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 mt-2 overflow-y-auto scrollbar-hide space-y-6">
          {links.map((group, idx) => (
            <div key={idx}>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-4">{group.header}</h3>
              <div className="space-y-1">
                {group.items.map(link => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => window.innerWidth < 1024 && onClose()}
                    className={({ isActive }) => `flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive 
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 font-medium' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {link.icon}
                    <span className="flex-1">{link.label}</span>
                    {link.label === 'Messages' && unreadMsgCount > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {unreadMsgCount}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <div 
            onClick={() => { navigate('/profile'); if(window.innerWidth < 1024) onClose(); }}
            className="flex items-center space-x-3 px-4 py-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
             <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold text-xs">
                DS
             </div>
             <div>
                <p className="text-sm font-medium text-slate-800 dark:text-white">Dr. Smith</p>
                <p className="text-xs text-slate-500">View Profile</p>
             </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 relative">
          <TopBar 
            onMenuClick={() => setIsSidebarOpen(true)} 
            isDark={isDark} 
            toggleTheme={() => setIsDark(!isDark)} 
            onToggleHelp={() => setIsHelpOpen(!isHelpOpen)}
          />
          
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/tasks" element={<TaskBoard />} />
              <Route path="/patients" element={<PatientList />} />
              <Route path="/patients/:id" element={<PatientDetail />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/notes" element={<NotesDashboard />} />
              <Route path="/notes/new" element={<NoteEditor />} />
              <Route path="/notes/templates" element={<TemplateManager />} />
              <Route path="/prescriptions" element={<PrescriptionDashboard />} />
              <Route path="/prescriptions/new" element={<NewPrescription />} />
              <Route path="/telehealth" element={<TelehealthDashboard />} />
              <Route path="/telehealth/session/:id" element={<VideoSession />} />
              <Route path="/telehealth/check" element={<TechCheck />} />
              <Route path="/messages" element={<MessagesDashboard />} />
              <Route path="/reports" element={<ReportsDashboard />} />
              <Route path="/availability" element={<AvailabilityManager />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/help" element={<SupportPage />} /> {/* Redirect or Alias */}
              <Route path="/profile" element={<UserProfile />} />
              <Route path="*" element={<div className="p-10 text-center text-slate-500">Page not found</div>} />
            </Routes>
          </main>

          {/* Contextual Help Sidebar */}
          <ContextualHelp isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
        </div>
      </div>
    </Router>
  );
};

export default App;
