
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Download, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { getReceipts, getReceiptById, deleteReceipt } from '@/services/receiptService';
import { getClientById } from '@/services/clientService';
import { invoiceService } from '@/services/invoiceService';
import { getQuoteById } from '@/services/quoteService';
import { Receipt } from '@/types/receipts';
import { Client } from '@/types/clients';
import { Invoice } from '@/types/invoices';
import { Quote } from '@/types/quotes';
import { downloadPDF } from '@/utils/pdf';
import { ReceiptPreview } from '@/components/receipt/ReceiptPreview';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ReceiptWithClientDetails extends Receipt {
  client_name?: string;
  client_email?: string;
}

const ReceiptsPage: React.FC = () => {
  const [receipts, setReceipts] = useState<ReceiptWithClientDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptWithClientDetails | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [open, setOpen] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const navigate = useNavigate();
  
  // Make sure previewRef is properly defined as a ref to an HTMLDivElement
  const previewRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    setLoading(true);
    try {
      const receiptsData = await getReceipts();
      // Fetch client data for each receipt to display client name and email
      const receiptsWithClientDetails = await Promise.all(
        receiptsData.map(async (receipt) => {
          const client = await getClientById(receipt.client_id);
          return {
            ...receipt,
            client_name: client ? `${client.business_name}` : 'Unknown Client',
            client_email: client ? client.email || 'No Email' : 'No Email',
          };
        })
      );
      setReceipts(receiptsWithClientDetails);
    } catch (error) {
      console.error('Error fetching receipts:', error);
      toast.error('Failed to fetch receipts');
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = async (receipt: ReceiptWithClientDetails) => {
    setSelectedReceipt(receipt);
    setOpen(true);

    try {
      const client = await getClientById(receipt.client_id);
      setSelectedClient(client);

      if (receipt.invoice_id) {
        const { invoice } = await invoiceService.getInvoiceById(receipt.invoice_id);
        setSelectedInvoice(invoice);
      } else {
        setSelectedInvoice(null);
      }

      if (receipt.quote_id) {
        const { quote } = await getQuoteById(receipt.quote_id);
        setSelectedQuote(quote);
      } else {
        setSelectedQuote(null);
      }
    } catch (error) {
      console.error('Error fetching related data:', error);
      toast.error('Failed to fetch related data');
    }
  };

  const handleDeleteReceipt = async () => {
    if (!selectedReceipt) return;
    
    try {
      const success = await deleteReceipt(selectedReceipt.id);
      if (success) {
        toast.success('Receipt deleted successfully');
        setOpenDeleteAlert(false);
        fetchReceipts();
      } else {
        toast.error('Failed to delete receipt');
      }
    } catch (error) {
      console.error('Error deleting receipt:', error);
      toast.error('An error occurred while deleting the receipt');
    }
  };

  const filteredReceipts = receipts.filter((receipt) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      receipt.receipt_number.toLowerCase().includes(searchTerm) ||
      (receipt.client_name?.toLowerCase() || '').includes(searchTerm) ||
      (receipt.client_email?.toLowerCase() || '').includes(searchTerm)
    );
  });
  
  const downloadReceiptPDF = async (receipt: Receipt, client: Client) => {
    if (!previewRef.current) {
      toast.error("Preview component not loaded properly.");
      return;
    }
    
    try {
      await downloadPDF(
        previewRef.current,
        `receipt-${receipt.receipt_number}`,
        "receipt",
        receipt.receipt_number
      );
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF");
    }
  };
  
  return (
    <div>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Receipts</h1>
          <Button onClick={() => navigate('/dashboard/receipts/create')} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Create Receipt
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Receipts List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search receipts..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-4">Loading receipts...</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Receipt Number</TableHead>
                      <TableHead>Client Name</TableHead>
                      <TableHead>Client Email</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReceipts.map((receipt) => (
                      <TableRow key={receipt.id} onClick={() => handleRowClick(receipt)} className="cursor-pointer hover:bg-gray-100">
                        <TableCell>{receipt.receipt_number}</TableCell>
                        <TableCell>{receipt.client_name}</TableCell>
                        <TableCell>{receipt.client_email}</TableCell>
                        <TableCell>{new Date(receipt.date).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">{formatCurrency(receipt.amount, receipt.currency)}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center space-x-2">
                            <Button variant="ghost" size="sm" onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/dashboard/receipts/preview/${receipt.id}`);
                            }}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/dashboard/receipts/edit/${receipt.id}`);
                            }}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={(e) => {
                              e.stopPropagation();
                              setOpenDeleteAlert(true);
                              setSelectedReceipt(receipt);
                            }}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Receipt Details Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Receipt Details</DialogTitle>
            <DialogDescription>
              View all the information about this receipt.
            </DialogDescription>
          </DialogHeader>
          {selectedReceipt && selectedClient && (
            <div className="grid gap-4 py-4">
              <div className="flex justify-end space-x-2">
                <Button onClick={() => {
                  if (selectedReceipt && selectedClient) {
                    downloadReceiptPDF(selectedReceipt, selectedClient);
                  }
                }} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button variant="outline" onClick={() => navigate(`/dashboard/receipts/preview/${selectedReceipt.id}`)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Full Page
                </Button>
              </div>

              <div className="border rounded-lg p-4 bg-white shadow-md">
                <div ref={previewRef}>
                  <ReceiptPreview
                    receipt={selectedReceipt}
                    client={selectedClient}
                    invoice={selectedInvoice}
                    quote={selectedQuote}
                  />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={openDeleteAlert} onOpenChange={setOpenDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the receipt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteReceipt}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ReceiptsPage;
