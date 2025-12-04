
import { 
  Appointment, 
  AppointmentStatus, 
  AppointmentType, 
  Alert, 
  ClinicalNote, 
  Activity, 
  WidgetConfig, 
  WidgetType,
  Patient,
  TreatmentPlan,
  NoteTemplate,
  Medication,
  Pharmacy,
  Prescription,
  RefillRequest,
  TelehealthSession,
  TelehealthQueueItem,
  ChatMessage,
  MessageThread,
  MessageTemplate,
  Task,
  PracticeInfo,
  SupportTicket,
  Notification,
  HelpArticle
} from './types';

export const PRACTICE_INFO: PracticeInfo = {
  name: 'Pract MD Medical Group',
  address: '123 Healthcare Blvd, Suite 100, Springfield, IL 62704',
  phone: '(555) 123-4567'
};

export const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: 'w1', type: WidgetType.ALERT_PANEL, title: 'Alert Panel', colSpan: 4, isVisible: true },
  { id: 'w2', type: WidgetType.TODAY_SCHEDULE, title: "Today's Schedule", colSpan: 2, isVisible: true },
  { id: 'w3', type: WidgetType.NEW_APPTS, title: 'New Appointments', colSpan: 2, isVisible: true },
  { id: 'w4', type: WidgetType.PATIENT_COMP_CHART, title: 'Patient Composition', colSpan: 2, isVisible: true },
  { id: 'w5', type: WidgetType.APPT_STATUS_CHART, title: 'Appointments by Status', colSpan: 2, isVisible: true },
  { id: 'w6', type: WidgetType.PENDING_NOTES, title: 'Pending Clinical Notes', colSpan: 2, isVisible: true },
  { id: 'w7', type: WidgetType.UPCOMING_APPTS, title: 'Upcoming Appointments', colSpan: 1, isVisible: true },
  { id: 'w8', type: WidgetType.RECENT_ACTIVITY, title: 'Recent Activity', colSpan: 1, isVisible: true },
];

export const AVAILABLE_WIDGETS_INFO = [
  { type: WidgetType.UPCOMING_APPTS, title: 'Upcoming Appointments', description: 'Future confirmed appointments list.' },
  { type: WidgetType.NEW_APPTS, title: 'New Appointments', description: 'Recently booked visits requiring awareness.' },
  { type: WidgetType.TODAY_SCHEDULE, title: "Today's Schedule", description: 'Tactical roadmap for the current day.' },
  { type: WidgetType.ALERT_PANEL, title: 'Alert Panel', description: 'Urgent tasks and critical notifications.' },
  { type: WidgetType.PATIENT_COMP_CHART, title: 'Patient Composition', description: 'New vs. Existing patient trends.' },
  { type: WidgetType.PENDING_NOTES, title: 'Pending Notes', description: 'Incomplete documentation tracker.' },
  { type: WidgetType.APPT_STATUS_CHART, title: 'Appointment Status', description: 'Breakdown of visit statuses.' },
  { type: WidgetType.RECENT_ACTIVITY, title: 'Recent Activity', description: 'Audit trail of recent actions.' },
];

