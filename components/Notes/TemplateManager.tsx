
import React, { useState } from 'react';
import { 
  ArrowLeft, Plus, Save, Trash2, GripVertical, 
  Type, CheckSquare, List, AlignLeft 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NOTE_TEMPLATES } from '../../constants';
import { NoteTemplate, TemplateSection, TemplateField, FieldType } from '../../types';

const TemplateManager: React.FC = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<NoteTemplate[]>(NOTE_TEMPLATES);
  const [editingTemplate, setEditingTemplate] = useState<NoteTemplate | null>(null);

  // --- Actions ---

  const handleCreateNew = () => {
    const newTemplate: NoteTemplate = {
      id: `t_${Date.now()}`,
      name: 'New Template',
      description: 'Custom clinical template',
      category: 'General',
      structure: [
        {
          id: `s_${Date.now()}`,
          title: 'Section 1',
          fields: []
        }
      ]
    };
    setEditingTemplate(newTemplate);
  };

  const handleEdit = (t: NoteTemplate) => {
    // Deep copy to avoid mutating state directly during edit
    setEditingTemplate(JSON.parse(JSON.stringify(t)));
  };

  const handleSave = () => {
    if (!editingTemplate) return;
    
    setTemplates(prev => {
      const exists = prev.find(t => t.id === editingTemplate.id);
      if (exists) {
        return prev.map(t => t.id === editingTemplate.id ? editingTemplate : t);
      }
      return [...prev, editingTemplate];
    });
    setEditingTemplate(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this template?")) {
      setTemplates(prev => prev.filter(t => t.id !== id));
      if (editingTemplate?.id === id) setEditingTemplate(null);
    }
  };

  // --- Editor Logic ---

  const addSection = () => {
    if (!editingTemplate) return;
    const newSection: TemplateSection = {
      id: `s_${Date.now()}`,
      title: 'New Section',
      fields: []
    };
    setEditingTemplate({
      ...editingTemplate,
      structure: [...editingTemplate.structure, newSection]
    });
  };

  const updateSectionTitle = (sectionIndex: number, title: string) => {
    if (!editingTemplate) return;
    const newStructure = [...editingTemplate.structure];
    newStructure[sectionIndex].title = title;
    setEditingTemplate({ ...editingTemplate, structure: newStructure });
  };

  const removeSection = (sectionIndex: number) => {
    if (!editingTemplate) return;
    const newStructure = editingTemplate.structure.filter((_, i) => i !== sectionIndex);
    setEditingTemplate({ ...editingTemplate, structure: newStructure });
  };

  const addField = (sectionIndex: number, type: FieldType) => {
    if (!editingTemplate) return;
    const newField: TemplateField = {
      id: `f_${Date.now()}`,
      label: 'New Field',
      type: type,
      options: type === 'select' || type === 'checkbox' ? ['Option 1', 'Option 2'] : undefined
    };
    const newStructure = [...editingTemplate.structure];
    newStructure[sectionIndex].fields.push(newField);
    setEditingTemplate({ ...editingTemplate, structure: newStructure });
  };

  const updateField = (sectionIndex: number, fieldIndex: number, updates: Partial<TemplateField>) => {
    if (!editingTemplate) return;
    const newStructure = [...editingTemplate.structure];
    newStructure[sectionIndex].fields[fieldIndex] = {
      ...newStructure[sectionIndex].fields[fieldIndex],
      ...updates
    };
    setEditingTemplate({ ...editingTemplate, structure: newStructure });
  };

  const removeField = (sectionIndex: number, fieldIndex: number) => {
    if (!editingTemplate) return;
    const newStructure = [...editingTemplate.structure];
    newStructure[sectionIndex].fields = newStructure[sectionIndex].fields.filter((_, i) => i !== fieldIndex);
    setEditingTemplate({ ...editingTemplate, structure: newStructure });
  };

  // --- Render ---

  if (editingTemplate) {
    return (
      <div className="p-6 h-[calc(100vh-64px)] overflow-y-auto bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setEditingTemplate(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white">
              <ArrowLeft size={18} /> Cancel
            </button>
            <div className="flex gap-2">
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                <Save size={18} /> Save Template
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Template Name</label>
                  <input 
                    type="text" 
                    value={editingTemplate.name} 
                    onChange={e => setEditingTemplate({...editingTemplate, name: e.target.value})}
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-transparent dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                  <select 
                     value={editingTemplate.category}
                     onChange={e => setEditingTemplate({...editingTemplate, category: e.target.value as any})}
                     className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-transparent dark:text-white"
                  >
                    <option value="General">General</option>
                    <option value="Specialty">Specialty</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="col-span-2">
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                   <input 
                    type="text" 
                    value={editingTemplate.description} 
                    onChange={e => setEditingTemplate({...editingTemplate, description: e.target.value})}
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-transparent dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Sections Builder */}
            <div className="space-y-4">
              {editingTemplate.structure.map((section, sIdx) => (
                <div key={section.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <div className="flex items-center gap-2 flex-1">
                      <GripVertical className="text-slate-400 cursor-move" size={16} />
                      <input 
                        type="text" 
                        value={section.title}
                        onChange={e => updateSectionTitle(sIdx, e.target.value)}
                        className="bg-transparent font-bold text-slate-800 dark:text-white focus:outline-none focus:border-b border-primary-500"
                      />
                    </div>
                    <button onClick={() => removeSection(sIdx)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="p-4 space-y-3">
                    {section.fields.map((field, fIdx) => (
                      <div key={field.id} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
                         <div className="mt-2 text-slate-400"><GripVertical size={14} /></div>
                         <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                            <input 
                              type="text" 
                              value={field.label}
                              onChange={e => updateField(sIdx, fIdx, { label: e.target.value })}
                              placeholder="Field Label"
                              className="p-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 dark:text-white"
                            />
                            <select
                              value={field.type}
                              onChange={e => updateField(sIdx, fIdx, { type: e.target.value as FieldType })}
                              className="p-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 dark:text-white"
                            >
                               <option value="text">Single Line Text</option>
                               <option value="textarea">Multi-line (Dictation)</option>
                               <option value="select">Dropdown</option>
                               <option value="checkbox">Checkbox Group</option>
                               <option value="date">Date</option>
                               <option value="number">Number</option>
                            </select>
                            
                            {(field.type === 'select' || field.type === 'checkbox') && (
                               <input 
                                type="text" 
                                value={field.options?.join(', ')}
                                onChange={e => updateField(sIdx, fIdx, { options: e.target.value.split(',').map(s => s.trim()) })}
                                placeholder="Options (comma separated)"
                                className="p-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 dark:text-white"
                              />
                            )}
                         </div>
                         <button onClick={() => removeField(sIdx, fIdx)} className="mt-1 text-slate-400 hover:text-red-500">
                            <XIcon size={16} />
                         </button>
                      </div>
                    ))}

                    <div className="flex gap-2 pt-2">
                       <button onClick={() => addField(sIdx, 'text')} className="text-xs flex items-center gap-1 px-2 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300">
                          <Type size={12} /> Add Text
                       </button>
                       <button onClick={() => addField(sIdx, 'textarea')} className="text-xs flex items-center gap-1 px-2 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300">
                          <AlignLeft size={12} /> Add Area
                       </button>
                       <button onClick={() => addField(sIdx, 'select')} className="text-xs flex items-center gap-1 px-2 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300">
                          <List size={12} /> Add Select
                       </button>
                    </div>
                  </div>
                </div>
              ))}

              <button 
                onClick={addSection}
                className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 hover:border-primary-500 hover:text-primary-600 transition flex items-center justify-center gap-2"
              >
                <Plus size={18} /> Add New Section
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- List View ---

  return (
    <div className="p-6 h-[calc(100vh-64px)] overflow-y-auto bg-slate-50 dark:bg-slate-900">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
           <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Template Manager</h2>
              <p className="text-sm text-slate-500">Customize clinical documentation templates</p>
           </div>
           <div className="flex gap-3">
              <button onClick={() => navigate('/notes')} className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                 Back to Notes
              </button>
              <button onClick={handleCreateNew} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition shadow-sm">
                 <Plus size={16} /> New Template
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {templates.map(template => (
             <div key={template.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition p-6 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                   <div className="p-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-lg">
                      <List size={20} />
                   </div>
                   <div className="flex gap-1">
                      <button onClick={() => handleEdit(template)} className="p-1.5 text-slate-400 hover:text-primary-600 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                         <Type size={16} />
                      </button>
                      <button onClick={() => handleDelete(template.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 dark:hover:bg-red-900/20">
                         <Trash2 size={16} />
                      </button>
                   </div>
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white mb-1">{template.name}</h3>
                <p className="text-xs text-slate-500 mb-4 h-8">{template.description}</p>
                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs text-slate-400">
                   <span>{template.structure.length} Sections</span>
                   <span>{template.category}</span>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

// Helper icon
const XIcon: React.FC<{size?: number}> = ({size}) => (
   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export default TemplateManager;
