
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, ResponsiveContainer, Cell, Legend, Tooltip } from "recharts";

const data = [
  { name: 'Paid', value: 63, color: '#10B981' },
  { name: 'Pending', value: 25, color: '#F59E0B' },
  { name: 'Overdue', value: 12, color: '#EF4444' },
];

export function InvoiceStatusChart() {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Invoice Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={3}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
