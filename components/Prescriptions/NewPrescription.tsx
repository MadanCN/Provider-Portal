
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, Search, AlertTriangle, CheckCircle, Shield, 
  MapPin, Pill, ChevronRight, Fingerprint, Plus, Trash2, Key, Smartphone
} from 'lucide-react';
import { MOCK_PATIENTS, MOCK_MEDICATIONS, MOCK_PHARMACIES, MOCK_PRESCRIPTIONS } from '../../constants';
import { Medication, Pharmacy, Patient } from '../../types';

interface PendingPrescription {
  tempId: string;
  medication: Medication;
  sig: string;
  quantity: number;
  refills: number;
  daysSupply: number;
  pharmacyNote: string;
}

const NewPrescription: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patientId');
  
  // Workflow State
  const [step, setStep] = useState(1); // 1: Patient, 2: Add Meds, 3: Review & Sign
  
  // Data State
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(
    patientId ? MOCK_PATIENTS.find(p => p.id === patientId) || null : null
  );
  
  const [pendingMeds, setPendingMeds] = useState<PendingPrescription[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(MOCK_PHARMACIES[0]);
  
  // Add Medication Sub-State
  const [medSearchQuery, setMedSearchQuery] = useState('');
  const [selectedMedToAdd, setSelectedMedToAdd] = useState<Medication | null>(null);
  const [medDetails, setMedDetails] = useState({
    sig: '',
    quantity: 30,
    refills: 0,
    daysSupply: 30,
    pharmacyNote: ''
  });

  // EPCS State
  const [showEPCSModal, setShowEPCSModal] = useState(false);
  const [epcsToken, setEpcsToken] = useState<'Soft' | 'Hard'>('Soft');
  const [signingPassword, setSigningPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');

  // --- Computed ---
  const hasControlledSubstance = pendingMeds.some(p => p.medication.schedule !== null);
  
  // --- Helpers ---
  const handleAddMedication = () => {
    if (selectedMedToAdd) {
      const newPending: PendingPrescription = {
        tempId: Date.now().toString(),
        medication: selectedMedToAdd,
        ...medDetails
      };
      setPendingMeds([...pendingMeds, newPending]);
      // Reset Add Form
      setSelectedMedToAdd(null);
      setMedDetails({ sig: '', quantity: 30, refills: 0, daysSupply: 30, pharmacyNote: '' });
      setMedSearchQuery('');
    }
  };

  const handleRemoveMed = (id: string) => {
    setPendingMeds(pendingMeds.filter(m => m.tempId !== id));
  };

  const getAlerts = () => {
    const alerts: { type: 'Allergy' | 'Interaction' | 'Duplicate' | 'Compliance', message: string, severity: 'High' | 'Medium' }[] = [];
    
    if (!selectedPatient) return alerts;

    pendingMeds.forEach(pm => {
      // 1. Allergy Checks
      if (selectedPatient.allergies?.some(a => 
        pm.medication.genericName.toLowerCase().includes(a.toLowerCase()) || 
        (a === 'Penicillin' && pm.medication.genericName.toLowerCase().includes('cillin'))
      )) {
        alerts.push({ type: 'Allergy', message: `Patient has allergy to ${pm.medication.genericName}`, severity: 'High' });
      }

      // 2. Schedule II Checks
      if (pm.medication.schedule === 'II') {
         if (pm.refills > 0) {
            alerts.push({ type: 'Compliance', message: `${pm.medication.name} (Schedule II) cannot have refills.`, severity: 'High' });
         }
      }

      // 3. Duplicate Therapy (vs Current Meds)
      if (selectedPatient.currentMedications?.some(cm => cm.medication.name === pm.medication.name)) {
         alerts.push({ type: 'Duplicate', message: `Patient is already taking ${pm.medication.name}`, severity: 'Medium' });
      }
    });

    // 4. Drug-Drug Interactions (Within pending batch)
    // Mock logic: Interaction between "Lisinopril" and "Potassium" or similar
    // For demo, let's say Xanax and Oxycodone interaction
    const hasBenzo = pendingMeds.some(m => m.medication.genericName.includes('Alprazolam'));
    const hasOpioid = pendingMeds.some(m => m.medication.genericName.includes('Oxycodone'));
    
    if (hasBenzo && hasOpioid) {
       alerts.push({ type: 'Interaction', message: 'Concurrent use of Opioids and Benzodiazepines (Black Box Warning)', severity: 'High' });
    }

    return alerts;
  };

  const initiateSigning = () => {
    const alerts = getAlerts();
    const blockingAlerts = alerts.filter(a => a.severity === 'High' && a.type === 'Compliance'); // Block mainly on regulatory errors
    
    if (blockingAlerts.length > 0) {
       alert("Please resolve compliance errors before signing.");
       return;
    }

    if (hasControlledSubstance) {
      setShowEPCSModal(true);
    } else {
      // Normal signing
      completePrescription();
    }
  };

  const completePrescription = () => {
    // Simulate API
    setTimeout(() => {
      alert(`Successfully prescribed ${pendingMeds.length} medications.`);
      navigate('/prescriptions');
    }, 800);
  };

  // --- Render Steps ---

  const renderStep1_Patient = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Select Patient</h3>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search patient name or MRN..." 
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 outline-none"
          autoFocus
        />
      </div>
      <div className="mt-4 border border-slate-200 dark:border-slate-700 rounded-lg divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-800">
        {MOCK_PATIENTS.slice(0, 3).map(p => (
          <div 
            key={p.id} 
            onClick={() => { setSelectedPatient(p); setStep(2); }}
            className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer flex justify-between items-center group"
          >
            <div>
              <p className="font-bold text-slate-800 dark:text-white">{p.firstName} {p.lastName}</p>
              <p className="text-sm text-slate-500">DOB: {new Date(p.dob).toLocaleDateString()} • MRN: {p.mrn}</p>
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-primary-500" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep2_AddMeds = () => (
    <div className="space-y-6 h-full flex flex-col">
       <div className="flex justify-between items-center">
          <div>
             <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Build Prescription</h3>
             <p className="text-sm text-slate-500">Add one or more medications for {selectedPatient?.firstName}</p>
          </div>
          <div className="text-right">
             <div className="text-xs text-slate-400 uppercase">Pending Items</div>
             <div className="font-bold text-xl text-primary-600">{pendingMeds.length}</div>
          </div>
       </div>

       {/* Medication Search / Entry Area */}
       <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm">
          {!selectedMedToAdd ? (
             <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-500 uppercase">Search Medication</label>
                <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input 
                      type="text" 
                      value={medSearchQuery}
                      onChange={(e) => setMedSearchQuery(e.target.value)}
                      placeholder="Type drug name (e.g. Lisinopril, Oxycodone)..." 
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 outline-none"
                      autoFocus
                   />
                </div>
                {medSearchQuery.length > 1 && (
                   <div className="border border-slate-200 dark:border-slate-700 rounded-lg max-h-40 overflow-y-auto mt-2">
                      {MOCK_MEDICATIONS.filter(m => m.name.toLowerCase().includes(medSearchQuery.toLowerCase())).map(med => (
                         <div 
                            key={med.id} 
                            onClick={() => { 
                               setSelectedMedToAdd(med); 
                               setMedDetails(prev => ({ 
                                  ...prev, 
                                  sig: med.commonSig || '', 
                                  refills: med.schedule === 'II' ? 0 : 3 
                               })); 
                            }}
                            className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer border-b border-slate-100 dark:border-slate-800 last:border-0"
                         >
                            <div className="flex justify-between items-center">
                               <span className="font-medium text-sm text-slate-800 dark:text-slate-200">{med.name} {med.strength}</span>
                               {med.schedule && <span className="text-[10px] bg-slate-800 text-white px-1.5 py-0.5 rounded">C-{med.schedule}</span>}
                            </div>
                            <span className="text-xs text-slate-500">{med.form}</span>
                         </div>
                      ))}
                   </div>
                )}
             </div>
          ) : (
             <div className="space-y-4 animate-in slide-in-from-right-4">
                <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-700 pb-2">
                   <div>
                      <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                         {selectedMedToAdd.name} {selectedMedToAdd.strength}
                         {selectedMedToAdd.schedule && <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold border border-red-200">Schedule {selectedMedToAdd.schedule}</span>}
                      </h4>
                      <p className="text-xs text-slate-500">{selectedMedToAdd.genericName}</p>
                   </div>
                   <button onClick={() => setSelectedMedToAdd(null)} className="text-xs text-red-500 hover:underline">Change</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Sig (Instructions)</label>
                      <textarea 
                         value={medDetails.sig}
                         onChange={e => setMedDetails({...medDetails, sig: e.target.value})}
                         className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-transparent text-sm"
                         rows={2}
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Quantity</label>
                      <input 
                         type="number"
                         value={medDetails.quantity}
                         onChange={e => setMedDetails({...medDetails, quantity: parseInt(e.target.value)})}
                         className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-transparent text-sm"
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Refills</label>
                      <select 
                         value={medDetails.refills}
                         onChange={e => setMedDetails({...medDetails, refills: parseInt(e.target.value)})}
                         disabled={selectedMedToAdd.schedule === 'II'}
                         className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-transparent text-sm"
                      >
                         {[0,1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                   </div>
                </div>

                <div className="flex justify-end pt-2">
                   <button 
                      onClick={handleAddMedication}
                      className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 flex items-center gap-2"
                   >
                      <Plus size={16} /> Add to List
                   </button>
                </div>
             </div>
          )}
       </div>

       {/* Pending List Preview */}
       <div className="flex-1 overflow-y-auto">
          <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Prescription Basket</h4>
          {pendingMeds.length === 0 ? (
             <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                <Pill className="mx-auto text-slate-300 mb-2" size={24} />
                <p className="text-sm text-slate-400">No medications added yet.</p>
             </div>
          ) : (
             <div className="space-y-2">
                {pendingMeds.map(pm => (
                   <div key={pm.tempId} className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
                      <div>
                         <p className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                            {pm.medication.name}
                            {pm.medication.schedule && <span className="w-2 h-2 rounded-full bg-red-500" title="Controlled Substance"></span>}
                         </p>
                         <p className="text-xs text-slate-500">{pm.quantity} units • {pm.refills} refills</p>
                      </div>
                      <button onClick={() => handleRemoveMed(pm.tempId)} className="text-slate-400 hover:text-red-500 p-1">
                         <Trash2 size={16} />
                      </button>
                   </div>
                ))}
             </div>
          )}
       </div>

       {/* Actions */}
       <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
          <button onClick={() => setStep(1)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm">Back</button>
          <button 
             disabled={pendingMeds.length === 0}
             onClick={() => setStep(3)}
             className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
             Review & Sign <ChevronRight size={16} />
          </button>
       </div>
    </div>
  );

  const renderStep3_Review = () => {
     const alerts = getAlerts();

     return (
      <div className="space-y-6 h-full flex flex-col">
         <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Review & Sign</h3>
            <p className="text-sm text-slate-500">Review clinical alerts and sign prescriptions.</p>
         </div>

         {/* Alerts Panel */}
         {alerts.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r-lg space-y-2">
               <h4 className="text-sm font-bold text-amber-800 dark:text-amber-200 flex items-center gap-2">
                  <AlertTriangle size={16} /> Clinical Alerts
               </h4>
               {alerts.map((alert, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-300 ml-6">
                     <span className="font-bold">• {alert.type}:</span> {alert.message}
                  </div>
               ))}
            </div>
         )}

         {/* Final List */}
         <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {pendingMeds.map(pm => (
               <div key={pm.tempId} className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                  {pm.medication.schedule && <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-bl font-bold">CONTROLLED SUBSTANCE</div>}
                  <div className="flex justify-between items-start">
                     <div>
                        <h4 className="font-bold text-slate-800 dark:text-white">{pm.medication.name} {pm.medication.strength}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 italic">"{pm.sig}"</p>
                        <div className="flex gap-4 mt-2 text-xs text-slate-500">
                           <span>Qty: <strong className="text-slate-700 dark:text-slate-300">{pm.quantity}</strong></span>
                           <span>Refills: <strong className="text-slate-700 dark:text-slate-300">{pm.refills}</strong></span>
                           <span>Days Supply: <strong className="text-slate-700 dark:text-slate-300">{pm.daysSupply}</strong></span>
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>

         {/* Pharmacy Selection */}
         <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-2">
               <label className="text-xs font-bold text-slate-500 uppercase">Pharmacy</label>
               <button className="text-xs text-primary-600 hover:underline">Change</button>
            </div>
            <div className="flex items-center gap-3">
               <MapPin size={20} className="text-slate-400" />
               <div>
                  <p className="font-bold text-sm text-slate-800 dark:text-white">{selectedPharmacy?.name}</p>
                  <p className="text-xs text-slate-500">{selectedPharmacy?.address}</p>
               </div>
            </div>
         </div>

         <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
            <button onClick={() => setStep(2)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm">Back</button>
            <button 
               onClick={initiateSigning}
               className={`px-6 py-2 text-white rounded-lg font-bold shadow-sm flex items-center gap-2 ${
                  hasControlledSubstance ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-primary-600 hover:bg-primary-700'
               }`}
            >
               {hasControlledSubstance ? <Shield size={16} /> : <CheckCircle size={16} />}
               {hasControlledSubstance ? 'Sign with EPCS' : 'Sign & Send'}
            </button>
         </div>
      </div>
     );
  };

  return (
    <div className="p-6 h-[calc(100vh-64px)] overflow-y-auto bg-slate-50 dark:bg-slate-900 flex justify-center">
      <div className="w-full max-w-4xl">
         {/* Wizard Progress */}
         <div className="mb-6 flex items-center justify-between text-sm font-medium text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            <span className={step >= 1 ? 'text-primary-600 dark:text-primary-400 font-bold' : ''}>1. Patient</span>
            <div className={`h-1 flex-1 mx-4 rounded-full ${step >= 2 ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
            <span className={step >= 2 ? 'text-primary-600 dark:text-primary-400 font-bold' : ''}>2. Medications</span>
            <div className={`h-1 flex-1 mx-4 rounded-full ${step >= 3 ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
            <span className={step >= 3 ? 'text-primary-600 dark:text-primary-400 font-bold' : ''}>3. Sign</span>
         </div>

         <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden min-h-[500px] flex flex-col">
            <div className="p-6 md:p-8 flex-1">
               {step === 1 && renderStep1_Patient()}
               {step === 2 && renderStep2_AddMeds()}
               {step === 3 && renderStep3_Review()}
            </div>
         </div>
      </div>

      {/* EPCS Modal */}
      {showEPCSModal && (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 relative border border-slate-200 dark:border-slate-700">
               <button onClick={() => setShowEPCSModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                  <Plus className="rotate-45" size={24} />
               </button>

               <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100 dark:border-blue-800">
                     <Fingerprint size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">EPCS Authentication</h3>
                  <p className="text-sm text-slate-500 mt-2">
                     You are signing prescriptions for <strong className="text-slate-700 dark:text-slate-300">Controlled Substances</strong>. 
                     Two-factor authentication is required by DEA regulations.
                  </p>
               </div>

               <div className="space-y-6">
                  {/* Token Selection */}
                  <div className="grid grid-cols-2 gap-3">
                     <button 
                        onClick={() => setEpcsToken('Soft')}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                           epcsToken === 'Soft' 
                           ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500' 
                           : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600'
                        }`}
                     >
                        <Smartphone size={20} />
                        <span className="text-xs font-bold">Push / Soft Token</span>
                     </button>
                     <button 
                        onClick={() => setEpcsToken('Hard')}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                           epcsToken === 'Hard' 
                           ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500' 
                           : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600'
                        }`}
                     >
                        <Key size={20} />
                        <span className="text-xs font-bold">Hardware Token</span>
                     </button>
                  </div>

                  {/* Credentials */}
                  <div className="space-y-3">
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Prescriber Password</label>
                        <input 
                           type="password" 
                           value={signingPassword}
                           onChange={e => setSigningPassword(e.target.value)}
                           className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800"
                           placeholder="Enter your login password"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                           {epcsToken === 'Soft' ? 'Mobile App Code / Approval' : 'Token Code'}
                        </label>
                        <input 
                           type="text" 
                           value={otpCode}
                           onChange={e => setOtpCode(e.target.value)}
                           className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 font-mono tracking-widest"
                           placeholder="000 000"
                        />
                        {epcsToken === 'Soft' && (
                           <p className="text-xs text-blue-600 mt-2 cursor-pointer hover:underline text-right">Send Push Notification</p>
                        )}
                     </div>
                  </div>

                  <div className="pt-2">
                     <button 
                        onClick={completePrescription}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                     >
                        <Shield size={18} /> Sign & Transmit
                     </button>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default NewPrescription;
