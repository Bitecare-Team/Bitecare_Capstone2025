
import { Patient, Appointment, AppointmentSlot, AppointmentStatus, PaymentStatus, Notification, NotificationType, PaymentRecord, PaymentMethod } from '../types';

// Helper to create a date N days from today
const daysFromNow = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

// Mock patients data
export const patients: Patient[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    address: '123 Main St, City',
    dosesTaken: 2,
    nextDoseDate: daysFromNow(30),
    lastVisitDate: daysFromNow(-60),
    paymentStatus: PaymentStatus.PAID,
    balance: 0,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '098-765-4321',
    address: '456 Elm St, Town',
    dosesTaken: 1,
    nextDoseDate: daysFromNow(5),
    lastVisitDate: daysFromNow(-25),
    paymentStatus: PaymentStatus.PARTIAL,
    balance: 500,
  },
  {
    id: '3',
    name: 'Robert Johnson',
    phone: '555-123-4567',
    address: '789 Oak St, Village',
    dosesTaken: 0,
    nextDoseDate: daysFromNow(2),
    paymentStatus: PaymentStatus.UNPAID,
    balance: 1000,
  },
  {
    id: '4',
    name: 'Maria Garcia',
    email: 'maria@example.com',
    phone: '555-987-6543',
    address: '101 Pine St, Hamlet',
    dosesTaken: 3,
    lastVisitDate: daysFromNow(-90),
    paymentStatus: PaymentStatus.PAID,
    balance: 0,
  },
  {
    id: '5',
    name: 'David Kim',
    phone: '444-333-2222',
    address: '202 Cedar St, Borough',
    dosesTaken: 2,
    nextDoseDate: daysFromNow(15),
    lastVisitDate: daysFromNow(-45),
    paymentStatus: PaymentStatus.PARTIAL,
    balance: 250,
  },
];

// Mock appointments data
export const appointments: Appointment[] = [
  {
    id: '101',
    patientId: '1',
    patientName: 'John Doe',
    date: daysFromNow(30),
    time: '10:00 AM',
    doseNumber: 3,
    status: AppointmentStatus.UPCOMING,
    paymentStatus: PaymentStatus.UNPAID,
  },
  {
    id: '102',
    patientId: '2',
    patientName: 'Jane Smith',
    date: daysFromNow(5),
    time: '11:30 AM',
    doseNumber: 2,
    status: AppointmentStatus.UPCOMING,
    paymentStatus: PaymentStatus.PARTIAL,
    paymentAmount: 500,
  },
  {
    id: '103',
    patientId: '3',
    patientName: 'Robert Johnson',
    date: daysFromNow(2),
    time: '9:15 AM',
    doseNumber: 1,
    status: AppointmentStatus.UPCOMING,
    paymentStatus: PaymentStatus.UNPAID,
  },
  {
    id: '104',
    patientId: '4',
    patientName: 'Maria Garcia',
    date: daysFromNow(-90),
    time: '2:00 PM',
    doseNumber: 3,
    status: AppointmentStatus.COMPLETED,
    paymentStatus: PaymentStatus.PAID,
    paymentAmount: 1000,
  },
  {
    id: '105',
    patientId: '5',
    patientName: 'David Kim',
    date: daysFromNow(15),
    time: '3:45 PM',
    doseNumber: 3,
    status: AppointmentStatus.UPCOMING,
    paymentStatus: PaymentStatus.PARTIAL,
    paymentAmount: 750,
  },
];

// Mock appointment slots
export const appointmentSlots: AppointmentSlot[] = [
  {
    id: '201',
    date: daysFromNow(1),
    time: '9:00 AM',
    available: true,
    maxPatients: 10,
    bookedCount: 2,
  },
  {
    id: '202',
    date: daysFromNow(1),
    time: '10:00 AM',
    available: true,
    maxPatients: 10,
    bookedCount: 5,
  },
  {
    id: '203',
    date: daysFromNow(1),
    time: '11:00 AM',
    available: true,
    maxPatients: 10,
    bookedCount: 9,
  },
  {
    id: '204',
    date: daysFromNow(1),
    time: '1:00 PM',
    available: true,
    maxPatients: 10,
    bookedCount: 10,
  },
  {
    id: '205',
    date: daysFromNow(2),
    time: '9:00 AM',
    available: true,
    maxPatients: 10,
    bookedCount: 3,
  },
  {
    id: '206',
    date: daysFromNow(2),
    time: '10:00 AM',
    available: true,
    maxPatients: 10,
    bookedCount: 7,
  },
  {
    id: '207',
    date: daysFromNow(2),
    time: '11:00 AM',
    available: true,
    maxPatients: 10,
    bookedCount: 2,
  },
  {
    id: '208',
    date: daysFromNow(2),
    time: '1:00 PM',
    available: true,
    maxPatients: 10,
    bookedCount: 4,
  },
  {
    id: '209',
    date: daysFromNow(3),
    time: '9:00 AM',
    available: true,
    maxPatients: 10,
    bookedCount: 1,
  },
];

// Mock notifications
export const notifications: Notification[] = [
  {
    id: '301',
    patientId: '1',
    message: 'Your next appointment is scheduled for tomorrow at 10:00 AM.',
    type: NotificationType.APPOINTMENT_REMINDER,
    date: daysFromNow(-1),
    read: true,
  },
  {
    id: '302',
    patientId: '2',
    message: 'Please complete your payment before your next appointment.',
    type: NotificationType.PAYMENT_REMINDER,
    date: new Date(),
    read: false,
  },
  {
    id: '303',
    patientId: '3',
    message: 'Your first vaccination dose is scheduled for this week.',
    type: NotificationType.APPOINTMENT_REMINDER,
    date: new Date(),
    read: false,
  },
];

// Mock payment records
export const paymentRecords: PaymentRecord[] = [
  {
    id: '401',
    patientId: '1',
    appointmentId: '101',
    amount: 1000,
    date: daysFromNow(-60),
    method: PaymentMethod.CASH,
  },
  {
    id: '402',
    patientId: '2',
    appointmentId: '102',
    amount: 500,
    date: daysFromNow(-25),
    method: PaymentMethod.CARD,
    notes: 'Partial payment',
  },
  {
    id: '403',
    patientId: '4',
    appointmentId: '104',
    amount: 1000,
    date: daysFromNow(-90),
    method: PaymentMethod.INSURANCE,
  },
  {
    id: '404',
    patientId: '5',
    appointmentId: '105',
    amount: 750,
    date: daysFromNow(-45),
    method: PaymentMethod.CASH,
    notes: 'Partial payment',
  },
];
