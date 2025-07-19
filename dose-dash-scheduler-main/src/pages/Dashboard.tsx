
import { StatCard } from "@/components/ui/stat-card";
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments";
import { SlotsAvailability } from "@/components/dashboard/slots-availability";
import { DoseStatusChart } from "@/components/dashboard/dose-status-chart";
import { PaymentSummary } from "@/components/dashboard/payment-summary";
import { patients, appointments, appointmentSlots, paymentRecords } from "@/data/mockData";
import { AppointmentStatus, PaymentStatus } from "@/types";
import { Users, Calendar, Ban, Clock, Syringe, CreditCard } from "lucide-react";

export default function Dashboard() {
  // Calculate statistics
  const totalPatients = patients.length;
  const totalAppointments = appointments.length;
  
  const upcomingAppointments = appointments.filter(
    appointment => appointment.status === AppointmentStatus.UPCOMING
  ).length;
  
  const missedAppointments = appointments.filter(
    appointment => appointment.status === AppointmentStatus.MISSED
  ).length;
  
  const availableSlots = appointmentSlots.reduce(
    (total, slot) => total + (slot.maxPatients - slot.bookedCount), 0
  );
  
  const totalUnpaid = patients.filter(
    patient => patient.paymentStatus === PaymentStatus.UNPAID
  ).length;
  
  const totalCollected = paymentRecords.reduce(
    (sum, record) => sum + record.amount, 0
  );

  const doseCounts = patients.reduce((acc, patient) => {
    const count = patient.dosesTaken;
    acc[count] = (acc[count] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your vaccination program and patient management
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Patients"
          value={totalPatients}
          icon={<Users className="h-4 w-4" />}
          description="Registered in the system"
          trend="up"
          trendValue="+12% from last month"
        />
        <StatCard
          title="Appointments"
          value={upcomingAppointments}
          icon={<Calendar className="h-4 w-4" />}
          description="Scheduled for this week"
          trend="neutral"
          trendValue="Same as last week"
        />
        <StatCard
          title="Missed Appointments"
          value={missedAppointments}
          icon={<Ban className="h-4 w-4" />}
          description="In the last 30 days"
          trend="down"
          trendValue="-5% from last month"
        />
        <StatCard
          title="Available Slots"
          value={availableSlots}
          icon={<Clock className="h-4 w-4" />}
          description="In the next 7 days"
          trend="up"
          trendValue="+8 slots added"
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="md:col-span-4">
          <UpcomingAppointments />
        </div>
        <div className="md:col-span-3">
          <SlotsAvailability />
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="md:col-span-3">
          <DoseStatusChart />
        </div>
        <div className="md:col-span-4">
          <PaymentSummary />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Awaiting 1st Dose"
          value={doseCounts[0] || 0}
          icon={<Syringe className="h-4 w-4" />}
          description="Patients to schedule"
        />
        <StatCard
          title="Awaiting 2nd Dose"
          value={doseCounts[1] || 0}
          icon={<Syringe className="h-4 w-4" />}
          description="Due for follow-up"
        />
        <StatCard
          title="Awaiting 3rd Dose"
          value={doseCounts[2] || 0}
          icon={<Syringe className="h-4 w-4" />}
          description="Due for booster"
        />
        <StatCard
          title="Unpaid Balance"
          value={totalUnpaid}
          icon={<CreditCard className="h-4 w-4" />}
          description="Patients with outstanding payments"
          trend="down"
          trendValue="-3 from last week"
        />
      </div>
    </div>
  );
}