export const NOTE_TEMPLATES: NoteTemplate[] = [
  { 
    id: 't1', 
    name: 'Standard SOAP', 
    description: 'General purpose progress note', 
    category: 'General',
    structure: [
      {
        id: 's1',
        title: 'Subjective',
        fields: [
          { id: 'cc', label: 'Chief Complaint', type: 'text', placeholder: 'Reason for visit' },
          { id: 'hpi', label: 'History of Present Illness', type: 'textarea', placeholder: 'Patient presents with...' }
        ]
      },
      {
        id: 's2',
        title: 'Objective',
        fields: [
          { id: 'vitals_bp', label: 'Blood Pressure', type: 'text', placeholder: '120/80' },
          { id: 'vitals_hr', label: 'Heart Rate', type: 'number', placeholder: '72' },
          { id: 'pe', label: 'Physical Exam Findings', type: 'textarea', placeholder: 'General appearance...' }
        ]
      },
      {
        id: 's3',
        title: 'Assessment & Plan',
        fields: [
          { id: 'dx', label: 'Primary Diagnosis', type: 'text' },
          { id: 'plan', label: 'Treatment Plan', type: 'textarea' },
          { id: 'followup', label: 'Follow Up', type: 'select', options: ['1 week', '2 weeks', '1 month', '3 months', 'PRN'] }
        ]
      }
    ]
  },
  { 
    id: 't2', 
    name: 'Cardiology Consult', 
    description: 'Specialty specific consultation', 
    category: 'Specialty',
    structure: [
      {
        id: 's1',
        title: 'History',
        fields: [
          { id: 'referral_reason', label: 'Reason for Referral', type: 'text' },
          { id: 'symptoms', label: 'Cardiac Symptoms', type: 'textarea', placeholder: 'Chest pain, palpitations, SOB...' }
        ]
      },
      {
        id: 's2',
        title: 'Cardiac Exam',
        fields: [
          { id: 'heart_sounds', label: 'Heart Sounds', type: 'select', options: ['S1 S2 Normal', 'Murmur detected', 'Gallop', 'Rub'] },
          { id: 'edema', label: 'Edema', type: 'select', options: ['None', 'Trace', '1+', '2+', '3+'] }
        ]
      },
      {
        id: 's3',
        title: 'Plan',
        fields: [
          { id: 'med_changes', label: 'Medication Changes', type: 'textarea' },
          { id: 'tests_ordered', label: 'Tests Ordered', type: 'checkbox', options: ['ECG', 'ECHO', 'Stress Test', 'Holter'] }
        ]
      }
    ]
  },
  { 
    id: 't3', 
    name: 'Sick Note / Work Excuse', 
    description: 'Administrative note for work/school', 
    category: 'Admin',
    structure: [
      {
        id: 's1',
        title: 'Details',
        fields: [
          { id: 'excuse_date', label: 'Excused From', type: 'date' },
          { id: 'return_date', label: 'Return Date', type: 'date' },
          { id: 'restrictions', label: 'Work Restrictions', type: 'textarea' }
        ]
      }
    ]
  }
];

