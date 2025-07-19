
export interface Patient {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address: string;
  dosesTaken: number;
  nextDoseDate?: Date;
  lastVisitDate?: Date;
  paymentStatus: PaymentStatus;
  balance: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: Date;
  time: string;
  doseNumber: number;
  status: AppointmentStatus;
  notes?: string;
  paymentAmount?: number;
  paymentStatus: PaymentStatus;
}

export interface AppointmentSlot {
  id: string;
  date: Date;
  time: string;
  available: boolean;
  maxPatients: number;
  bookedCount: number;
}

export enum AppointmentStatus {
  UPCOMING = 'upcoming',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  MISSED = 'missed'
}

export enum PaymentStatus {
  UNPAID = 'unpaid',
  PARTIAL = 'partial',
  PAID = 'paid'
}

export interface Notification {
  id: string;
  patientId: string;
  message: string;
  type: NotificationType;
  date: Date;
  read: boolean;
}

export enum NotificationType {
  APPOINTMENT_REMINDER = 'appointment_reminder',
  PAYMENT_REMINDER = 'payment_reminder',
  GENERAL = 'general'
}

export interface PaymentRecord {
  id: string;
  patientId: string;
  appointmentId?: string;
  amount: number;
  date: Date;
  method: PaymentMethod;
  notes?: string;
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  INSURANCE = 'insurance',
  OTHER = 'other'
}

// New interfaces and enums for incident tracking

export interface Incident {
  id: string;
  patientId: string;
  patientName: string;
  date: Date;
  type: IncidentType;
  severity: IncidentSeverity;
  description: string;
  location: string;
  reportedBy: string;
  status: IncidentStatus;
  actionTaken?: string;
  followUp?: string;
}

export enum IncidentType {
  BITE = 'bite',
  FALL = 'fall',
  MEDICATION_ERROR = 'medication_error',
  EQUIPMENT_FAILURE = 'equipment_failure',
  ADVERSE_REACTION = 'adverse_reaction',
  OTHER = 'other'
}

export enum IncidentSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum IncidentStatus {
  REPORTED = 'reported',
  UNDER_INVESTIGATION = 'under_investigation',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}
