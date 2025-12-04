
export enum AppointmentStatus {
  SCHEDULED = 'Scheduled',
  CHECKED_IN = 'Checked In',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  NO_SHOW = 'No Show',
  RESCHEDULED = 'Rescheduled'
}

export enum AppointmentType {
  NEW_PATIENT = 'New Patient',
  FOLLOW_UP = 'Follow-up',
  CONSULTATION = 'Consultation',
  PROCEDURE = 'Procedure',
  URGENT = 'Urgent',
  TELEHEALTH = 'Telehealth'
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  preferredName?: string;
  mrn: string; // Medical Record Number
  dob: string;
  gender: string;
  pronouns?: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
  };
  registrationDate: string;
  type: 'New Patient' | 'Follow Up';
  status: 'Active' | 'Inactive';
  insuranceStatus: 'Verified' | 'Pending Verification' | 'Expired' | 'Rejected';
  primaryInsurance?: InsurancePolicy;
  secondaryInsurance?: InsurancePolicy;
  authorizations?: Authorization[];
  photoUrl?: string; // Mock photo
  allergies?: string[]; // Added for e-prescribing
  currentMedications?: Prescription[]; // Added for e-prescribing
}

export interface InsurancePolicy {
  company: string;
  policyHolderName: string;
  relationship: 'Self' | 'Spouse' | 'Parent' | 'Other';
  policyNumber: string;
  expiryDate: string;
  status: 'Verified' | 'Pending Verification' | 'Expired' | 'Rejected';
}

export interface Authorization {
  id: string;
  service: string;
  cptCode: string;
  dateApproved: string;
  effectiveDate: string;
  expiryDate: string;
  status: 'Active' | 'Expired' | 'Denied' | 'Pending';
}

export interface TreatmentPlan {
  id: string;
  name: string;
  type: 'Intake' | 'Treatment';
  startDate: string;
  providerPoC: string;
  completionPercentage: number;
  status: 'Pending Approval' | 'Active' | 'Cancelled' | 'Completed';
  stages: {
    id: string;
    name: string;
    status: 'Pending' | 'In Progress' | 'Completed';
    assignee?: string;
  }[];
}

// --- Clinical Note Types (Updated for Dynamic Templates) ---

export type NoteStatus = 'Draft' | 'Pending Signature' | 'Signed' | 'Amended';
export type FieldType = 'text' | 'textarea' | 'select' | 'checkbox' | 'date' | 'number' | 'radio';

export interface TemplateField {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[]; // For select/radio
  placeholder?: string;
  defaultValue?: any;
}

export interface TemplateSection {
  id: string;
  title: string;
  fields: TemplateField[];
}

export interface NoteTemplate {
  id: string;
  name: string;
  description: string;
  category: 'General' | 'Specialty' | 'Procedure' | 'Admin';
  structure: TemplateSection[];
}

export interface ClinicalNote {
  id: string;
  patientId?: string;
  patientName: string;
  visitDate: string;
  createdDate?: string;
  lastModified?: string;
  author: string;
  authorRole: string;
  type: string; 
  templateId?: string;
  status: NoteStatus;
  subject: string;
  content: string; // Plain text summary
  data: Record<string, any>; // Stores the dynamic values: { fieldId: value }
  visibility: 'Internal' | 'Shared';
  daysPending: number;
  billingImpact: string;
  billingCode?: string; 
}

export interface PracticeInfo {
  name: string;
  address: string;
  phone: string;
  logoUrl?: string;
}

export interface Appointment {
  id: string;
  patient: { 
    id: string; 
    name: string; 
    mrn: string; 
    dob: string; 
    photoUrl?: string; 
    phone?: string;
    email?: string;
  }; 
  status: AppointmentStatus;
  type: AppointmentType;
  startTime: string; // ISO string
  durationMinutes: number;
  reason?: string;
  isNew?: boolean; // Highlight newly scheduled
  scheduledAt?: string; // When it was booked
  location: string;
  telehealthLink?: string;
  provider: string;
  notes?: string;
  insuranceStatus?: 'Verified' | 'Pending' | 'Expired' | 'Rejected';
}

// --- E-Prescribing Types ---

