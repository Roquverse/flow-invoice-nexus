import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  Legend,
  Tooltip,
} from "recharts";
import { Invoice } from "@/types/invoices";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface InvoiceStatusChartProps {
  invoices: Invoice[];
  loading: boolean;
}

export function InvoiceStatusChart({
  invoices,
  loading,
}: InvoiceStatusChartProps) {
  const data = useMemo(() => {
    if (loading || invoices.length === 0) return [];

    // Count invoices by status
    const statusCounts = {
      paid: 0,
      sent: 0,
      viewed: 0,
      overdue: 0,
      draft: 0,
      cancelled: 0,
    };

    invoices.forEach((invoice) => {
      if (
        statusCounts[invoice.status as keyof typeof statusCounts] !== undefined
      ) {
        statusCounts[invoice.status as keyof typeof statusCounts]++;
      }
    });

    // Get color for status
    const getColor = (status: string) => {
      switch (status) {
        case "paid":
          return "#10B981";
        case "sent":
          return "#3B82F6";
        case "viewed":
          return "#8B5CF6";
        case "overdue":
          return "#EF4444";
        case "draft":
          return "#9CA3AF";
        case "cancelled":
          return "#6B7280";
        default:
          return "#D1D5DB";
      }
    };

    // Create chart data (only include statuses with values)
    return Object.entries(statusCounts)
      .filter(([_, count]) => count > 0)
      .map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count,
        color: getColor(status),
      }));
  }, [invoices, loading]);

  if (loading) {
    return (
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Invoice Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-[250px]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Invoice Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
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
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} invoices`, ""]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[250px] text-gray-500">
            No invoice data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