// Mock Data Generators

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    patient: { id: 'p1', name: 'Sarah Connor', mrn: '88421', dob: '1984-05-12', phone: '(555) 123-4567', email: 'sarah@skynet.com' },
    status: AppointmentStatus.CHECKED_IN,
    type: AppointmentType.FOLLOW_UP,
    startTime: new Date(today.setHours(9, 0)).toISOString(),
    durationMinutes: 30,
    reason: 'Post-op checkup',
    isNew: false,
    location: 'Room 302',
    provider: 'Dr. Smith',
    insuranceStatus: 'Verified'
  },
  {
    id: 'a2',
    patient: { id: 'p2', name: 'James Howlett', mrn: '99211', dob: '1970-01-01', phone: '(555) 987-6543' },
    status: AppointmentStatus.IN_PROGRESS,
    type: AppointmentType.CONSULTATION,
    startTime: new Date(today.setHours(9, 30)).toISOString(),
    durationMinutes: 45,
    reason: 'Chronic joint pain',
    isNew: true,
    scheduledAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    location: 'Room 101',
    provider: 'Dr. Smith',
    insuranceStatus: 'Pending'
  },
  {
    id: 'a3',
    patient: { id: 'p3', name: 'Diana Prince', mrn: '11234', dob: '1990-03-21', phone: '(555) 888-8888' },
    status: AppointmentStatus.SCHEDULED,
    type: AppointmentType.NEW_PATIENT,
    startTime: new Date(today.setHours(10, 30)).toISOString(),
    durationMinutes: 60,
    reason: 'Initial intake',
    isNew: true,
    scheduledAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    location: 'Room 205',
    provider: 'Dr. Smith',
    insuranceStatus: 'Verified'
  },
  {
    id: 'a4',
    patient: { id: 'p4', name: 'Wade Wilson', mrn: '55122', dob: '1988-11-02' },
    status: AppointmentStatus.SCHEDULED,
    type: AppointmentType.URGENT,
    startTime: new Date(today.setHours(13, 0)).toISOString(),
    durationMinutes: 15,
    reason: 'Skin rash',
    isNew: true,
    scheduledAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    location: 'Room 302',
    provider: 'Dr. Smith',
    insuranceStatus: 'Rejected'
  },
  {
    id: 'a5',
    patient: { id: 'p5', name: 'Tony Stark', mrn: '77711', dob: '1975-05-29' },
    status: AppointmentStatus.CANCELLED,
    type: AppointmentType.FOLLOW_UP,
    startTime: new Date(today.setHours(14, 0)).toISOString(),
    durationMinutes: 30,
    reason: 'Cardiac review',
    isNew: false,
    location: 'Room 404',
    provider: 'Dr. Smith',
    insuranceStatus: 'Verified'
  },
  {
    id: 'a6',
    patient: { id: 'p6', name: 'Steve Rogers', mrn: '19201', dob: '1920-07-04' },
    status: AppointmentStatus.SCHEDULED,
    type: AppointmentType.TELEHEALTH,
    startTime: new Date(today.setHours(15, 0)).toISOString(),
    durationMinutes: 30,
    reason: 'Mental health check',
    isNew: false,
    location: 'Telehealth',
    telehealthLink: 'https://meet.practmd.com/v/rogers-123',
    provider: 'Dr. Smith',
    insuranceStatus: 'Verified'
  },
  // Future appointments
  {
    id: 'a7',
    patient: { id: 'p3', name: 'Diana Prince', mrn: '11234', dob: '1990-03-21' },
    status: AppointmentStatus.SCHEDULED,
    type: AppointmentType.FOLLOW_UP,
    startTime: new Date(new Date().setDate(today.getDate() + 1)).toISOString(), // Tomorrow
    durationMinutes: 30,
    reason: 'Lab results review',
    location: 'Room 205',
    provider: 'Dr. Smith',
    insuranceStatus: 'Verified'
  },
  {
    id: 'a8',
    patient: { id: 'p2', name: 'James Howlett', mrn: '99211', dob: '1970-01-01' },
    status: AppointmentStatus.SCHEDULED,
    type: AppointmentType.PROCEDURE,
    startTime: new Date(new Date().setDate(today.getDate() + 2)).toISOString(), // Day after tomorrow
    durationMinutes: 90,
    reason: 'Minor surgery',
    location: 'OR 2',
    provider: 'Dr. Smith',
    insuranceStatus: 'Verified'
  }
];

export const MOCK_ALERTS: Alert[] = [
  { id: 'al1', priority: 'CRITICAL', category: 'LAB', title: 'Critical Lab Value', description: 'Potassium 6.2 - J. Doe', timestamp: new Date().toISOString() },
  { id: 'al2', priority: 'HIGH', category: 'RX', title: 'Refill Request', description: 'Pending approval for L. Lane', timestamp: new Date().toISOString() },
  { id: 'al3', priority: 'MEDIUM', category: 'ADMIN', title: 'Coding Query', description: 'Clarification needed for visit #9921', timestamp: new Date().toISOString() },
];

export const MOCK_NOTES: ClinicalNote[] = [
  { id: 'n1', patientName: 'Bruce Wayne', visitDate: '2023-10-25', type: 'Progress Note', status: 'Draft', daysPending: 2, billingImpact: 'High', author: 'Dr. Strange', authorRole: 'Provider', subject: 'Regular Checkup', content: 'Patient reports feeling well.', visibility: 'Internal', lastModified: '10 mins ago', data: {} },
  { id: 'n2', patientName: 'Clark Kent', visitDate: '2023-10-24', type: 'Consultation', status: 'Draft', daysPending: 3, billingImpact: 'Medium', author: 'Dr. House', authorRole: 'Specialist', subject: 'Knee Pain', content: 'Patient complains of knee pain.', visibility: 'Shared', lastModified: '2 hours ago', data: {} },
  { id: 'n3', patientName: 'Barry Allen', visitDate: '2023-10-20', type: 'Operative', status: 'Signed', daysPending: 0, billingImpact: 'High', author: 'Dr. McCoy', authorRole: 'Surgeon', subject: 'Appendectomy', content: 'Procedure was successful.', visibility: 'Internal', lastModified: '1 day ago', data: {} },
  { id: 'n4', patientName: 'Diana Prince', visitDate: '2023-10-28', type: 'SOAP', status: 'Pending Signature', daysPending: 1, billingImpact: 'Low', author: 'Dr. Smith', authorRole: 'Provider', subject: 'Initial Intake', content: '', visibility: 'Internal', lastModified: '5 mins ago', data: {} },
];

