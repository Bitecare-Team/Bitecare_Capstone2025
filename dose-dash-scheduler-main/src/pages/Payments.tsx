
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { StatusBadge } from "@/components/ui/status-badge";
import { paymentRecords as mockPayments } from "@/data/mockData";
import { patients as mockPatients } from "@/data/mockData";
import { PaymentRecord, PaymentStatus, PaymentMethod, Patient } from "@/types";
import { 
  Search, 
  Filter, 
  Plus, 
  ArrowDownUp,
  FileText,
  Download,
  CreditCard
} from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Payments() {
  const [payments, _setPayments] = useState<PaymentRecord[]>(mockPayments);
  const [patientsWithBalance, _setPatientsWithBalance] = useState<Patient[]>(
    mockPatients.filter(patient => patient.paymentStatus !== PaymentStatus.PAID)
  );
  const [searchQuery, setSearchQuery] = useState("");
  
  // Calculate total payments and balance
  const totalCollected = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalBalance = patientsWithBalance.reduce((sum, patient) => sum + patient.balance, 0);
  
  // Get patient name by ID
  const getPatientName = (patientId: string): string => {
    const patient = mockPatients.find(p => p.id === patientId);
    return patient ? patient.name : "Unknown Patient";
  };
  
  // Filter payments based on search query
  const filteredPayments = payments.filter((payment) => {
    const patientName = getPatientName(payment.patientId).toLowerCase();
    return patientName.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
          <p className="text-muted-foreground">
            Track and manage patient payments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Record Payment
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-healthcare-primary/10 to-healthcare-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₱{totalCollected.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground mt-1">
              From {payments.length} payments
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-healthcare-critical/10 to-healthcare-critical/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Outstanding Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₱{totalBalance.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground mt-1">
              From {patientsWithBalance.length} patients
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Outstanding balances */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Outstanding Balances</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patientsWithBalance.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      No outstanding balances
                    </TableCell>
                  </TableRow>
                ) : (
                  patientsWithBalance.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell>
                        <StatusBadge status={patient.paymentStatus} />
                      </TableCell>
                      <TableCell className="font-medium">
                        ₱{patient.balance.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm">
                          <CreditCard className="h-3.5 w-3.5 mr-1" />
                          Collect Payment
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Payment history */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient name..."
                className="pl-8 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <ArrowDownUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      {searchQuery 
                        ? "No payments found matching your search" 
                        : "No payment records available"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {format(payment.date, "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="font-medium">
                        {getPatientName(payment.patientId)}
                      </TableCell>
                      <TableCell className="font-medium">
                        ₱{payment.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {payment.method.toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {payment.notes || "-"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
