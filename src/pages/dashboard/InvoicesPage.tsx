
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  FileText, 
  MoreHorizontal, 
  Plus, 
  Printer, 
  Search, 
  SlidersHorizontal 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Invoice {
  id: string;
  client: string;
  amount: string;
  issueDate: string;
  dueDate: string;
  status: "paid" | "pending" | "overdue" | "draft";
}

const mockInvoices: Invoice[] = [
  {
    id: "INV-0001",
    client: "Acme Inc",
    amount: "$1,250.00",
    issueDate: "Apr 01, 2025",
    dueDate: "Apr 15, 2025",
    status: "paid"
  },
  {
    id: "INV-0002",
    client: "Globex Corp",
    amount: "$3,500.00",
    issueDate: "Apr 03, 2025",
    dueDate: "Apr 17, 2025",
    status: "pending"
  },
  {
    id: "INV-0003",
    client: "Stark Industries",
    amount: "$2,750.00",
    issueDate: "Apr 05, 2025",
    dueDate: "Apr 19, 2025",
    status: "overdue"
  },
  {
    id: "INV-0004",
    client: "Wayne Enterprises",
    amount: "$1,800.00",
    issueDate: "Apr 08, 2025",
    dueDate: "Apr 22, 2025",
    status: "paid"
  },
  {
    id: "INV-0005",
    client: "Oscorp",
    amount: "$3,200.00",
    issueDate: "Apr 10, 2025",
    dueDate: "Apr 24, 2025",
    status: "pending"
  },
  {
    id: "INV-0006",
    client: "Umbrella Corp",
    amount: "$950.00",
    issueDate: "Apr 12, 2025",
    dueDate: "Apr 26, 2025",
    status: "draft"
  },
  {
    id: "INV-0007",
    client: "Cyberdyne Systems",
    amount: "$5,400.00",
    issueDate: "Apr 15, 2025",
    dueDate: "Apr 29, 2025",
    status: "pending"
  }
];

const getStatusStyles = (status: string) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-amber-100 text-amber-800";
    case "overdue":
      return "bg-red-100 text-red-800";
    case "draft":
      return "bg-slate-100 text-slate-800";
    default:
      return "";
  }
};

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredInvoices = mockInvoices.filter(invoice => 
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    invoice.client.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">Manage and track all your invoices</p>
        </div>
        
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Invoice
        </Button>
      </div>
      
      <div className="bg-white rounded-md border shadow-sm">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search invoices..." 
              className="pl-8 w-full max-w-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <Link 
                        to={`/dashboard/invoices/${invoice.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {invoice.id}
                      </Link>
                    </TableCell>
                    <TableCell>{invoice.client}</TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell>{invoice.issueDate}</TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={cn("capitalize", getStatusStyles(invoice.status))}
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Edit invoice</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Printer className="mr-2 h-4 w-4" />
                            Print
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center">
                      <FileText className="h-12 w-12 text-muted-foreground mb-3" />
                      <p className="text-lg font-medium">No invoices found</p>
                      <p className="text-sm text-muted-foreground">
                        {searchTerm ? "Try a different search term" : "Create your first invoice to get started"}
                      </p>
                      {!searchTerm && (
                        <Button className="mt-4">
                          <Plus className="mr-2 h-4 w-4" />
                          New Invoice
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="p-4 border-t flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing <strong>{filteredInvoices.length}</strong> of <strong>{mockInvoices.length}</strong> invoices
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
