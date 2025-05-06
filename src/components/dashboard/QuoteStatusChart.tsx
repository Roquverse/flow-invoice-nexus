import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  Legend,
  Tooltip,
} from "recharts";
import { Quote } from "@/types/quotes";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface QuoteStatusChartProps {
  quotes: Quote[];
  loading: boolean;
}

export function QuoteStatusChart({ quotes, loading }: QuoteStatusChartProps) {
  const data = useMemo(() => {
    if (loading || quotes.length === 0) return [];

    // Count quotes by status
    const statusCounts = {
      draft: 0,
      sent: 0,
      viewed: 0,
      accepted: 0,
      rejected: 0,
      expired: 0,
    };

    quotes.forEach((quote) => {
      if (
        statusCounts[quote.status as keyof typeof statusCounts] !== undefined
      ) {
        statusCounts[quote.status as keyof typeof statusCounts]++;
      }
    });

    // Get color for status
    const getColor = (status: string) => {
      switch (status) {
        case "accepted":
          return "#10B981"; // green
        case "sent":
          return "#3B82F6"; // blue
        case "viewed":
          return "#8B5CF6"; // purple
        case "rejected":
          return "#EF4444"; // red
        case "expired":
          return "#F59E0B"; // amber
        case "draft":
          return "#9CA3AF"; // gray
        default:
          return "#D1D5DB"; // light gray
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
  }, [quotes, loading]);

  if (loading) {
    return (
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Quote Status</CardTitle>
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
        <CardTitle>Quote Status Distribution</CardTitle>
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
              <Tooltip formatter={(value) => [`${value} quotes`, ""]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[250px] text-gray-500">
            No quote data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
