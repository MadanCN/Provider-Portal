
import React, { useState } from 'react';
import { 
  Check, Settings, Plus, GripVertical, Minimize2, Maximize2, Trash2, RotateCcw
} from 'lucide-react';
import { DEFAULT_WIDGETS } from '../../constants';
import { WidgetConfig, WidgetType } from '../../types';
import { 
  AlertPanelWidget, TodayScheduleWidget, NewAppointmentsWidget, 
  PatientCompositionChart, PendingNotesWidget, AppointmentStatusChart,
  RecentActivityWidget, UpcomingAppointmentsWidget 
} from './DashboardWidgets';

const DashboardHome: React.FC = () => {
   const [widgets, setWidgets] = useState<WidgetConfig[]>(DEFAULT_WIDGETS);
   const [isCustomizing, setIsCustomizing] = useState(false);
   const [draggedWidgetId, setDraggedWidgetId] = useState<string | null>(null);

   const toggleWidgetVisibility = (id: string) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, isVisible: !w.isVisible } : w));
  };

  const handleResize = (id: string, delta: number) => {
    setWidgets(prev => prev.map(w => {
      if (w.id === id) {
        // Limit colSpan between 1 and 4
        const newSpan = Math.max(1, Math.min(4, w.colSpan + delta)) as 1|2|3|4;
        return { ...w, colSpan: newSpan };
      }
      return w;
    }));
  };

  const handleResetLayout = () => {
    if (confirm("Reset dashboard layout to default?")) {
      setWidgets(DEFAULT_WIDGETS);
    }
  };

  // --- Drag and Drop Logic ---

  const handleDragStart = (e: React.DragEvent, id: string) => {
    if (!isCustomizing) return;
    setDraggedWidgetId(id);
    e.dataTransfer.effectAllowed = 'move';
    // Transparent drag image usually handled by browser, but we can set it if needed
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    if (!isCustomizing || !draggedWidgetId || draggedWidgetId === targetId) return;
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    if (!isCustomizing || !draggedWidgetId) return;
    e.preventDefault();
    
    const newWidgets = [...widgets];
    const draggedIndex = newWidgets.findIndex(w => w.id === draggedWidgetId);
    const targetIndex = newWidgets.findIndex(w => w.id === targetId);
    
    // Remove dragged item
    const [removed] = newWidgets.splice(draggedIndex, 1);
    // Insert at new position
    newWidgets.splice(targetIndex, 0, removed);
    
    setWidgets(newWidgets);
    setDraggedWidgetId(null);
  };

  const renderWidgetContent = (type: WidgetType) => {
    switch (type) {
      case WidgetType.ALERT_PANEL: return <AlertPanelWidget />;
      case WidgetType.TODAY_SCHEDULE: return <TodayScheduleWidget />;
      case WidgetType.NEW_APPTS: return <NewAppointmentsWidget />;
      case WidgetType.PATIENT_COMP_CHART: return <PatientCompositionChart />;
      case WidgetType.PENDING_NOTES: return <PendingNotesWidget />;
      case WidgetType.APPT_STATUS_CHART: return <AppointmentStatusChart />;
      case WidgetType.RECENT_ACTIVITY: return <RecentActivityWidget />;
      case WidgetType.UPCOMING_APPTS: return <UpcomingAppointmentsWidget />;
      default: return <div className="p-4 text-slate-400">Widget not implemented</div>;
    }
  };

   return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back, Dr. Smith</p>
        </div>
        
        <div className="flex items-center gap-2">
           {isCustomizing && (
              <button 
                onClick={handleResetLayout}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                 <RotateCcw size={16} />
                 <span>Reset Default</span>
              </button>
           )}
           <button 
             onClick={() => setIsCustomizing(!isCustomizing)}
             className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm border ${
               isCustomizing 
                 ? 'bg-primary-600 text-white border-primary-600 hover:bg-primary-700' 
                 : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
             }`}
           >
             {isCustomizing ? <Check size={16} /> : <Settings size={16} />}
             <span>{isCustomizing ? 'Finish Editing' : 'Customize Dashboard'}</span>
           </button>
        </div>
      </div>

      {isCustomizing && (
        <div className="mb-8 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm animate-in slide-in-from-top-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-wide flex items-center gap-2">
            <Plus size={16} className="text-primary-600" /> Add / Remove Widgets
          </h3>
          <div className="flex flex-wrap gap-3">
            {widgets.map(w => (
              <button
                key={w.id}
                onClick={() => toggleWidgetVisibility(w.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all flex items-center space-x-2 ${
                  w.isVisible 
                    ? 'bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-900/30 dark:border-primary-800 dark:text-primary-300 shadow-sm' 
                    : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-500 opacity-70 hover:opacity-100'
                }`}
              >
                <span>{w.title}</span>
                {w.isVisible ? <Check size={14} strokeWidth={3} /> : <Plus size={14} />}
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
             Tip: Drag widgets to reorder. Use the resize controls on each card to adjust width.
          </p>
        </div>
      )}

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-min ${isCustomizing ? 'pb-20' : ''}`}>
        {widgets.filter(w => w.isVisible).map((widget) => (
          <div
            key={widget.id}
            draggable={isCustomizing}
            onDragStart={(e) => handleDragStart(e, widget.id)}
            onDragOver={(e) => handleDragOver(e, widget.id)}
            onDrop={(e) => handleDrop(e, widget.id)}
            className={`
              relative flex flex-col
              bg-white dark:bg-slate-800 rounded-xl border shadow-sm overflow-hidden
              transition-all duration-300 ease-in-out
              ${widget.colSpan === 4 ? 'col-span-1 md:col-span-2 lg:col-span-4' : ''}
              ${widget.colSpan === 3 ? 'col-span-1 md:col-span-2 lg:col-span-3' : ''}
              ${widget.colSpan === 2 ? 'col-span-1 md:col-span-2' : ''}
              ${widget.colSpan === 1 ? 'col-span-1' : ''}
              ${isCustomizing ? 'border-primary-300 dark:border-primary-700 border-dashed ring-4 ring-primary-50 dark:ring-primary-900/20 cursor-move z-10' : 'border-slate-200 dark:border-slate-700 hover:shadow-md'}
              ${isCustomizing && draggedWidgetId === widget.id ? 'opacity-20 scale-95' : 'opacity-100'}
              min-h-[240px]
            `}
          >
            {/* Customization Overlay / Header */}
            {isCustomizing && (
               <div className="absolute inset-x-0 top-0 h-10 bg-primary-50 dark:bg-slate-700/80 backdrop-blur-sm border-b border-primary-100 dark:border-slate-600 flex items-center justify-between px-3 z-20">
                  <div className="flex items-center gap-2 cursor-grab active:cursor-grabbing text-slate-500 dark:text-slate-300">
                     <GripVertical size={16} />
                     <span className="text-xs font-bold uppercase tracking-wider">{widget.title}</span>
                  </div>
                  <div className="flex items-center gap-1">
                     <button 
                        onClick={(e) => { e.stopPropagation(); handleResize(widget.id, -1); }}
                        disabled={widget.colSpan <= 1}
                        className="p-1 hover:bg-white dark:hover:bg-slate-600 rounded disabled:opacity-30 text-slate-600 dark:text-slate-300"
                        title="Shrink"
                     >
                        <Minimize2 size={14} />
                     </button>
                     <span className="text-[10px] font-mono font-bold w-4 text-center text-slate-500">{widget.colSpan}x</span>
                     <button 
                        onClick={(e) => { e.stopPropagation(); handleResize(widget.id, 1); }}
                        disabled={widget.colSpan >= 4}
                        className="p-1 hover:bg-white dark:hover:bg-slate-600 rounded disabled:opacity-30 text-slate-600 dark:text-slate-300"
                        title="Expand"
                     >
                        <Maximize2 size={14} />
                     </button>
                     <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                     <button 
                        onClick={(e) => { e.stopPropagation(); toggleWidgetVisibility(widget.id); }}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-600 rounded transition-colors"
                        title="Remove Widget"
                     >
                        <Trash2 size={14} />
                     </button>
                  </div>
               </div>
            )}

            <div className={`p-5 h-full flex flex-col ${isCustomizing ? 'pt-12 pointer-events-none filter blur-[1px]' : ''}`}>
               {renderWidgetContent(widget.type)}
            </div>
          </div>
        ))}
      </div>
    </div>
   );
};

export default DashboardHome;
