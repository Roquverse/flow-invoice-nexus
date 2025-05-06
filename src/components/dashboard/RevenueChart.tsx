import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Invoice } from "@/types/invoices";
import { Receipt } from "@/types/receipts";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface RevenueChartProps {
  invoices: Invoice[];
  receipts: Receipt[];
  loading: boolean;
}

export function RevenueChart({
  invoices,
  receipts,
  loading,
}: RevenueChartProps) {
  const data = useMemo(() => {
    if (loading) return [];

    // Get current year
    const currentYear = new Date().getFullYear();

    // Create month map for the current year
    const months = [
      { month: "Jan", amount: 0, index: 0 },
      { month: "Feb", amount: 0, index: 1 },
      { month: "Mar", amount: 0, index: 2 },
      { month: "Apr", amount: 0, index: 3 },
      { month: "May", amount: 0, index: 4 },
      { month: "Jun", amount: 0, index: 5 },
      { month: "Jul", amount: 0, index: 6 },
      { month: "Aug", amount: 0, index: 7 },
      { month: "Sep", amount: 0, index: 8 },
      { month: "Oct", amount: 0, index: 9 },
      { month: "Nov", amount: 0, index: 10 },
      { month: "Dec", amount: 0, index: 11 },
    ];

    // Aggregate receipt amounts by month
    receipts.forEach((receipt) => {
      const receiptDate = new Date(receipt.date);

      // Only include receipts from current year
      if (receiptDate.getFullYear() === currentYear) {
        const monthIndex = receiptDate.getMonth();
        months[monthIndex].amount += receipt.amount;
      }
    });

    // Return only months up to current month
    const currentMonth = new Date().getMonth();
    return months.slice(0, currentMonth + 1);
  }, [invoices, receipts, loading]);

  if (loading) {
    return (
      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-[300px]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data}
              margin={{ left: 10, right: 10, top: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${value}`}
                width={60}
                style={{ fontSize: "12px" }}
              />
              <Tooltip
                formatter={(value) => [`$${value}`, "Revenue"]}
                labelStyle={{ color: "#333" }}
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  border: "none",
                }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                activeDot={{
                  r: 6,
                  fill: "#8B5CF6",
                  stroke: "white",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[250px] text-gray-500">
            No revenue data available for this year
          </div>
        )}
      </CardContent>
    </Card>
  );
}
