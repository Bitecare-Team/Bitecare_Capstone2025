
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { appointmentSlots as mockSlots } from "@/data/mockData";
import { format } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { AppointmentSlot } from "@/types";

export function SlotsAvailability() {
  const [slots, setSlots] = useState<AppointmentSlot[]>(
    mockSlots.filter(
      (slot) => slot.date > new Date() && slot.date <= new Date(new Date().setDate(new Date().getDate() + 7))
    )
  );

  // Group slots by date
  const slotsByDate = slots.reduce((acc, slot) => {
    const dateStr = format(slot.date, "yyyy-MM-dd");
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(slot);
    return acc;
  }, {} as Record<string, AppointmentSlot[]>);

  const dates = Object.keys(slotsByDate).sort();

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle className="text-md font-semibold">Slot Availability</CardTitle>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" className="h-8 text-xs">
            <CalendarIcon className="h-3.5 w-3.5 mr-1" />
            Manage Slots
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dates.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No available slots for the next 7 days
            </div>
          ) : (
            dates.map((dateStr) => (
              <div key={dateStr} className="space-y-2">
                <h3 className="text-sm font-medium">
                  {format(new Date(dateStr), "EEEE, MMMM d")}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {slotsByDate[dateStr].map((slot) => (
                    <SlotItem key={slot.id} slot={slot} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface SlotItemProps {
  slot: AppointmentSlot;
}

function SlotItem({ slot }: SlotItemProps) {
  const isFull = slot.bookedCount >= slot.maxPatients;
  const availability = slot.maxPatients - slot.bookedCount;
  const percentFilled = (slot.bookedCount / slot.maxPatients) * 100;
  
  let statusColor = "bg-green-100 text-green-800";
  if (percentFilled >= 90) {
    statusColor = "bg-red-100 text-red-800";
  } else if (percentFilled >= 70) {
    statusColor = "bg-amber-100 text-amber-800";
  }

  return (
    <div className={`p-2 rounded-lg border ${isFull ? 'bg-muted' : 'bg-card'}`}>
      <div className="text-sm font-medium">{slot.time}</div>
      <div className="mt-1 flex items-center justify-between">
        <Badge variant="outline" className={statusColor}>
          {isFull ? "Full" : `${availability} left`}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {slot.bookedCount}/{slot.maxPatients}
        </span>
      </div>
    </div>
  );
}
