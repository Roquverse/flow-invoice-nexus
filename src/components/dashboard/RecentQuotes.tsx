import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Quote } from "@/types/quotes";
import { useCallback, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuotes } from "@/hooks/useQuotes";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { Link } from "react-router-dom";

interface RecentQuotesProps {
  quotes: Quote[];
  loading: boolean;
}

export function RecentQuotes({ quotes, loading }: RecentQuotesProps) {
  const { getClientName } = useQuotes();

  // Get client initials from name
  const getClientInitials = useCallback(
    (clientId: string) => {
      const clientName = getClientName(clientId);
      if (!clientName || clientName === "-") return "CL";

      const parts = clientName.split(" ");
      if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase();
      }
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    },
    [getClientName]
  );

  // Get status style
  const getStatusStyles = useCallback((status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800";
      case "sent":
        return "bg-blue-100 text-blue-800";
      case "viewed":
        return "bg-violet-100 text-violet-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "expired":
        return "bg-amber-100 text-amber-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }, []);

  // Sort quotes by issue date (newest first) and take latest 5
  const recentQuotes = useMemo(() => {
    if (loading || quotes.length === 0) return [];

    return [...quotes]
      .sort(
        (a, b) =>
          new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime()
      )
      .slice(0, 5);
  }, [quotes, loading]);

  if (loading) {
    return (
      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Quotes</CardTitle>
          <Link
            to="/dashboard/quotes"
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Quotes</CardTitle>
        <Link
          to="/dashboard/quotes"
          className="text-sm text-primary hover:underline"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent>
        {recentQuotes.length > 0 ? (
          <div className="space-y-3">
            {recentQuotes.map((quote) => (
              <div
                key={quote.id}
                className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-md transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getClientInitials(quote.client_id)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {getClientName(quote.client_id)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {quote.quote_number}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-medium">
                    {formatCurrency(quote.total_amount, quote.currency)}
                  </p>
                  <Badge
                    variant="outline"
                    className={cn("capitalize", getStatusStyles(quote.status))}
                  >
                    {quote.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[200px] text-gray-500">
            No quotes available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
