
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getReceiptById } from '@/services/receiptService';
import { getClientById } from '@/services/clientService';
import { invoiceService } from '@/services/invoiceService';
import { getQuoteById } from '@/services/quoteService';
import { Receipt } from '@/types/receipts';
import { Client } from '@/types/clients';
import { Invoice } from '@/types/invoices';
import { Quote } from '@/types/quotes';
import { ReceiptPreview } from '@/components/receipt/ReceiptPreview';
import { downloadPDF } from '@/utils/pdf';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const ReceiptPreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  
  // Use useRef with correct typing
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      fetchReceipt(id);
    }
  }, [id]);

  const fetchReceipt = async (receiptId: string) => {
    try {
      setLoading(true);
      const receiptData = await getReceiptById(receiptId);
      
      if (!receiptData) {
        toast.error('Receipt not found');
        navigate('/dashboard/receipts');
        return;
      }
      
      setReceipt(receiptData);
      
      // Fetch client data
      const clientData = await getClientById(receiptData.client_id);
      if (clientData) {
        setClient(clientData);
      }
      
      // Fetch invoice data if available
      if (receiptData.invoice_id) {
        const { invoice: invoiceData } = await invoiceService.getInvoiceById(receiptData.invoice_id);
        if (invoiceData) {
          setInvoice(invoiceData);
        }
      }
      
      // Fetch quote data if available
      if (receiptData.quote_id) {
        const { quote: quoteData } = await getQuoteById(receiptData.quote_id);
        if (quoteData) {
          setQuote(quoteData);
        }
      }
    } catch (error) {
      console.error('Error fetching receipt data:', error);
      toast.error('Failed to load receipt data');
      navigate('/dashboard/receipts');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownloadPDF = async () => {
    if (!previewRef.current || !receipt || !client) {
      toast.error("Cannot generate PDF. Missing data.");
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
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate('/dashboard/receipts')} className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Receipts
        </Button>
        
        {!loading && receipt && (
          <Button onClick={handleDownloadPDF} className="bg-blue-600 hover:bg-blue-700">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        )}
      </div>
      
      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : receipt && client ? (
            <div ref={previewRef}>
              <ReceiptPreview
                receipt={receipt}
                client={client}
                invoice={invoice}
                quote={quote}
              />
            </div>
          ) : (
            <p>No receipt data found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReceiptPreviewPage;
