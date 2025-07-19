
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { appointmentSlots as mockSlots } from "@/data/mockData";
import { AppointmentSlot } from "@/types";
import { PlusCircle, CalendarPlus, Edit, Trash2, Clock } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function Slots() {
  const [date, setDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<AppointmentSlot[]>(mockSlots);
  
  // Filter slots for selected date
  const slotsForDate = slots.filter(
    (slot) => date && isSameDay(slot.date, date)
  );
  
  // Function to highlight dates with slots on the calendar
  const isDateWithSlot = (date: Date) => {
    return slots.some((slot) => isSameDay(slot.date, date));
  };
  
  // Calculate total capacity for the selected date
  const totalCapacity = slotsForDate.reduce(
    (sum, slot) => sum + slot.maxPatients, 0
  );
  
  // Calculate total booked appointments for the selected date
  const totalBooked = slotsForDate.reduce(
    (sum, slot) => sum + slot.bookedCount, 0
  );
  
  // Calculate percentage of capacity filled
  const percentFilled = totalCapacity > 0 ? (totalBooked / totalCapacity) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Slot Management</h2>
          <p className="text-muted-foreground">
            Configure and manage appointment slots and capacity
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Clock className="h-4 w-4 mr-2" />
            Batch Create
          </Button>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Slot
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-7">
        {/* Calendar Card */}
        <Card className="md:col-span-3 lg:col-span-2">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="w-full"
              modifiers={{
                hasSlot: (date) => isDateWithSlot(date),
              }}
              modifiersStyles={{
                hasSlot: {
                  fontWeight: "bold",
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  color: "#3b82f6",
                  borderRadius: "0.25rem",
                },
              }}
            />
            <Button variant="outline" className="w-full mt-4">
              <CalendarPlus className="h-4 w-4 mr-2" />
              Create Slots for {format(date, "MMM d")}
            </Button>
          </CardContent>
        </Card>
        
        {/* Slots for selected date */}
        <Card className="md:col-span-4 lg:col-span-5">
          <CardHeader>
            <CardTitle>
              Slots for {format(date, "MMMM d, yyyy")}
            </CardTitle>
            {slotsForDate.length > 0 && (
              <div className="mt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>
                    Capacity: {totalBooked}/{totalCapacity} slots filled
                  </span>
                  <span className="font-medium">
                    {percentFilled.toFixed(0)}%
                  </span>
                </div>
                <Progress 
                  value={percentFilled} 
                  className={cn(
                    percentFilled >= 90 ? "text-red-500" : 
                    percentFilled >= 70 ? "text-amber-500" : 
                    "text-green-500"
                  )}
                />
              </div>
            )}
          </CardHeader>
          <CardContent>
            {slotsForDate.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-10 w-10 mx-auto text-muted-foreground" />
                <h3 className="mt-4 font-medium">No slots configured</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create appointment slots for this date to allow scheduling.
                </p>
                <Button className="mt-4">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Slots
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {slotsForDate.map((slot) => {
                        const isFull = slot.bookedCount >= slot.maxPatients;
                        const percentFilled = (slot.bookedCount / slot.maxPatients) * 100;
                        
                        let statusColor = "bg-green-100 text-green-800";
                        let statusText = "Available";
                        
                        if (percentFilled >= 90) {
                          statusColor = "bg-red-100 text-red-800";
                          statusText = "Near Capacity";
                        } else if (percentFilled >= 70) {
                          statusColor = "bg-amber-100 text-amber-800";
                          statusText = "Filling Up";
                        }
                        
                        if (isFull) {
                          statusColor = "bg-muted text-muted-foreground";
                          statusText = "Full";
                        }
                        
                        return (
                          <TableRow key={slot.id}>
                            <TableCell className="font-medium">{slot.time}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm">{slot.bookedCount}/{slot.maxPatients}</span>
                                  <span className="text-xs">{percentFilled.toFixed(0)}%</span>
                                </div>
                                <Progress value={percentFilled} className="h-1.5" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={statusColor}>
                                {statusText}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                
                {/* New slot form */}
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-1 block">Time</label>
                    <Input type="time" />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-1 block">Capacity</label>
                    <Input type="number" min="1" defaultValue="10" />
                  </div>
                  <Button>Add Slot</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
