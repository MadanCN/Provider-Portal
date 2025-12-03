
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Edit2, Trash2, Phone, Mail, MapPin, 
  ShieldCheck, AlertCircle, FileText, Activity, Calendar,
  CheckCircle, Clock, Plus, ChevronRight, File, MessageSquare, Pill, AlertTriangle
} from 'lucide-react';
import { MOCK_PATIENTS, MOCK_PLANS, MOCK_NOTES, MOCK_PRESCRIPTIONS } from '../../constants';
import { Patient, TreatmentPlan, ClinicalNote } from '../../types';

// --- Tab Components ---

const DetailsTab: React.FC<{ patient: Patient }> = ({ patient }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Basic Info */}
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">Personal Details</h3>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-500 uppercase">Legal Name</label>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{patient.firstName} {patient.lastName}</p>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 uppercase">Preferred Name</label>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{patient.preferredName || '-'}</p>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 uppercase">Date of Birth</label>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{new Date(patient.dob).toLocaleDateString()} (Age: {new Date().getFullYear() - new Date(patient.dob).getFullYear()})</p>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 uppercase">Gender / Pronouns</label>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{patient.gender} {patient.pronouns ? `(${patient.pronouns})` : ''}</p>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 uppercase">Marital Status</label>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Single</p>
        </div>
      </div>
    </div>

    {/* Contact Info */}
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">Contact Information</h3>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-500 uppercase">Primary Phone</label>
          <div className="flex items-center space-x-2">
            <Phone size={14} className="text-primary-500" />
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{patient.phone}</p>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 uppercase">Email Address</label>
          <div className="flex items-center space-x-2">
             <Mail size={14} className="text-primary-500" />
             <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{patient.email}</p>
          </div>
        </div>
        <div>
           <label className="text-xs font-medium text-slate-500 uppercase">Preferred Method</label>
           <span className="inline-block mt-1 px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs rounded">Email</span>
        </div>
      </div>
    </div>

    {/* Address & Emergency */}
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">Address</h3>
        <div className="flex items-start space-x-2">
           <MapPin size={16} className="text-slate-400 mt-0.5" />
           <p className="text-sm text-slate-700 dark:text-slate-300">
             {patient.address.street}<br/>
             {patient.address.city}, {patient.address.state} {patient.address.zip}
           </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2 flex items-center gap-2">
          Emergency Contact
        </h3>
        {patient.emergencyContact ? (
          <div className="space-y-2">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{patient.emergencyContact.name} ({patient.emergencyContact.relationship})</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">{patient.emergencyContact.phone}</p>
          </div>
        ) : (
          <p className="text-sm text-slate-400 italic">No emergency contact listed.</p>
        )}
      </div>
    </div>
  </div>
);

