import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuotes } from "@/hooks/useQuotes";
import { useClients } from "@/hooks/useClients";
import { Quote } from "@/types/quotes";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { toast } from "sonner";
import {
  MoreHorizontal,
  Plus,
  FileText,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Eye,
  FileUp,
  Filter,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const QuotesPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    quotes,
    loading,
    error,
    fetchQuotes,
    changeQuoteStatus,
    removeQuote,
    convertToInvoice,
  } = useQuotes();

  const { clients } = useClients();
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    // Apply filters
    let result = [...quotes];

    // Filter by status
    if (filterStatus && filterStatus !== "all") {
      result = result.filter((quote) => quote.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (quote) =>
          quote.quote_number.toLowerCase().includes(term) ||
          (quote.reference && quote.reference.toLowerCase().includes(term))
      );
    }

    setFilteredQuotes(result);
  }, [quotes, filterStatus, searchTerm]);

  const handleDeleteQuote = async () => {
    if (!selectedQuote) return;

    try {
      const success = await removeQuote(selectedQuote.id);
      if (success) {
        toast.success("Quote deleted successfully");
      } else {
        toast.error("Failed to delete quote");
      }
    } catch (err) {
      toast.error("An error occurred while deleting the quote");
      console.error(err);
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedQuote(null);
    }
  };

  const handleConvertToInvoice = async () => {
    if (!selectedQuote) return;

    try {
      const invoiceId = await convertToInvoice(selectedQuote.id);
      if (invoiceId) {
        navigate(`/dashboard/invoices/${invoiceId}`);
        toast.success("Quote converted to invoice successfully");
      } else {
        toast.error("Failed to convert quote to invoice");
      }
    } catch (err) {
      toast.error("An error occurred while converting the quote to invoice");
      console.error(err);
    } finally {
      setIsConvertModalOpen(false);
      setSelectedQuote(null);
    }
  };

  const handleStatusChange = async (quoteId: string, newStatus: string) => {
    try {
      const success = await changeQuoteStatus(quoteId, newStatus);
      if (success) {
        toast.success(`Quote status updated to ${newStatus}`);
        await fetchQuotes();
      } else {
        toast.error("Failed to update quote status");
      }
    } catch (err) {
      toast.error("An error occurred while updating the quote status");
      console.error(err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Draft
          </Badge>
        );
      case "sent":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Sent
          </Badge>
        );
      case "viewed":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            Viewed
          </Badge>
        );
      case "accepted":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Accepted
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Rejected
          </Badge>
        );
      case "expired":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800">
            Expired
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients?.find((c) => c.id === clientId);
    return client
      ? client.business_name || client.contact_name
      : "Unknown Client";
  };

  // Fix the error rendering by showing error message as string
  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quotes</h1>
        <Button onClick={() => navigate("/dashboard/quotes/new")}>
          <Plus className="mr-2 h-4 w-4" /> New Quote
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search quotes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="viewed">Viewed</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-4 w-1/3" />
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredQuotes.length === 0 ? (
        <div className="text-center py-10">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">No quotes found</h3>
          <p className="mt-1 text-gray-500">
            {quotes.length === 0
              ? "Get started by creating a new quote"
              : "Try adjusting your filters"}
          </p>
          {quotes.length === 0 && (
            <Button
              onClick={() => navigate("/dashboard/quotes/new")}
              className="mt-4"
            >
              <Plus className="mr-2 h-4 w-4" /> Create Quote
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuotes.map((quote) => (
            <Card key={quote.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      <Link
                        to={`/dashboard/quotes/${quote.id}`}
                        className="hover:underline"
                      >
                        {quote.quote_number}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      {getClientName(quote.client_id)}
                      {quote.reference && ` • Ref: ${quote.reference}`}
                    </CardDescription>
                  </div>
                  {getStatusBadge(quote.status)}
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex justify-between items-center text-sm">
                  <div className="space-y-1">
                    <div className="text-gray-500">
                      Issued: {formatDate(quote.issue_date)}
                    </div>
                    <div className="text-gray-500">
                      Expires: {formatDate(quote.expiry_date)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-medium">
                      {formatCurrency(quote.total_amount, quote.currency)}
                    </div>
                    {quote.payment_plan === "part" && (
                      <div className="text-sm text-gray-500">
                        Initial payment:{" "}
                        {formatCurrency(
                          quote.payment_amount || 0,
                          quote.currency
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end pt-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/dashboard/quotes/${quote.id}`)}
                >
                  <Eye className="h-4 w-4 mr-1" /> View
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() =>
                        navigate(`/dashboard/quotes/${quote.id}/edit`)
                      }
                    >
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedQuote(quote);
                        setIsConvertModalOpen(true);
                      }}
                    >
                      <FileUp className="h-4 w-4 mr-2" /> Convert to Invoice
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(quote.id, "draft")}
                    >
                      <Clock className="h-4 w-4 mr-2" /> Mark as Draft
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(quote.id, "sent")}
                    >
                      <Send className="h-4 w-4 mr-2" /> Mark as Sent
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(quote.id, "viewed")}
                    >
                      <Eye className="h-4 w-4 mr-2" /> Mark as Viewed
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(quote.id, "accepted")}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" /> Mark as Accepted
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(quote.id, "rejected")}
                    >
                      <XCircle className="h-4 w-4 mr-2" /> Mark as Rejected
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => {
                        setSelectedQuote(quote);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Quote</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete quote{" "}
              {selectedQuote?.quote_number}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteQuote}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Convert to Invoice Dialog */}
      <Dialog open={isConvertModalOpen} onOpenChange={setIsConvertModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convert to Invoice</DialogTitle>
            <DialogDescription>
              Are you sure you want to convert quote{" "}
              {selectedQuote?.quote_number} to an invoice? This will create a
              new invoice with the same details.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConvertModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleConvertToInvoice}>Convert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuotesPage;