export interface Medication {
  id: string;
  name: string;
  genericName: string;
  brandName?: string;
  strength: string;
  form: string; // Tablet, Capsule, Liquid
  schedule: 'II' | 'III' | 'IV' | 'V' | null; // Controlled substance schedule
  commonSig?: string;
  warnings?: string[];
  contraindications?: string[];
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  fax?: string;
  type: 'Retail' | 'Mail Order';
  isEPCSCapable: boolean;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  medication: Medication;
  sig: string; // Directions
  quantity: number;
  unit: string;
  refills: number;
  pharmacyId?: string;
  pharmacyName?: string;
  prescribedDate: string;
  status: 'Active' | 'Sent' | 'Filled' | 'Cancelled' | 'Expired' | 'Discontinued';
  provider: string;
  notes?: string;
}

export interface RefillRequest {
  id: string;
  prescriptionId: string;
  patientName: string;
  medicationName: string;
  pharmacyName: string;
  lastFillDate: string;
  requestedRefills: number;
  status: 'Pending' | 'Approved' | 'Denied';
  receivedAt: string;
}

// --- Telehealth Types ---

export interface TelehealthSession {
  id: string;
  patientId: string;
  patientName: string;
  scheduledTime: string;
  status: 'Scheduled' | 'Waiting' | 'In Progress' | 'Completed' | 'Cancelled';
  duration?: number;
  reason: string;
  meetingLink?: string;
}

export interface TelehealthQueueItem {
  id: string;
  patientName: string;
  arrivedAt: string;
  waitTime: string; // Formatted string for UI
  status: 'Ready' | 'Tech Check Failed' | 'In Check' | 'In Call';
  photoUrl?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'Provider' | 'Patient' | 'System';
  text: string;
  timestamp: string;
}

// --- Messaging Types ---

export type MessageFolder = 'Inbox' | 'Sent' | 'Archived' | 'Team' | 'Flagged' | 'Unread';

export interface MessageAttachment {
  id: string;
  name: string;
  type: string;
  size: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'Provider' | 'Patient' | 'System' | 'Staff';
  content: string;
  timestamp: string;
  attachments?: MessageAttachment[];
}

export interface MessageThread {
  id: string;
  subject: string;
  patientId?: string;
  patientName?: string;
  participants: string[]; // Names
  status: 'Open' | 'Closed';
  priority: 'Normal' | 'Urgent';
  category: 'General' | 'Refill' | 'Appointment' | 'Lab' | 'Billing' | 'System' | 'Clinical';
  folder: MessageFolder; // Primary folder location
  isUnread: boolean;
  isFlagged: boolean;
  lastMessageAt: string;
  messages: Message[];
}

export interface MessageTemplate {
  id: string;
  trigger: string;
  label: string;
  text: string;
}

// --- Task Types ---

export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Cancelled';

export interface TaskComment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  patientId?: string;
  patientName?: string;
  patientMrn?: string;
  priority: TaskPriority;
  dueDate: string; // ISO String
  status: TaskStatus;
  assignedTo: string; // Name or Role e.g., "Dr. Smith" or "MA Team"
  category: string;
  createdBy: string;
  createdAt: string;
  comments?: TaskComment[];
}

// --- Dashboard Types ---

export interface Alert {
  id: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  timestamp: string;
  category: 'LAB' | 'MSG' | 'RX' | 'ADMIN' | 'SYS';
}

export interface Activity {
  id: string;
  type: 'APPT' | 'DOC' | 'RX' | 'LAB' | 'MSG';
  description: string;
  timestamp: string;
  category?: string;
}

// Dashboard Config Types
export enum WidgetType {
  UPCOMING_APPTS = 'UPCOMING_APPTS',
  NEW_APPTS = 'NEW_APPTS',
  TODAY_SCHEDULE = 'TODAY_SCHEDULE',
  ALERT_PANEL = 'ALERT_PANEL',
  PATIENT_COMP_CHART = 'PATIENT_COMP_CHART',
  PENDING_NOTES = 'PENDING_NOTES',
  APPT_STATUS_CHART = 'APPT_STATUS_CHART',
  RECENT_ACTIVITY = 'RECENT_ACTIVITY'
}

export type WidgetSize = 'sm' | 'md' | 'lg' | 'full'; // maps to col-span

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  colSpan: 1 | 2 | 3 | 4; // Based on a 4-column grid
  isVisible: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  dashboardLayout: WidgetConfig[];
}

// --- Support & Notification Types ---

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  createdAt: string;
  lastUpdated: string;
}

export interface HelpArticle {
  id: string;
  title: string;
  content: string;
  relatedLinks?: { label: string; url: string }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}
