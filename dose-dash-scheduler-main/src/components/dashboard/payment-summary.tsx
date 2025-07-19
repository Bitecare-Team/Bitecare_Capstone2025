
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { paymentRecords as mockPaymentRecords } from "@/data/mockData";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

export function PaymentSummary() {
  // Get the last 6 months for the chart
  const months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), i);
    return {
      date,
      month: format(date, "MMM"),
      year: format(date, "yyyy"),
    };
  }).reverse();

  // Calculate total payments for each month
  const data = months.map(({ date, month, year }) => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);

    const paymentsInMonth = mockPaymentRecords.filter((payment) =>
      isWithinInterval(payment.date, { start: monthStart, end: monthEnd })
    );

    const total = paymentsInMonth.reduce((sum, payment) => sum + payment.amount, 0);

    return {
      name: month,
      total,
      tooltipContent: `${month} ${year}: ₱${total.toLocaleString()}`,
    };
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-md font-semibold">Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `₱${value}`}
              />
              <Tooltip 
                formatter={(value: number) => [`₱${value.toLocaleString()}`, 'Total']}
                labelFormatter={(label) => `${label}`}
              />
              <Bar 
                dataKey="total" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium">Total Collected</div>
            <div className="text-2xl font-bold">
              ₱{mockPaymentRecords.reduce((sum, payment) => sum + payment.amount, 0).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium">Average per Month</div>
            <div className="text-2xl font-bold">
              ₱{Math.round(
                mockPaymentRecords.reduce((sum, payment) => sum + payment.amount, 0) / 6
              ).toLocaleString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