export const MOCK_ACTIVITY: Activity[] = [
  { id: 'ac1', type: 'DOC', description: 'Signed note for P. Parker', timestamp: '10 mins ago' },
  { id: 'ac2', type: 'RX', description: 'Prescribed Amoxicillin for M. Morales', timestamp: '30 mins ago' },
  { id: 'ac3', type: 'APPT', description: 'Completed visit with S. Rogers', timestamp: '1 hour ago' },
];

// --- E-Prescribing Mocks ---

export const MOCK_MEDICATIONS: Medication[] = [
  { id: 'm1', name: 'Lisinopril', genericName: 'Lisinopril', brandName: 'Prinivil', strength: '10mg', form: 'Tablet', schedule: null, commonSig: 'Take 1 tablet by mouth daily' },
  { id: 'm2', name: 'Amoxicillin', genericName: 'Amoxicillin', brandName: 'Amoxil', strength: '500mg', form: 'Capsule', schedule: null, commonSig: 'Take 1 capsule by mouth every 8 hours' },
  { id: 'm3', name: 'Metformin', genericName: 'Metformin', brandName: 'Glucophage', strength: '500mg', form: 'Tablet', schedule: null, commonSig: 'Take 1 tablet twice daily with meals' },
  { id: 'm4', name: 'Alprazolam', genericName: 'Alprazolam', brandName: 'Xanax', strength: '0.5mg', form: 'Tablet', schedule: 'IV', commonSig: 'Take 1 tablet by mouth every 6 hours as needed for anxiety', warnings: ['Controlled Substance', 'May cause drowsiness'] },
  { id: 'm5', name: 'Oxycodone', genericName: 'Oxycodone', brandName: 'Roxicodone', strength: '5mg', form: 'Tablet', schedule: 'II', commonSig: 'Take 1 tablet every 4-6 hours as needed for severe pain', warnings: ['High abuse potential', 'Risk of overdose'] },
  { id: 'm6', name: 'Atorvastatin', genericName: 'Atorvastatin', brandName: 'Lipitor', strength: '20mg', form: 'Tablet', schedule: null, commonSig: 'Take 1 tablet daily at bedtime' },
];

export const MOCK_PHARMACIES: Pharmacy[] = [
  { id: 'ph1', name: 'CVS Pharmacy #1234', address: '123 Main St, Springfield, IL', phone: '(555) 012-3456', type: 'Retail', isEPCSCapable: true },
  { id: 'ph2', name: 'Walgreens #5678', address: '456 Oak Ave, Springfield, IL', phone: '(555) 012-7890', type: 'Retail', isEPCSCapable: true },
  { id: 'ph3', name: 'Express Scripts', address: 'Mail Order Service', phone: '(800) 555-1212', type: 'Mail Order', isEPCSCapable: true },
];

export const MOCK_PRESCRIPTIONS: Prescription[] = [
  { id: 'rx1', patientId: 'p1', patientName: 'Sarah Connor', medication: MOCK_MEDICATIONS[0], sig: 'Take 1 tablet daily', quantity: 30, unit: 'Tablets', refills: 3, prescribedDate: '2023-10-01', status: 'Active', provider: 'Dr. Smith', pharmacyName: 'CVS Pharmacy #1234' },
  { id: 'rx2', patientId: 'p2', patientName: 'James Howlett', medication: MOCK_MEDICATIONS[4], sig: 'Take 1 tablet q4h PRN pain', quantity: 20, unit: 'Tablets', refills: 0, prescribedDate: '2023-10-25', status: 'Filled', provider: 'Dr. Smith', pharmacyName: 'Walgreens #5678' },
  { id: 'rx3', patientId: 'p3', patientName: 'Diana Prince', medication: MOCK_MEDICATIONS[1], sig: 'Take 1 capsule TID x 10 days', quantity: 30, unit: 'Capsules', refills: 0, prescribedDate: '2023-10-20', status: 'Expired', provider: 'Dr. Smith', pharmacyName: 'CVS Pharmacy #1234' },
];

