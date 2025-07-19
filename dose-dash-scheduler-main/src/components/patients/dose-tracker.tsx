
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Patient } from "@/types";
import { patients as mockPatients } from "@/data/mockData";
import { CheckCircle, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function DoseTracker() {
  const [patients, _setPatients] = useState<Patient[]>(mockPatients);
  
  // Count patients by dose status
  const doseCountMap = patients.reduce((acc, patient) => {
    const dosesTaken = patient.dosesTaken;
    acc[dosesTaken] = (acc[dosesTaken] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  // Create tracking data
  const trackingData = [
    {
      doseNumber: 1,
      total: doseCountMap[0] || 0,
      label: "Awaiting 1st Dose",
      completed: patients.length - (doseCountMap[0] || 0)
    },
    {
      doseNumber: 2,
      total: doseCountMap[1] || 0,
      label: "Awaiting 2nd Dose",
      completed: patients.length - (doseCountMap[0] || 0) - (doseCountMap[1] || 0)
    },
    {
      doseNumber: 3,
      total: doseCountMap[2] || 0,
      label: "Awaiting 3rd Dose",
      completed: patients.length - (doseCountMap[0] || 0) - (doseCountMap[1] || 0) - (doseCountMap[2] || 0)
    },
    {
      doseNumber: 4,
      total: doseCountMap[3] || 0,
      label: "Awaiting 4th Dose",
      completed: patients.length - (doseCountMap[0] || 0) - (doseCountMap[1] || 0) - (doseCountMap[2] || 0) - (doseCountMap[3] || 0)
    }
  ];
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-md font-semibold">Vaccination Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {trackingData.map((item) => (
            <div 
              key={item.doseNumber}
              className="flex justify-between items-center p-2 border rounded-lg"
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-medium">
                  {item.doseNumber}
                </div>
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.total} patients pending
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center gap-1 text-sm mr-3">
                  <CheckCircle className="h-3.5 w-3.5 text-healthcare-secondary" />
                  <span>{item.completed} completed</span>
                </div>
                <Button size="sm" variant="outline" className="ml-2">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  Schedule
                </Button>
                <Button size="sm" variant="ghost" className="ml-1">
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
