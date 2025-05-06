import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
  SlidersHorizontal,
  Edit,
  Trash2,
  Eye,
  Send,
  FileCheck,
  AlertCircle,
  Ban,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useInvoices } from "@/hooks/useInvoices";
import { Invoice } from "@/types/invoices";
import { formatCurrency } from "@/utils/formatters";
import ErrorBoundary from "@/components/ErrorBoundary";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const InvoicesPage: React.FC = () => {
  const {
    invoices,
    loading,
    error,
    getClientName,
    getProjectName,
    changeInvoiceStatus,
    removeInvoice,
  } = useInvoices();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const handleDeleteClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedInvoice) {
      await removeInvoice(selectedInvoice.id);
      setIsDeleteDialogOpen(false);
      setSelectedInvoice(null);
    }
  };

  const handleStatusChange = async (
    invoiceId: string,
    status: "draft" | "sent" | "viewed" | "paid" | "overdue" | "cancelled"
  ) => {
    await changeInvoiceStatus(invoiceId, status);
  };

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getClientName(invoice.client_id)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "sent":
        return "bg-blue-100 text-blue-800";
      case "viewed":
        return "bg-purple-100 text-purple-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderStatusActions = (invoice: Invoice) => {
    switch (invoice.status) {
      case "draft":
        return (
          <>
            <DropdownMenuItem
              onClick={() => handleStatusChange(invoice.id, "sent")}
            >
              <Send className="mr-2 h-4 w-4" />
              Mark as Sent
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(invoice.id, "paid")}
            >
              <FileCheck className="mr-2 h-4 w-4" />
              Mark as Paid
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(invoice.id, "cancelled")}
            >
              <Ban className="mr-2 h-4 w-4" />
              Cancel Invoice
            </DropdownMenuItem>
          </>
        );
      case "sent":
        return (
          <>
            <DropdownMenuItem
              onClick={() => handleStatusChange(invoice.id, "viewed")}
            >
              <Eye className="mr-2 h-4 w-4" />
              Mark as Viewed
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(invoice.id, "paid")}
            >
              <FileCheck className="mr-2 h-4 w-4" />
              Mark as Paid
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(invoice.id, "overdue")}
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              Mark as Overdue
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(invoice.id, "cancelled")}
            >
              <Ban className="mr-2 h-4 w-4" />
              Cancel Invoice
            </DropdownMenuItem>
          </>
        );
      case "viewed":
        return (
          <>
            <DropdownMenuItem
              onClick={() => handleStatusChange(invoice.id, "paid")}
            >
              <FileCheck className="mr-2 h-4 w-4" />
              Mark as Paid
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(invoice.id, "overdue")}
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              Mark as Overdue
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(invoice.id, "cancelled")}
            >
              <Ban className="mr-2 h-4 w-4" />
              Cancel Invoice
            </DropdownMenuItem>
          </>
        );
      case "overdue":
        return (
          <>
            <DropdownMenuItem
              onClick={() => handleStatusChange(invoice.id, "paid")}
            >
              <FileCheck className="mr-2 h-4 w-4" />
              Mark as Paid
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(invoice.id, "cancelled")}
            >
              <Ban className="mr-2 h-4 w-4" />
              Cancel Invoice
            </DropdownMenuItem>
          </>
        );
      case "cancelled":
        return (
          <DropdownMenuItem
            onClick={() => handleStatusChange(invoice.id, "draft")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Revert to Draft
          </DropdownMenuItem>
        );
      case "paid":
        return (
          <DropdownMenuItem>
            <Download className="mr-2 h-4 w-4" />
            Download Receipt
          </DropdownMenuItem>
        );
      default:
        return null;
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 p-4 rounded-md text-red-800 mb-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-500">Manage and track your invoices</p>
        </div>
        <div className="flex gap-3">
          <Link to="/dashboard/invoices/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" /> New Invoice
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search invoices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No invoices found
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? "No invoices match your search"
              : "You haven't created any invoices yet"}
          </p>
          {searchTerm ? (
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Clear Search
            </Button>
          ) : (
            <div className="flex gap-3 justify-center">
              <Link to="/dashboard/invoices/new">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="mr-2 h-4 w-4" /> Create New Invoice
                </Button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <ErrorBoundary>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">
                    <Link
                      to={`/dashboard/invoices/${invoice.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {invoice.invoice_number}
                    </Link>
                  </TableCell>
                  <TableCell>{getClientName(invoice.client_id)}</TableCell>
                  <TableCell>
                    {invoice.project_id
                      ? getProjectName(invoice.project_id)
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {new Date(invoice.issue_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(invoice.due_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(invoice.total_amount, invoice.currency)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                        invoice.status
                      )}`}
                    >
                      {invoice.status.charAt(0).toUpperCase() +
                        invoice.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <span className="sr-only">Actions</span>
                            <span className="h-4 w-4">⋯</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/dashboard/invoices/${invoice.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              to={`/dashboard/invoices/preview/${invoice.id}`}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Preview Invoice
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link to={`/dashboard/invoices/${invoice.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Invoice
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {renderStatusActions(invoice)}
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(invoice)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Invoice
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ErrorBoundary>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Invoice</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete invoice{" "}
              <span className="font-semibold">
                {selectedInvoice?.invoice_number}
              </span>
              ?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedInvoice(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoicesPage;