export const MOCK_REFILL_REQUESTS: RefillRequest[] = [
  { id: 'rr1', prescriptionId: 'rx1', patientName: 'Sarah Connor', medicationName: 'Lisinopril 10mg', pharmacyName: 'CVS Pharmacy #1234', lastFillDate: '2023-09-01', requestedRefills: 3, status: 'Pending', receivedAt: '2 hours ago' },
  { id: 'rr2', prescriptionId: 'rx4', patientName: 'Wade Wilson', medicationName: 'Hydrocortisone 1% Cream', pharmacyName: 'Walgreens #5678', lastFillDate: '2023-08-15', requestedRefills: 1, status: 'Pending', receivedAt: '1 day ago' },
];

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'p1',
    firstName: 'Sarah',
    lastName: 'Connor',
    mrn: '88421',
    dob: '1984-05-12',
    gender: 'Female',
    email: 'sarah.connor@example.com',
    phone: '(555) 123-4567',
    registrationDate: '2023-01-15',
    type: 'Follow Up',
    status: 'Active',
    insuranceStatus: 'Verified',
    address: { street: '123 SkyNet Blvd', city: 'Los Angeles', state: 'CA', zip: '90001' },
    primaryInsurance: {
      company: 'Blue Cross',
      policyHolderName: 'Sarah Connor',
      relationship: 'Self',
      policyNumber: 'BC123456789',
      expiryDate: '2025-12-31',
      status: 'Verified'
    },
    allergies: ['Penicillin'],
    currentMedications: [MOCK_PRESCRIPTIONS[0]]
  },
  {
    id: 'p2',
    firstName: 'James',
    lastName: 'Howlett',
    preferredName: 'Logan',
    mrn: '99211',
    dob: '1970-01-01',
    gender: 'Male',
    email: 'logan@xmen.org',
    phone: '(555) 987-6543',
    registrationDate: '2023-06-20',
    type: 'New Patient',
    status: 'Active',
    insuranceStatus: 'Pending Verification',
    address: { street: '1407 Graymalkin Lane', city: 'Salem Center', state: 'NY', zip: '10560' },
    authorizations: [
      { id: 'auth1', service: 'Physical Therapy', cptCode: '97110', dateApproved: '2023-10-01', effectiveDate: '2023-10-01', expiryDate: '2023-12-31', status: 'Active' }
    ],
    allergies: [],
    currentMedications: [MOCK_PRESCRIPTIONS[1]]
  },
  {
    id: 'p3',
    firstName: 'Diana',
    lastName: 'Prince',
    mrn: '11234',
    dob: '1990-03-21',
    gender: 'Female',
    email: 'diana@themyscira.gov',
    phone: '(555) 555-5555',
    registrationDate: '2023-10-01',
    type: 'New Patient',
    status: 'Active',
    insuranceStatus: 'Verified',
    address: { street: '1 Olympus Dr', city: 'Washington', state: 'DC', zip: '20001' },
    allergies: ['Sulfa'],
    currentMedications: []
  },
  {
    id: 'p4',
    firstName: 'Wade',
    lastName: 'Wilson',
    mrn: '55122',
    dob: '1988-11-02',
    gender: 'Male',
    email: 'dp@merc.com',
    phone: '(555) 666-1337',
    registrationDate: '2022-12-05',
    type: 'Follow Up',
    status: 'Inactive',
    insuranceStatus: 'Rejected',
    address: { street: '42 Blind Al St', city: 'New York', state: 'NY', zip: '10001' },
    allergies: ['Codeine', 'Adhesive'],
    currentMedications: []
  },
  {
    id: 'p5',
    firstName: 'Tony',
    lastName: 'Stark',
    mrn: '77711',
    dob: '1975-05-29',
    gender: 'Male',
    email: 'tony@stark.com',
    phone: '(555) 123-7777',
    registrationDate: '2023-01-01',
    type: 'Follow Up',
    status: 'Active',
    insuranceStatus: 'Verified',
    address: { street: '10880 Malibu Point', city: 'Malibu', state: 'CA', zip: '90265' }
  },
  {
    id: 'p6',
    firstName: 'Steve',
    lastName: 'Rogers',
    mrn: '19201',
    dob: '1920-07-04',
    gender: 'Male',
    email: 'steve@avengers.org',
    phone: '(555) 177-6000',
    registrationDate: '2023-02-14',
    type: 'New Patient',
    status: 'Active',
    insuranceStatus: 'Verified',
    address: { street: '569 Leaman Place', city: 'Brooklyn', state: 'NY', zip: '11201' }
  }
];

