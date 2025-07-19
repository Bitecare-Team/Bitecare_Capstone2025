
import { DoseTracker } from "@/components/patients/dose-tracker";
import { PatientTable } from "@/components/patients/patient-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function Patients() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Patients</h2>
          <p className="text-muted-foreground">
            Manage patient records and vaccination status
          </p>
        </div>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Register Patient
        </Button>
      </div>
      
      <DoseTracker />
      
      <PatientTable />
    </div>
  );
}
