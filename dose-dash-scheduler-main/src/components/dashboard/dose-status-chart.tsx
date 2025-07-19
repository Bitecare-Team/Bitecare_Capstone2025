
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { patients as mockPatients } from "@/data/mockData";

interface DoseData {
  name: string;
  value: number;
  color: string;
}

export function DoseStatusChart() {
  // Count patients by doses taken
  const doseCountMap = mockPatients.reduce((acc, patient) => {
    const dosesTaken = patient.dosesTaken;
    acc[dosesTaken] = (acc[dosesTaken] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Prepare data for the chart
  const data: DoseData[] = [
    {
      name: "0 doses",
      value: doseCountMap[0] || 0,
      color: "#3b82f6", // healthcare-primary
    },
    {
      name: "1 dose",
      value: doseCountMap[1] || 0,
      color: "#60a5fa", // healthcare-accent
    },
    {
      name: "2 doses",
      value: doseCountMap[2] || 0,
      color: "#10b981", // healthcare-secondary
    },
    {
      name: "3 doses",
      value: doseCountMap[3] || 0, 
      color: "#3f3f46", // zinc-700
    },
    {
      name: "4 doses",
      value: doseCountMap[4] || 0,
      color: "#f59e0b", // healthcare-warning
    },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-md font-semibold">Vaccination Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {data.map((entry, index) => (
            <div key={`legend-${index}`} className="flex items-center">
              <div
                className="h-3 w-3 rounded-full mr-2"
                style={{ backgroundColor: entry.color }}
              />
              <div className="text-xs">
                <div>{entry.name}</div>
                <div className="font-medium">{entry.value} patients</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return percent > 0.05 ? (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null;
};