export const MOCK_PLANS: TreatmentPlan[] = [
  {
    id: 'tp1',
    name: 'Post-Op Recovery',
    type: 'Treatment',
    startDate: '2023-10-20',
    providerPoC: 'Dr. Xavier',
    completionPercentage: 35,
    status: 'Active',
    stages: [
      { id: 's1', name: 'Initial Evaluation', status: 'Completed', assignee: 'Nurse Grey' },
      { id: 's2', name: 'Physical Therapy Wk 1', status: 'In Progress', assignee: 'PT Summers' },
      { id: 's3', name: 'Follow-up Visit', status: 'Pending', assignee: 'Dr. Xavier' }
    ]
  },
  {
    id: 'tp2',
    name: 'New Patient Intake',
    type: 'Intake',
    startDate: '2023-10-25',
    providerPoC: 'Dr. Grey',
    completionPercentage: 60,
    status: 'Active',
    stages: [
      { id: 's1', name: 'Registration', status: 'Completed', assignee: 'Admin' },
      { id: 's2', name: 'Insurance Verification', status: 'Completed', assignee: 'Billing Team' },
      { id: 's3', name: 'Initial Consult', status: 'Pending', assignee: 'Dr. Grey' }
    ]
  }
];

// --- Telehealth Mocks ---

export const MOCK_TELEHEALTH_SESSIONS: TelehealthSession[] = [
  { id: 'ts1', patientId: 'p6', patientName: 'Steve Rogers', scheduledTime: new Date(today.setHours(15, 0)).toISOString(), status: 'Waiting', reason: 'Mental health check', meetingLink: 'https://meet.practmd.com/v/rogers' },
  { id: 'ts2', patientId: 'p2', patientName: 'James Howlett', scheduledTime: new Date(today.setHours(16, 30)).toISOString(), status: 'Scheduled', reason: 'Wound care follow-up' },
  { id: 'ts3', patientId: 'p1', patientName: 'Sarah Connor', scheduledTime: new Date(today.setHours(13, 0)).toISOString(), status: 'Completed', duration: 25, reason: 'Medication review' },
];

export const MOCK_WAITING_ROOM: TelehealthQueueItem[] = [
  { id: 'wq1', patientName: 'Steve Rogers', arrivedAt: '10 mins ago', waitTime: '10:45', status: 'Ready' },
  { id: 'wq2', patientName: 'Natasha Romanoff', arrivedAt: '2 mins ago', waitTime: '02:15', status: 'In Check' },
];

export const MOCK_CHAT_HISTORY: ChatMessage[] = [
  { id: 'm1', sender: 'System', text: 'Patient joined the waiting room.', timestamp: '14:55' },
  { id: 'm2', sender: 'Patient', text: 'Hello Dr. Smith, I am ready.', timestamp: '14:56' },
  { id: 'm3', sender: 'Provider', text: 'Hi Steve, I will be with you in 2 minutes.', timestamp: '14:57' },
];

// --- Messaging Mocks ---

