
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface InvoiceProps {
  id: string;
  client: {
    name: string;
    initials: string;
  };
  amount: string;
  date: string;
  status: "paid" | "pending" | "overdue";
}

const invoices: InvoiceProps[] = [
  {
    id: "INV-0012",
    client: {
      name: "Acme Inc",
      initials: "AI"
    },
    amount: "$1,250.00",
    date: "Apr 15, 2025",
    status: "paid"
  },
  {
    id: "INV-0011",
    client: {
      name: "Globex Corp",
      initials: "GC"
    },
    amount: "$3,500.00",
    date: "Apr 12, 2025",
    status: "pending"
  },
  {
    id: "INV-0010",
    client: {
      name: "Stark Industries",
      initials: "SI"
    },
    amount: "$2,750.00",
    date: "Apr 10, 2025",
    status: "overdue"
  },
  {
    id: "INV-0009",
    client: {
      name: "Wayne Enterprises",
      initials: "WE"
    },
    amount: "$1,800.00",
    date: "Apr 08, 2025",
    status: "paid"
  }
];

const getStatusStyles = (status: "paid" | "pending" | "overdue") => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-amber-100 text-amber-800";
    case "overdue":
      return "bg-red-100 text-red-800";
    default:
      return "";
  }
};

export function RecentInvoices() {
  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Invoices</CardTitle>
        <a 
          href="/dashboard/invoices" 
          className="text-sm text-primary hover:underline"
        >
          View all
        </a>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {invoices.map((invoice) => (
            <div 
              key={invoice.id}
              className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-md transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {invoice.client.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{invoice.client.name}</p>
                  <p className="text-sm text-muted-foreground">{invoice.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-medium">{invoice.amount}</p>
                <Badge variant="outline" className={cn("capitalize", getStatusStyles(invoice.status))}>
                  {invoice.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