const InsuranceTab: React.FC<{ patient: Patient }> = ({ patient }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       {/* Primary Insurance */}
       <div className={`p-6 rounded-xl border-l-4 shadow-sm bg-white dark:bg-slate-800 ${
          patient.primaryInsurance?.status === 'Verified' ? 'border-green-500' : 
          patient.primaryInsurance?.status === 'Expired' ? 'border-red-500' : 'border-yellow-500'
       }`}>
          <div className="flex justify-between items-start mb-4">
             <h3 className="text-lg font-bold text-slate-800 dark:text-white">Primary Insurance</h3>
             <span className={`px-2 py-1 text-xs rounded-full font-bold ${
                patient.primaryInsurance?.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
             }`}>{patient.primaryInsurance?.status || 'Unknown'}</span>
          </div>
          {patient.primaryInsurance ? (
             <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                   <span className="block text-slate-500 text-xs uppercase">Company</span>
                   <span className="font-medium text-slate-800 dark:text-slate-200">{patient.primaryInsurance.company}</span>
                </div>
                <div>
                   <span className="block text-slate-500 text-xs uppercase">Policy #</span>
                   <span className="font-medium text-slate-800 dark:text-slate-200">{patient.primaryInsurance.policyNumber}</span>
                </div>
                <div>
                   <span className="block text-slate-500 text-xs uppercase">Policy Holder</span>
                   <span className="font-medium text-slate-800 dark:text-slate-200">{patient.primaryInsurance.policyHolderName} ({patient.primaryInsurance.relationship})</span>
                </div>
                <div>
                   <span className="block text-slate-500 text-xs uppercase">Expires</span>
                   <span className="font-medium text-slate-800 dark:text-slate-200">{new Date(patient.primaryInsurance.expiryDate).toLocaleDateString()}</span>
                </div>
             </div>
          ) : (
            <p className="text-slate-500 italic">No primary insurance on file.</p>
          )}
       </div>
       
       {/* Secondary Insurance Placeholder */}
       <div className="p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center text-slate-500">
           <ShieldCheck size={32} className="mb-2 opacity-50"/>
           <p className="text-sm">No Secondary Insurance</p>
           <button className="mt-2 text-primary-600 text-sm font-medium hover:underline">Add Secondary</button>
       </div>
    </div>

    {/* Authorization Tracker */}
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
       <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/80">
          <h3 className="font-semibold text-slate-800 dark:text-white">Authorizations</h3>
          <button className="text-xs bg-primary-600 text-white px-3 py-1.5 rounded hover:bg-primary-700 transition">Add Authorization</button>
       </div>
       <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
          <thead className="bg-slate-50 dark:bg-slate-800 uppercase text-xs font-semibold">
             <tr>
               <th className="px-4 py-3">Service</th>
               <th className="px-4 py-3">CPT</th>
               <th className="px-4 py-3">Approved</th>
               <th className="px-4 py-3">Effective</th>
               <th className="px-4 py-3">Expires</th>
               <th className="px-4 py-3">Status</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {patient.authorizations && patient.authorizations.length > 0 ? patient.authorizations.map(auth => (
              <tr key={auth.id}>
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{auth.service}</td>
                <td className="px-4 py-3">{auth.cptCode}</td>
                <td className="px-4 py-3">{auth.dateApproved}</td>
                <td className="px-4 py-3">{auth.effectiveDate}</td>
                <td className="px-4 py-3 text-orange-600">{auth.expiryDate}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    {auth.status}
                  </span>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={6} className="p-6 text-center italic text-slate-500">No authorizations found.</td></tr>
            )}
          </tbody>
       </table>
    </div>
  </div>
);

const PlansTab: React.FC<{ type: 'Intake' | 'Treatment' }> = ({ type }) => {
  const plans = MOCK_PLANS.filter(p => p.type === type);

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">{type} Plans</h3>
          <button className="flex items-center space-x-2 px-3 py-1.5 bg-primary-600 text-white rounded text-sm hover:bg-primary-700">
             <Plus size={14} />
             <span>New Plan</span>
          </button>
       </div>
       
       <div className="grid grid-cols-1 gap-6">
          {plans.map(plan => (
             <div key={plan.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex justify-between items-start mb-4">
                   <div>
                      <h4 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        {plan.name}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          plan.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                        }`}>{plan.status}</span>
                      </h4>
                      <p className="text-sm text-slate-500">Started: {new Date(plan.startDate).toLocaleDateString()} • POC: {plan.providerPoC}</p>
                   </div>
                   <div className="text-right">
                      <div className="text-2xl font-bold text-primary-600">{plan.completionPercentage}%</div>
                      <div className="text-xs text-slate-400">Completed</div>
                   </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 mb-6">
                   <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${plan.completionPercentage}%` }}></div>
                </div>

                {/* Stages */}
                <div className="space-y-3">
                   {plan.stages.map((stage, idx) => (
                      <div key={stage.id} className="flex items-center">
                         <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 border-2 ${
                            stage.status === 'Completed' ? 'bg-green-500 border-green-500 text-white' : 
                            stage.status === 'In Progress' ? 'bg-white border-blue-500 text-blue-500' : 'bg-white border-slate-300 text-slate-300'
                         }`}>
                            {stage.status === 'Completed' && <CheckCircle size={14} />}
                            {stage.status !== 'Completed' && idx + 1}
                         </div>
                         <div className="flex-1">
                            <span className={`text-sm font-medium ${stage.status === 'Completed' ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500'}`}>{stage.name}</span>
                            <span className="text-xs text-slate-400 ml-2">({stage.assignee})</span>
                         </div>
                         <span className="text-xs text-slate-400 uppercase font-medium">{stage.status}</span>
                      </div>
                   ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end space-x-3">
                   <button className="text-sm text-slate-500 hover:text-slate-700">Edit Plan</button>
                   <button className="text-sm text-primary-600 font-medium hover:underline">View Details</button>
                </div>
             </div>
          ))}
          {plans.length === 0 && <div className="text-center py-10 text-slate-500 italic">No active {type} plans.</div>}
       </div>
    </div>
  );
};

const NotesTab: React.FC<{ patientId?: string }> = ({ patientId }) => {
  const navigate = useNavigate();
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Clinical Notes</h3>
        <button 
          onClick={() => navigate(`/notes/new?patientId=${patientId}`)}
          className="flex items-center space-x-2 px-3 py-1.5 bg-primary-600 text-white rounded text-sm hover:bg-primary-700"
        >
           <Plus size={14} />
           <span>Add Note</span>
        </button>
      </div>
      <div className="space-y-4">
         {MOCK_NOTES.map(note => (
            <div key={note.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
               <div className="flex justify-between items-start mb-2">
                  <div>
                     <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        {note.subject}
                        {note.status !== 'Signed' && <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{note.status}</span>}
                     </h4>
                     <p className="text-xs text-primary-600 font-medium">{note.type} • {note.author} ({note.authorRole})</p>
                  </div>
                  <div className="text-right">
                     <span className="text-xs text-slate-400 block">{new Date(note.visitDate).toLocaleDateString()}</span>
                     {note.visibility === 'Shared' && <span className="inline-block mt-1 text-[10px] bg-blue-50 text-blue-600 px-1.5 rounded border border-blue-100">Shared w/ Patient</span>}
                  </div>
               </div>
               <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{note.content || 'No content preview.'}</p>
               <button className="mt-2 text-xs text-primary-600 font-medium hover:underline">
                  {note.status === 'Draft' ? 'Continue Editing' : 'Read full note'}
               </button>
            </div>
         ))}
      </div>
    </div>
  );
};

const PrescriptionsTab: React.FC<{ patient: Patient }> = ({ patient }) => {
  const navigate = useNavigate();
  const patientRx = MOCK_PRESCRIPTIONS.filter(rx => rx.patientId === patient.id);
  
  return (
    <div className="space-y-6">
      {/* Allergies */}
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-900 flex items-start gap-3">
         <AlertTriangle size={20} className="text-red-500 mt-0.5" />
         <div>
            <h4 className="text-sm font-bold text-red-700 dark:text-red-300 uppercase tracking-wide">Known Allergies</h4>
            {patient.allergies && patient.allergies.length > 0 ? (
               <div className="flex gap-2 mt-2 flex-wrap">
                  {patient.allergies.map(alg => (
                     <span key={alg} className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-2 py-1 text-sm font-medium rounded-md shadow-sm">
                        {alg}
                     </span>
                  ))}
               </div>
            ) : (
               <p className="text-sm text-red-600 dark:text-red-400 mt-1">No Known Allergies (NKDA)</p>
            )}
         </div>
         <button className="ml-auto text-xs text-red-600 underline">Update</button>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Active Medications</h3>
        <button 
           onClick={() => navigate(`/prescriptions/new?patientId=${patient.id}`)}
           className="flex items-center space-x-2 px-3 py-1.5 bg-primary-600 text-white rounded text-sm hover:bg-primary-700"
        >
           <Pill size={14} />
           <span>E-Prescribe</span>
        </button>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-800">
         {patientRx.length > 0 ? patientRx.map(rx => (
            <div key={rx.id} className="p-4 flex justify-between items-center">
               <div>
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm">{rx.medication.name} {rx.medication.strength}</h4>
                  <p className="text-xs text-slate-500">{rx.sig} • Qty: {rx.quantity}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Pharmacy: {rx.pharmacyName}</p>
               </div>
               <div className="text-right">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                     rx.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                  }`}>{rx.status}</span>
                  <p className="text-[10px] text-slate-400 mt-1">Refills: {rx.refills}</p>
               </div>
            </div>
         )) : (
            <div className="p-8 text-center text-slate-500 italic">No active prescriptions found.</div>
         )}
      </div>
    </div>
  );
};

// --- Main Page Component ---

const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [activePlanTab, setActivePlanTab] = useState<'Intake' | 'Treatment'>('Intake');

  const patient = MOCK_PATIENTS.find(p => p.id === id);

  if (!patient) {
    return <div className="p-10 text-center">Patient not found</div>;
  }

  return (
    <div className="min-h-full pb-10">
      {/* Header Panel */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-6">
         <button onClick={() => navigate('/patients')} className="flex items-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white mb-4 transition-colors">
            <ArrowLeft size={16} className="mr-1" /> Back to Directory
         </button>
         
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {patient.firstName[0]}{patient.lastName[0]}
               </div>
               <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                     {patient.firstName} {patient.lastName}
                     <span className={`text-sm px-2 py-0.5 rounded-full border ${patient.status === 'Active' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                        {patient.status}
                     </span>
                  </h1>
                  <div className="text-sm text-slate-500 dark:text-slate-400 flex flex-wrap gap-x-4 gap-y-1 mt-1">
                     <span className="flex items-center gap-1"><Calendar size={14} /> DOB: {new Date(patient.dob).toLocaleDateString()}</span>
                     <span className="flex items-center gap-1"><FileText size={14} /> MRN: {patient.mrn}</span>
                     <span className="flex items-center gap-1"><ShieldCheck size={14} className={patient.insuranceStatus === 'Verified' ? 'text-green-500' : 'text-red-500'} /> {patient.insuranceStatus}</span>
                  </div>
               </div>
            </div>
            
            <div className="flex space-x-3">
               <button className="flex items-center space-x-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                  <Edit2 size={16} />
                  <span>Edit Profile</span>
               </button>
               <button className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition">
                  <Trash2 size={16} />
                  <span>Delete</span>
               </button>
            </div>
         </div>
      </div>

      {/* Tabs Navigation */}
      <div className="sticky top-0 z-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 overflow-x-auto">
         <div className="flex space-x-6 min-w-max">
            {['Details', 'Insurance', 'Plans', 'Appointments', 'Communications', 'Forms', 'Documents', 'Notes', 'Prescriptions'].map(tab => (
               <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                     activeTab === tab.toLowerCase()
                     ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                     : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
               >
                  {tab}
               </button>
            ))}
         </div>
      </div>

      {/* Tab Content */}
      <div className="p-6 max-w-7xl mx-auto">
         {activeTab === 'details' && <DetailsTab patient={patient} />}
         
         {activeTab === 'insurance' && <InsuranceTab patient={patient} />}
         
         {activeTab === 'plans' && (
            <div>
               <div className="flex space-x-1 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 w-fit mb-6">
                  {['Intake', 'Treatment'].map((type) => (
                     <button
                        key={type}
                        onClick={() => setActivePlanTab(type as any)}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                           activePlanTab === type 
                           ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 shadow-sm' 
                           : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                     >
                        {type} Plan
                     </button>
                  ))}
               </div>
               <PlansTab type={activePlanTab} />
            </div>
         )}
         
         {activeTab === 'notes' && <NotesTab patientId={patient.id} />}
         
         {activeTab === 'prescriptions' && <PrescriptionsTab patient={patient} />}

         {/* Placeholder for other tabs to save space in this response */}
         {['appointments', 'communications', 'forms', 'documents'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
               <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  {activeTab === 'appointments' && <Calendar size={32} />}
                  {activeTab === 'communications' && <MessageSquare size={32} />}
                  {activeTab === 'forms' && <FileText size={32} />}
                  {activeTab === 'documents' && <File size={32} />}
               </div>
               <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300 capitalize">{activeTab} Module</h3>
               <p className="text-sm">This section is under development.</p>
            </div>
         )}
      </div>
    </div>
  );
};

export default PatientDetail;