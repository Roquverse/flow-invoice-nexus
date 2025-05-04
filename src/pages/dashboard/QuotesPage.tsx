import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Edit,
  Trash2,
  FileText,
  Loader2,
  Eye,
  Send,
  FileCheck,
  AlertCircle,
  Ban,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useQuotes } from "@/hooks/useQuotes";
import { Quote } from "@/types/quotes";
import { formatCurrency } from "@/utils/formatters";
import ErrorBoundary from "@/components/ErrorBoundary";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";

const QuotesPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    quotes,
    loading,
    error,
    getClientName,
    getProjectName,
    changeQuoteStatus,
    removeQuote,
    convertToInvoice,
  } = useQuotes();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  const handleDeleteClick = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsDeleteDialogOpen(true);
  };

  const handleConvertClick = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsConvertDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedQuote) {
      await removeQuote(selectedQuote.id);
      setIsDeleteDialogOpen(false);
      setSelectedQuote(null);
    }
  };

  const confirmConvert = async () => {
    if (selectedQuote) {
      const invoiceId = await convertToInvoice(selectedQuote.id);
      setIsConvertDialogOpen(false);
      setSelectedQuote(null);

      if (invoiceId) {
        navigate(`/dashboard/invoices/${invoiceId}`);
      }
    }
  };

  const handleStatusChange = async (
    quoteId: string,
    status: "draft" | "sent" | "viewed" | "accepted" | "rejected" | "expired"
  ) => {
    await changeQuoteStatus(quoteId, status);
  };

  const filteredQuotes = quotes.filter(
    (quote) =>
      quote.quote_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getClientName(quote.client_id)
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
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "expired":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderStatusActions = (quote: Quote) => {
    switch (quote.status) {
      case "draft":
        return (
          <>
            <DropdownMenuItem
              onClick={() => handleStatusChange(quote.id, "sent")}
            >
              <Send className="mr-2 h-4 w-4" />
              Mark as Sent
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(quote.id, "accepted")}
            >
              <FileCheck className="mr-2 h-4 w-4" />
              Mark as Accepted
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(quote.id, "rejected")}
            >
              <Ban className="mr-2 h-4 w-4" />
              Mark as Rejected
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleConvertClick(quote)}>
              <FileText className="mr-2 h-4 w-4" />
              Convert to Invoice
            </DropdownMenuItem>
          </>
        );
      case "sent":
        return (
          <>
            <DropdownMenuItem
              onClick={() => handleStatusChange(quote.id, "viewed")}
            >
              <Eye className="mr-2 h-4 w-4" />
              Mark as Viewed
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(quote.id, "accepted")}
            >
              <FileCheck className="mr-2 h-4 w-4" />
              Mark as Accepted
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(quote.id, "rejected")}
            >
              <Ban className="mr-2 h-4 w-4" />
              Mark as Rejected
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(quote.id, "expired")}
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              Mark as Expired
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleConvertClick(quote)}>
              <FileText className="mr-2 h-4 w-4" />
              Convert to Invoice
            </DropdownMenuItem>
          </>
        );
      case "viewed":
        return (
          <>
            <DropdownMenuItem
              onClick={() => handleStatusChange(quote.id, "accepted")}
            >
              <FileCheck className="mr-2 h-4 w-4" />
              Mark as Accepted
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(quote.id, "rejected")}
            >
              <Ban className="mr-2 h-4 w-4" />
              Mark as Rejected
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(quote.id, "expired")}
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              Mark as Expired
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleConvertClick(quote)}>
              <FileText className="mr-2 h-4 w-4" />
              Convert to Invoice
            </DropdownMenuItem>
          </>
        );
      case "accepted":
        return (
          <DropdownMenuItem onClick={() => handleConvertClick(quote)}>
            <FileText className="mr-2 h-4 w-4" />
            Convert to Invoice
          </DropdownMenuItem>
        );
      case "rejected":
      case "expired":
        return (
          <DropdownMenuItem
            onClick={() => handleStatusChange(quote.id, "draft")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Revert to Draft
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
          <h1 className="text-2xl font-bold text-gray-900">Quotes</h1>
          <p className="text-gray-500">Manage and track your quotes</p>
        </div>
        <Link to="/dashboard/quotes/new">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> New Quote
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search quotes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : filteredQuotes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No quotes found
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? "No quotes match your search"
              : "You haven't created any quotes yet"}
          </p>
          {searchTerm ? (
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Clear Search
            </Button>
          ) : (
            <Link to="/dashboard/quotes/new">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="mr-2 h-4 w-4" /> Create Your First Quote
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <ErrorBoundary>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quote #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-medium">
                    <Link
                      to={`/dashboard/quotes/${quote.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {quote.quote_number}
                    </Link>
                  </TableCell>
                  <TableCell>{getClientName(quote.client_id)}</TableCell>
                  <TableCell>
                    {quote.project_id ? getProjectName(quote.project_id) : "-"}
                  </TableCell>
                  <TableCell>
                    {new Date(quote.issue_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(quote.expiry_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(quote.total_amount, quote.currency)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                        quote.status
                      )}`}
                    >
                      {quote.status.charAt(0).toUpperCase() +
                        quote.status.slice(1)}
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
                            <Link to={`/dashboard/quotes/${quote.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/dashboard/quotes/${quote.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Quote
                            </Link>
                          </DropdownMenuItem>
                          {renderStatusActions(quote)}
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(quote)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Quote
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
            <DialogTitle>Delete Quote</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete quote{" "}
              <span className="font-semibold">
                {selectedQuote?.quote_number}
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
                setSelectedQuote(null);
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

      {/* Convert to Invoice Dialog */}
      <Dialog open={isConvertDialogOpen} onOpenChange={setIsConvertDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Convert to Invoice</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to convert quote{" "}
              <span className="font-semibold">
                {selectedQuote?.quote_number}
              </span>{" "}
              to an invoice?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This will create a new invoice with the same details as this
              quote.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsConvertDialogOpen(false);
                setSelectedQuote(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmConvert}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Convert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuotesPage;
