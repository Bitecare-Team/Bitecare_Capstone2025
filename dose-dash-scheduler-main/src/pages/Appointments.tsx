
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { appointments as mockAppointments } from "@/data/mockData";
import { Appointment, AppointmentStatus } from "@/types";
import { CalendarIcon, PlusCircle, Clock, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Appointments() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointments, _setAppointments] = useState<Appointment[]>(mockAppointments);
  
  // Filter appointments for selected date if available
  const appointmentsForDate = date 
    ? appointments.filter(
        (appointment) => 
          format(appointment.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
      )
    : [];
  
  // Group appointments by status
  const upcomingAppointments = appointments.filter(
    (appointment) => appointment.status === AppointmentStatus.UPCOMING
  );
  
  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === AppointmentStatus.COMPLETED
  );
  
  const cancelledAppointments = appointments.filter(
    (appointment) => 
      appointment.status === AppointmentStatus.CANCELLED || 
      appointment.status === AppointmentStatus.MISSED
  );
  
  // Function to highlight dates with appointments on the calendar
  const isDateWithAppointment = (date: Date) => {
    return appointments.some(
      (appointment) => 
        format(appointment.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Appointments</h2>
          <p className="text-muted-foreground">
            Schedule and manage vaccination appointments
          </p>
        </div>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-7">
        {/* Calendar Card */}
        <Card className="md:col-span-3 lg:col-span-2">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select a date to view appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="w-full"
              modifiers={{
                hasAppointment: (date) => isDateWithAppointment(date),
              }}
              modifiersStyles={{
                hasAppointment: {
                  fontWeight: "bold",
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  color: "#3b82f6",
                  borderRadius: "0.25rem",
                },
              }}
            />
          </CardContent>
          <CardFooter>
            <div className="flex items-center text-xs text-muted-foreground">
              <div className="w-3 h-3 rounded bg-healthcare-primary/20 mr-1"></div>
              Dates with appointments
            </div>
          </CardFooter>
        </Card>
        
        {/* Appointments for selected date */}
        <Card className="md:col-span-4 lg:col-span-5">
          <CardHeader className="flex flex-row items-center">
            <div className="flex-1">
              <CardTitle>
                {date ? format(date, "MMMM d, yyyy") : "No date selected"}
              </CardTitle>
              <CardDescription>
                {appointmentsForDate.length === 0
                  ? "No appointments scheduled"
                  : `${appointmentsForDate.length} appointment${appointmentsForDate.length === 1 ? '' : 's'} scheduled`}
              </CardDescription>
            </div>
            {date && (
              <Button size="sm" variant="outline">
                <Clock className="h-4 w-4 mr-1" />
                Manage Slots
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {appointmentsForDate.length === 0 ? (
              <div className="p-8 text-center">
                <CalendarIcon className="h-8 w-8 mx-auto text-muted-foreground" />
                <h3 className="mt-4 font-medium">No appointments for this date</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Select a different date or schedule a new appointment.
                </p>
                <Button variant="outline" className="mt-4">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Schedule for this date
                </Button>
              </div>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Dose #</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointmentsForDate.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-medium">{appointment.time}</TableCell>
                        <TableCell>{appointment.patientName}</TableCell>
                        <TableCell>{appointment.doseNumber}</TableCell>
                        <TableCell>
                          <StatusBadge status={appointment.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* All Appointments Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>All Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming">
            <TabsList className="mb-4">
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingAppointments.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedAppointments.length})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled/Missed ({cancelledAppointments.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming">
              <AppointmentList appointments={upcomingAppointments} />
            </TabsContent>
            
            <TabsContent value="completed">
              <AppointmentList appointments={completedAppointments} />
            </TabsContent>
            
            <TabsContent value="cancelled">
              <AppointmentList appointments={cancelledAppointments} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

interface AppointmentListProps {
  appointments: Appointment[];
}

function AppointmentList({ appointments }: AppointmentListProps) {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No appointments found
      </div>
    );
  }
  
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date & Time</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Dose #</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>
                <div className="font-medium">{format(appointment.date, "MMM d, yyyy")}</div>
                <div className="text-sm text-muted-foreground">{appointment.time}</div>
              </TableCell>
              <TableCell>{appointment.patientName}</TableCell>
              <TableCell>{appointment.doseNumber}</TableCell>
              <TableCell>
                <StatusBadge status={appointment.status} />
              </TableCell>
              <TableCell>
                <StatusBadge status={appointment.paymentStatus} />
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Appointment</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Record Payment</DropdownMenuItem>
                    <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      Cancel Appointment
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
