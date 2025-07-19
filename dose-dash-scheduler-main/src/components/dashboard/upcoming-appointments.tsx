
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Appointment } from "@/types";
import { appointments as mockAppointments } from "@/data/mockData";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Clock, Edit, Check, X } from "lucide-react";
import { useState } from "react";

export function UpcomingAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(
    mockAppointments.filter(
      (appointment) => 
        appointment.date > new Date() && 
        appointment.date <= new Date(new Date().setDate(new Date().getDate() + 7))
    )
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle className="text-md font-semibold">Upcoming Appointments</CardTitle>
        <Button variant="ghost" size="sm">
          View all
        </Button>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No upcoming appointments for the next 7 days
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <AppointmentItem key={appointment.id} appointment={appointment} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface AppointmentItemProps {
  appointment: Appointment;
}

function AppointmentItem({ appointment }: AppointmentItemProps) {
  return (
    <div className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
      <div className="flex flex-col space-y-1">
        <span className="font-medium">{appointment.patientName}</span>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-1 h-3 w-3" />
          <span>
            {format(appointment.date, "MMM d")} - {appointment.time}
          </span>
        </div>
        <div className="flex items-center mt-1">
          <StatusBadge status={appointment.status} />
          <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded">
            Dose #{appointment.doseNumber}
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" className="h-7 w-7">
          <Edit className="h-3.5 w-3.5" />
        </Button>
        <Button variant="secondary" size="icon" className="h-7 w-7">
          <Check className="h-3.5 w-3.5" />
        </Button>
        <Button variant="destructive" size="icon" className="h-7 w-7">
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