export const MOCK_MESSAGE_THREADS: MessageThread[] = [
  {
    id: 'mt1',
    subject: 'Refill Request - Lisinopril',
    patientId: 'p1',
    patientName: 'Sarah Connor',
    participants: ['Sarah Connor', 'Dr. Smith', 'MA Team'],
    status: 'Open',
    priority: 'Normal',
    category: 'Refill',
    folder: 'Inbox',
    isUnread: true,
    isFlagged: false,
    lastMessageAt: '10:30 AM',
    messages: [
      { id: 'm101', senderId: 'p1', senderName: 'Sarah Connor', senderRole: 'Patient', content: 'Hi Dr. Smith, I am running low on my Lisinopril. Can I get a refill sent to CVS?', timestamp: 'Oct 25, 10:30 AM' },
    ]
  },
  {
    id: 'mt2',
    subject: 'Lab Results - Potassium',
    patientId: 'p2',
    patientName: 'James Howlett',
    participants: ['Lab System', 'Dr. Smith'],
    status: 'Open',
    priority: 'Urgent',
    category: 'Lab',
    folder: 'Inbox',
    isUnread: true,
    isFlagged: true,
    lastMessageAt: '09:15 AM',
    messages: [
      { id: 'm201', senderId: 'sys', senderName: 'System', senderRole: 'System', content: 'CRITICAL VALUE ALERT: Potassium Level 6.2 mmol/L. Please review immediately.', timestamp: 'Oct 25, 09:15 AM' }
    ]
  },
  {
    id: 'mt3',
    subject: 'Consult Question regarding Ms. Prince',
    participants: ['Dr. House', 'Dr. Smith'],
    status: 'Open',
    priority: 'Normal',
    category: 'Clinical',
    folder: 'Team',
    isUnread: false,
    isFlagged: false,
    lastMessageAt: 'Yesterday',
    messages: [
       { id: 'm301', senderId: 'u2', senderName: 'Dr. House', senderRole: 'Provider', content: 'Can you take a look at the knee MRI for Diana Prince? I suspect a torn meniscus.', timestamp: 'Oct 24, 04:00 PM' },
       { id: 'm302', senderId: 'u1', senderName: 'Dr. Smith', senderRole: 'Provider', content: 'Sure, I will review it this afternoon.', timestamp: 'Oct 24, 04:30 PM' }
    ]
  },
  {
    id: 'mt4',
    subject: 'Appointment Reschedule',
    patientId: 'p4',
    patientName: 'Wade Wilson',
    participants: ['Wade Wilson', 'Front Desk'],
    status: 'Closed',
    priority: 'Normal',
    category: 'Appointment',
    folder: 'Archived',
    isUnread: false,
    isFlagged: false,
    lastMessageAt: 'Oct 20',
    messages: [
       { id: 'm401', senderId: 'p4', senderName: 'Wade Wilson', senderRole: 'Patient', content: 'I need to move my appointment on Tuesday.', timestamp: 'Oct 20, 09:00 AM' },
       { id: 'm402', senderId: 's1', senderName: 'Front Desk', senderRole: 'Staff', content: 'Rescheduled to next Friday at 2PM.', timestamp: 'Oct 20, 09:15 AM' }
    ]
  }
];

export const MOCK_MESSAGE_TEMPLATES: MessageTemplate[] = [
  { id: 'tpl1', trigger: '.normal_lab', label: 'Normal Lab Results', text: 'Your recent lab results are within normal range. No action is needed at this time. Continue your current medications as prescribed.' },
  { id: 'tpl2', trigger: '.refill_ok', label: 'Refill Approved', text: 'Your prescription refill request has been approved and sent to your preferred pharmacy. It should be ready for pickup within 2 hours.' },
  { id: 'tpl3', trigger: '.appt_req', label: 'Schedule Appt', text: 'Based on your symptoms, we recommend scheduling an office visit for evaluation. Please call our office at (555) 123-4567 to schedule.' },
  { id: 'tpl4', trigger: '.abnormal_lab', label: 'Abnormal Lab', text: 'We received your recent lab results and there are some findings I would like to discuss. Please schedule a brief follow-up appointment or telehealth visit.' },
];

// --- Task Mocks ---

