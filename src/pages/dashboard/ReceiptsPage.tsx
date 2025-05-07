
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Edit,
  Trash2,
  Receipt as ReceiptIcon,
  Loader2,
  Eye,
  Download,
  FileText,
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
import { useReceipts } from "@/hooks/useReceipts";
import { Receipt } from "@/types";
import { formatCurrency } from "@/utils/formatters";
import ErrorBoundary from "@/components/ErrorBoundary";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { getClientById } from "@/services/clientService";
import { invoiceService } from "@/services/invoiceService";
import { getQuoteById } from "@/services/quoteService";
import { downloadPDF } from "@/utils/pdf";
import { ReceiptPreview } from "@/components/receipt/ReceiptPreview";
import { useQuotes } from "@/hooks/useQuotes";

const ReceiptsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    receipts,
    loading,
    error,
    getClientName,
    getInvoiceNumber,
    removeReceipt,
  } = useReceipts();
  const { quotes } = useQuotes();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  // Preview and download related states
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [previewClient, setPreviewClient] = useState<any>(null);
  const [previewInvoice, setPreviewInvoice] = useState<any>(null);
  const [previewQuote, setPreviewQuote] = useState<any>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Helper function to get quote number from quote ID
  const getQuoteNumber = (quoteId: string) => {
    const quote = quotes.find((q) => q.id === quoteId);
    return quote ? quote.quote_number : "Unknown";
  };

  const handleDeleteClick = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedReceipt) {
      await removeReceipt(selectedReceipt.id);
      setIsDeleteDialogOpen(false);
      setSelectedReceipt(null);
    }
  };

  const handlePreviewClick = async (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setIsLoadingPreview(true);
    setIsPreviewDialogOpen(true);

    try {
      // Fetch client data
      const client = await getClientById(receipt.client_id);
      setPreviewClient(client);

      // Fetch invoice data if there's a related invoice
      if (receipt.invoice_id) {
        const { invoice } = await invoiceService.getInvoiceById(
          receipt.invoice_id
        );
        setPreviewInvoice(invoice);
      }

      // Fetch quote data if there's a related quote
      if (receipt.quote_id) {
        const { quote } = await getQuoteById(receipt.quote_id);
        setPreviewQuote(quote);
      }
    } catch (error) {
      console.error("Error loading preview data:", error);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleDownloadReceipt = async (receipt: Receipt) => {
    try {
      // First navigate to the preview page which handles the download
      navigate(`/dashboard/receipts/preview/${receipt.id}`);
    } catch (error) {
      console.error("Error navigating to download receipt:", error);
    }
  };

  const handleDownloadPDF = async () => {
    if (!selectedReceipt || !previewClient || !previewRef.current) return;

    try {
      await downloadPDF(
        previewRef,
        previewClient.business_name.replace(/\s+/g, "-").toLowerCase(),
        "receipt",
        selectedReceipt.receipt_number
      );
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const getPaymentMethodLabel = (paymentMethod: string): string => {
    switch (paymentMethod) {
      case "cash":
        return "Cash";
      case "bank_transfer":
        return "Bank Transfer";
      case "credit_card":
        return "Credit Card";
      case "paypal":
        return "PayPal";
      case "other":
        return "Other";
      default:
        return paymentMethod;
    }
  };

  const filteredReceipts = receipts.filter(
    (receipt) =>
      receipt.receipt_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getClientName(receipt.client_id)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-gray-900">Receipts</h1>
          <p className="text-gray-500">Manage your payment receipts</p>
        </div>
        <Link to="/dashboard/receipts/new">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> New Receipt
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search receipts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : filteredReceipts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <ReceiptIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No receipts found
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? "No receipts match your search"
              : "You haven't created any receipts yet"}
          </p>
          {searchTerm ? (
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Clear Search
            </Button>
          ) : (
            <Link to="/dashboard/receipts/new">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="mr-2 h-4 w-4" /> Create Your First Receipt
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <ErrorBoundary>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Invoice/Quote #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReceipts.map((receipt) => (
                <TableRow key={receipt.id}>
                  <TableCell className="font-medium">
                    <Link
                      to={`/dashboard/receipts/preview/${receipt.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {receipt.receipt_number}
                    </Link>
                  </TableCell>
                  <TableCell>{getClientName(receipt.client_id)}</TableCell>
                  <TableCell>
                    {receipt.invoice_id ? (
                      <Link
                        to={`/dashboard/invoices/${receipt.invoice_id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {getInvoiceNumber(receipt.invoice_id)}
                      </Link>
                    ) : receipt.quote_id ? (
                      <Link
                        to={`/dashboard/quotes/${receipt.quote_id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {getQuoteNumber(receipt.quote_id)}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(receipt.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(receipt.amount, receipt.currency)}
                  </TableCell>
                  <TableCell>
                    {getPaymentMethodLabel(receipt.payment_method)}
                  </TableCell>
                  <TableCell>{receipt.payment_reference || "-"}</TableCell>
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
                            <Link
                              to={`/dashboard/receipts/preview/${receipt.id}`}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/dashboard/receipts/edit/${receipt.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Receipt
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handlePreviewClick(receipt)}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Preview Receipt
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDownloadReceipt(receipt)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download Receipt
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(receipt)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Receipt
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
            <DialogTitle>Delete Receipt</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete receipt{" "}
              <span className="font-semibold">
                {selectedReceipt?.receipt_number}
              </span>
              ?
            </p>
            {selectedReceipt?.invoice_id && (
              <p className="text-amber-600 mt-2">
                This may change the status of the linked invoice.
              </p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedReceipt(null);
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

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Receipt Preview</DialogTitle>
          </DialogHeader>
          {isLoadingPreview ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : (
            <>
              <div className="max-h-[600px] overflow-y-auto">
                {selectedReceipt && previewClient && (
                  <ReceiptPreview
                    ref={previewRef}
                    receipt={selectedReceipt}
                    client={previewClient}
                    invoice={previewInvoice}
                    quote={previewQuote}
                  />
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsPreviewDialogOpen(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={handleDownloadPDF}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReceiptsPage;
