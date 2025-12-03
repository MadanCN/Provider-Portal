
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, Save, Mic, CheckCircle, Printer, ChevronDown, ChevronRight,
  User, Calendar, MapPin, Building
} from 'lucide-react';
import { NOTE_TEMPLATES, MOCK_PATIENTS, PRACTICE_INFO } from '../../constants';
import { NoteTemplate, TemplateField } from '../../types';

// --- Reusable Components ---

const DictationInput: React.FC<{ 
  value: string; 
  onChange: (val: string) => void; 
  placeholder?: string;
  multiline?: boolean; 
}> = ({ value, onChange, placeholder, multiline }) => {
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = () => {
    if (isRecording) {
      // Stop Simulation
      setIsRecording(false);
      onChange((value || '') + ' [Dictated text: Patient denies any chest pain or shortness of breath.] '); 
    } else {
      // Start Simulation
      setIsRecording(true);
    }
  };

  const baseClasses = "w-full p-2 text-sm bg-transparent border-none focus:ring-0 resize-none";

  return (
    <div className={`relative border rounded-md transition-all ${isRecording ? 'border-red-400 ring-2 ring-red-100 dark:ring-red-900/20' : 'border-slate-300 dark:border-slate-600 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500'} bg-white dark:bg-slate-900 dark:text-white`}>
      {multiline ? (
        <textarea 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${baseClasses} min-h-[80px]`}
        />
      ) : (
        <input 
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={baseClasses}
        />
      )}
      <button 
        onClick={toggleRecording}
        className={`absolute bottom-2 right-2 p-1.5 rounded-full transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-primary-600 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        title="Dictate"
      >
        <Mic size={14} />
      </button>
    </div>
  );
};

const BrandingHeader: React.FC<{ patient: any }> = ({ patient }) => (
  <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 flex flex-col md:flex-row justify-between items-start gap-4">
    <div className="flex items-start gap-3">
       <div className="p-3 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-lg">
          <Building size={24} />
       </div>
       <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">{PRACTICE_INFO.name}</h1>
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
             <MapPin size={12} /> {PRACTICE_INFO.address}
          </div>
          <div className="text-xs text-slate-500 mt-0.5 ml-4">
             Ph: {PRACTICE_INFO.phone}
          </div>
       </div>
    </div>
    
    <div className="text-right">
       <div className="inline-block text-left bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Patient Details</p>
          <p className="font-bold text-slate-800 dark:text-white">{patient.firstName} {patient.lastName}</p>
          <p className="text-xs text-slate-600 dark:text-slate-300">DOB: {new Date(patient.dob).toLocaleDateString()}</p>
          <p className="text-xs text-slate-600 dark:text-slate-300">MRN: {patient.mrn}</p>
       </div>
       <p className="text-xs text-slate-400 mt-2">Date: {new Date().toLocaleDateString()}</p>
    </div>
  </div>
);

// --- Main Editor ---

const NoteEditor: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patientId');
  const templateId = searchParams.get('templateId');

  // Load Data
  const patient = MOCK_PATIENTS.find(p => p.id === patientId);
  const template = NOTE_TEMPLATES.find(t => t.id === templateId);
  
  // State
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Initialize open sections
    if (template) {
       const initialOpen: Record<string, boolean> = {};
       template.structure.forEach(s => initialOpen[s.id] = true);
       setOpenSections(initialOpen);
    }
  }, [template]);

  if (!patient || !template) {
     return <div className="p-10 text-center">Invalid Patient or Template ID</div>;
  }

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({...prev, [id]: !prev[id]}));
  };

  const handleFieldChange = (fieldId: string, value: any) => {
     setFormData(prev => ({...prev, [fieldId]: value}));
  };

  const renderField = (field: TemplateField) => {
    const val = formData[field.id] || '';

    switch(field.type) {
       case 'text':
       case 'number':
          return (
             <DictationInput 
               value={val} 
               onChange={(v) => handleFieldChange(field.id, v)} 
               placeholder={field.placeholder}
             />
          );
       case 'textarea':
          return (
             <DictationInput 
               value={val} 
               onChange={(v) => handleFieldChange(field.id, v)} 
               placeholder={field.placeholder}
               multiline
             />
          );
       case 'select':
          return (
             <select 
               value={val}
               onChange={(e) => handleFieldChange(field.id, e.target.value)}
               className="w-full p-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 dark:text-white focus:ring-1 focus:ring-primary-500"
             >
                <option value="">Select option...</option>
                {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
             </select>
          );
       case 'checkbox':
          // For checkbox group, value is array
          const selected = Array.isArray(val) ? val : [];
          return (
             <div className="flex flex-wrap gap-3">
                {field.options?.map(opt => (
                   <label key={opt} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={selected.includes(opt)}
                        onChange={(e) => {
                           if (e.target.checked) handleFieldChange(field.id, [...selected, opt]);
                           else handleFieldChange(field.id, selected.filter((s: string) => s !== opt));
                        }}
                        className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                      />
                      {opt}
                   </label>
                ))}
             </div>
          );
       case 'date':
          return (
             <input 
               type="date" 
               value={val}
               onChange={e => handleFieldChange(field.id, e.target.value)}
               className="p-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 dark:text-white"
             />
          );
       default:
          return null;
    }
  };

  const handleSign = () => {
     // Save logic would go here
     alert('Note Signed and Finalized');
     navigate('/patients/' + patient.id);
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-slate-100 dark:bg-slate-900 overflow-hidden">
       {/* Editor Toolbar */}
       <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex justify-between items-center shadow-sm z-10 shrink-0">
          <div className="flex items-center space-x-4">
             <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-800 dark:text-slate-400">
                <ArrowLeft size={20} />
             </button>
             <div>
                <h1 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                   {template.name}
                   <span className="text-xs font-normal text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">Draft</span>
                </h1>
                <p className="text-xs text-slate-500">Author: Dr. Smith</p>
             </div>
          </div>
          <div className="flex items-center space-x-3">
             <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full" title="Print View">
                <Printer size={18} />
             </button>
             <button className="flex items-center space-x-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700">
                <Save size={16} />
                <span>Save Draft</span>
             </button>
             <button onClick={handleSign} className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 shadow-sm">
                <CheckCircle size={16} />
                <span>Sign Note</span>
             </button>
          </div>
       </div>

       {/* Scrollable Document Area */}
       <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 shadow-sm rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
             
             {/* Branding Header */}
             <BrandingHeader patient={patient} />

             {/* Dynamic Form Content */}
             <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {template.structure.map(section => (
                   <div key={section.id} className="bg-white dark:bg-slate-800">
                      <div 
                        className="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                        onClick={() => toggleSection(section.id)}
                      >
                         <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200 uppercase tracking-wide">{section.title}</h3>
                         {openSections[section.id] ? <ChevronDown size={16} className="text-slate-400"/> : <ChevronRight size={16} className="text-slate-400"/>}
                      </div>
                      
                      {openSections[section.id] && (
                         <div className="p-6 grid grid-cols-1 gap-6 animate-in slide-in-from-top-1">
                            {section.fields.map(field => (
                               <div key={field.id} className="flex flex-col gap-2">
                                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                     {field.label}
                                  </label>
                                  {renderField(field)}
                               </div>
                            ))}
                            {section.fields.length === 0 && <p className="text-sm text-slate-400 italic">No fields in this section.</p>}
                         </div>
                      )}
                   </div>
                ))}
             </div>
             
             {/* Footer Area */}
             <div className="p-8 border-t border-slate-200 dark:border-slate-700 text-center">
                 <p className="text-xs text-slate-400">Electronically signed by Dr. David Smith on {new Date().toLocaleDateString()}</p>
             </div>

          </div>
       </div>
    </div>
  );
};

export default NoteEditor;