export const MOCK_TASKS: Task[] = [
  { 
    id: 't1', 
    title: 'Review Lab Results', 
    description: 'Potassium elevated for J. Howlett', 
    patientId: 'p2',
    patientName: 'James Howlett',
    patientMrn: '99211',
    priority: 'High', 
    dueDate: new Date(today.setHours(17,0)).toISOString(), // Today
    status: 'Not Started', 
    assignedTo: 'Dr. Smith',
    category: 'Lab Review',
    createdBy: 'System',
    createdAt: new Date(today.setHours(8,0)).toISOString()
  },
  { 
    id: 't2', 
    title: 'Call Patient for Follow-up', 
    description: 'Check on wound healing post-procedure', 
    patientId: 'p1',
    patientName: 'Sarah Connor',
    patientMrn: '88421',
    priority: 'Medium', 
    dueDate: new Date(today.setHours(12,0)).toISOString(),
    status: 'In Progress', 
    assignedTo: 'MA Team',
    category: 'Patient Call',
    createdBy: 'Dr. Smith',
    createdAt: new Date(today.setHours(9,0)).toISOString()
  },
  { 
    id: 't3', 
    title: 'Sign Pending Notes', 
    description: '3 notes pending signature > 48 hours', 
    priority: 'Medium', 
    dueDate: new Date(new Date().setDate(today.getDate() + 1)).toISOString(), // Tomorrow
    status: 'Not Started', 
    assignedTo: 'Dr. Smith',
    category: 'Administrative',
    createdBy: 'System',
    createdAt: new Date(today.setHours(8,0)).toISOString()
  },
  { 
    id: 't4', 
    title: 'Prior Auth for MRI', 
    description: 'Humana requiring clinical notes for D. Prince', 
    patientId: 'p3',
    patientName: 'Diana Prince',
    patientMrn: '11234',
    priority: 'High', 
    dueDate: new Date(new Date().setDate(today.getDate() - 1)).toISOString(), // Yesterday (Overdue)
    status: 'Not Started', 
    assignedTo: 'Billing Team',
    category: 'Prior Auth',
    createdBy: 'Front Desk',
    createdAt: new Date(new Date().setDate(today.getDate() - 2)).toISOString()
  }
];

// --- Support Mocks ---

export const MOCK_TICKETS: SupportTicket[] = [
  { id: 'tk1', subject: 'Printer Configuration', category: 'IT Support', status: 'Open', priority: 'Medium', createdAt: '2023-10-25', lastUpdated: '1 hour ago' },
  { id: 'tk2', subject: 'EPCS Token Locked', category: 'Security', status: 'Resolved', priority: 'High', createdAt: '2023-10-20', lastUpdated: '2 days ago' },
  { id: 'tk3', subject: 'New User Request', category: 'Admin', status: 'In Progress', priority: 'Low', createdAt: '2023-10-24', lastUpdated: 'Yesterday' }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Lab Result', message: 'Critical value for James Howlett', time: '10m ago', read: false, type: 'error' },
  { id: 'n2', title: 'New Message', message: 'Sarah Connor sent a refill request', time: '1h ago', read: false, type: 'info' },
  { id: 'n3', title: 'System Update', message: 'Maintenance scheduled for tonight at 2AM', time: '4h ago', read: true, type: 'warning' },
];

export const CONTEXTUAL_HELP_MAP: Record<string, HelpArticle[]> = {
  '/patients': [
    { id: 'h1', title: 'Searching Patients', content: 'Use the global search bar or the patient list filters to find records by Name, MRN, or DOB.' },
    { id: 'h2', title: 'Adding New Patient', content: 'Click the "Add Patient" button to open the registration form. Ensure you have insurance details handy.' }
  ],
  '/appointments': [
    { id: 'h3', title: 'Scheduling Visits', content: 'Click on a calendar slot to book a new appointment. Drag and drop appointments to reschedule.' },
    { id: 'h4', title: 'Managing Status', content: 'Use the status dropdown to mark patients as Checked In, In Progress, or Completed.' }
  ],
  '/notes': [
    { id: 'h5', title: 'Using Templates', content: 'Select a template from the dropdown to pre-fill note sections. You can manage templates in settings.' },
    { id: 'h6', title: 'Dictation', content: 'Click the microphone icon in any text field to start voice-to-text dictation.' }
  ],
  '/prescriptions': [
    { id: 'h7', title: 'EPCS Signing', content: 'Controlled substances require 2FA. Ensure you have your token ready before signing.' }
  ]
};
