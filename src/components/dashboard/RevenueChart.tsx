
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: 'Jan', amount: 5000 },
  { month: 'Feb', amount: 7800 },
  { month: 'Mar', amount: 5500 },
  { month: 'Apr', amount: 8900 },
  { month: 'May', amount: 11500 },
  { month: 'Jun', amount: 9800 },
  { month: 'Jul', amount: 13200 },
];

export function RevenueChart() {
  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              formatter={(value) => [`$${value}`, 'Revenue']}
              labelStyle={{ color: '#333' }}
              contentStyle={{ 
                backgroundColor: 'white', 
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: 'none'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#8B5CF6" 
              strokeWidth={3}
              dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#8B5CF6', stroke: 'white', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
