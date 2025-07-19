
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Patient, PaymentStatus } from "@/types";
import { patients as mockPatients } from "@/data/mockData";
import { Search, Plus, Filter, MoreHorizontal, FileEdit } from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function PatientTable() {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter patients based on search query
  const filteredPatients = patients.filter((patient) => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (patient.email && patient.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            className="pl-8 pr-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Patient
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Doses Taken</TableHead>
              <TableHead>Next Dose</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  {searchQuery 
                    ? "No patients found matching your search" 
                    : "No patients available"}
                </TableCell>
              </TableRow>
            ) : (
              filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{patient.phone}</span>
                      {patient.email && (
                        <span className="text-xs text-muted-foreground">{patient.email}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-medium">
                      {patient.dosesTaken}
                    </span>
                  </TableCell>
                  <TableCell>
                    {patient.nextDoseDate 
                      ? format(patient.nextDoseDate, "MMM d, yyyy")
                      : patient.dosesTaken >= 4 
                        ? "Completed"
                        : "Not scheduled"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={patient.paymentStatus} />
                    {patient.paymentStatus !== PaymentStatus.PAID && (
                      <div className="text-xs font-medium mt-1">
                        ₱{patient.balance.toLocaleString()}
                      </div>
                    )}
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
                        <DropdownMenuItem>
                          <FileEdit className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Plus className="h-4 w-4 mr-2" />
                          Schedule Appointment
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          Edit Patient
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Delete Patient
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
