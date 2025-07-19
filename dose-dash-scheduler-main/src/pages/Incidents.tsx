
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Pie, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IncidentType, IncidentSeverity } from "@/types";

// Mock incident data for charts
const incidentsByType = [
  { name: 'Bite', value: 12, color: '#ff8042' },
  { name: 'Fall', value: 8, color: '#0088fe' },
  { name: 'Medication Error', value: 5, color: '#00c49f' },
  { name: 'Equipment Failure', value: 3, color: '#ffbb28' },
  { name: 'Adverse Reaction', value: 7, color: '#ff6b6b' },
  { name: 'Other', value: 2, color: '#a4a4a4' }
];

const incidentTrend = [
  { month: 'Jan', incidents: 4 },
  { month: 'Feb', incidents: 3 },
  { month: 'Mar', incidents: 7 },
  { month: 'Apr', incidents: 5 },
  { month: 'May', incidents: 9 },
  { month: 'Jun', incidents: 6 },
  { month: 'Jul', incidents: 4 },
  { month: 'Aug', incidents: 5 },
  { month: 'Sep', incidents: 8 },
  { month: 'Oct', incidents: 3 },
  { month: 'Nov', incidents: 2 },
  { month: 'Dec', incidents: 4 }
];

const incidentsByLocation = [
  { location: 'Main Clinic', incidents: 14 },
  { location: 'Waiting Area', incidents: 8 },
  { location: 'Vaccination Room', incidents: 12 },
  { location: 'Admin Office', incidents: 3 },
  { location: 'Outside Area', incidents: 2 }
];

const incidentsByPatientGroup = [
  { age: '0-5', incidents: 8 },
  { age: '6-10', incidents: 5 },
  { age: '11-18', incidents: 3 },
  { age: '19-40', incidents: 9 },
  { age: '41-65', incidents: 7 },
  { age: '65+', incidents: 5 }
];

export default function Incidents() {
  const [timeframe, setTimeframe] = useState("monthly");
  const [incidentRate, setIncidentRate] = useState(3.2); // Mock incident rate per 1000 patients
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Incident Analytics</h1>
        <div className="flex items-center gap-2">
          <Select defaultValue={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Incident Rate</CardTitle>
            <CardDescription>Per 1,000 patients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{incidentRate}</div>
            <div className="text-sm text-muted-foreground mt-2">
              {incidentRate > 3.0 ? "↑" : "↓"} {Math.abs(incidentRate - 3.0).toFixed(1)} from previous {timeframe}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Incidents</CardTitle>
            <CardDescription>Current {timeframe}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">37</div>
            <div className="text-sm text-muted-foreground mt-2">
              ↓ 4 from previous {timeframe}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Highest Type</CardTitle>
            <CardDescription>Most common incident</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Bite</div>
            <div className="text-sm text-muted-foreground mt-2">
              32.4% of all incidents
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="types" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-4 md:grid-cols-4">
          <TabsTrigger value="types">By Type</TabsTrigger>
          <TabsTrigger value="trends">Time Trends</TabsTrigger>
          <TabsTrigger value="location">By Location</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="types">
          <Card>
            <CardHeader>
              <CardTitle>Incidents by Type</CardTitle>
              <CardDescription>
                Distribution of incidents across different categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incidentsByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {incidentsByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Bite incidents are the most common type, followed by falls and adverse reactions.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Incident Trends</CardTitle>
              <CardDescription>
                Monthly incident counts for the past year
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={incidentTrend}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="incidents" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Incidents typically increase during May and September, which correlate with higher patient volumes.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="location">
          <Card>
            <CardHeader>
              <CardTitle>Incidents by Location</CardTitle>
              <CardDescription>
                Distribution of incidents across facility areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={incidentsByLocation}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="location" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="incidents" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                The Main Clinic and Vaccination Room show the highest incident rates, suggesting focus areas for safety measures.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="demographics">
          <Card>
            <CardHeader>
              <CardTitle>Incidents by Patient Age Group</CardTitle>
              <CardDescription>
                Distribution across different age demographics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={incidentsByPatientGroup}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="incidents" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Adults (19-40) and children under 5 show highest incident rates, possibly due to anxiety and difficulty managing young children.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
