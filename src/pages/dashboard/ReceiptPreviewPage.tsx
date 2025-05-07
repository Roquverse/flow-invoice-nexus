import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Share } from 'lucide-react';
import { getReceiptById } from '@/services/receiptService';
import { getClientById } from '@/services/clientService';
import { invoiceService } from '@/services/invoiceService';
import { getQuoteById } from '@/services/quoteService';
import { Receipt } from '@/types';
import { downloadPDF } from '@/utils/pdf';
import { ReceiptPreview } from '@/components/receipt/ReceiptPreview';
import { Client } from '@/types/clients';
import { Invoice } from '@/types/invoices';
import { Quote } from '@/types/quotes';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';

const ReceiptPreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchReceiptData = async () => {
      if (!id) {
        setError('Receipt ID is missing.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const fetchedReceipt = await getReceiptById(id);
        if (!fetchedReceipt) {
          setError('Receipt not found.');
          setLoading(false);
          return;
        }

        setReceipt(fetchedReceipt);

        const fetchedClient = await getClientById(fetchedReceipt.client_id);
        if (!fetchedClient) {
          setError('Client not found.');
          setLoading(false);
          return;
        }
        setClient(fetchedClient);

        if (fetchedReceipt.invoice_id) {
          const { invoice: fetchedInvoice } = await invoiceService.getInvoiceById(fetchedReceipt.invoice_id);
          setInvoice(fetchedInvoice);
        }

        if (fetchedReceipt.quote_id) {
          const { quote: fetchedQuote } = await getQuoteById(fetchedReceipt.quote_id);
          setQuote(fetchedQuote);
        }
      } catch (err) {
        setError(`Failed to load receipt data. ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchReceiptData();
  }, [id, navigate]);

  const handleDownloadPDF = async () => {
    if (!receipt || !client || !previewRef.current) {
      toast.error('Failed to generate PDF: Missing data.');
      return;
    }

    try {
      await downloadPDF(
        previewRef,
        client.business_name.replace(/\s+/g, '-').toLowerCase(),
        'receipt',
        receipt.receipt_number
      );
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setError('Failed to download PDF.');
      toast.error('Failed to generate PDF.');
    }
  };

  const handleShare = async () => {
    if (!receipt) {
      toast.error('Receipt data not loaded yet.');
      return;
    }

    const receiptLink = `${window.location.origin}/receipts/preview/${id}`;

    try {
      await navigator.clipboard.writeText(receiptLink);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy link: ', err);
      toast.error('Failed to copy link to clipboard.');
    }
  };

  if (loading) {
    return <div className="p-4">Loading receipt preview...</div>;
  }

  if (error || !receipt || !client) {
    return <div className="p-4 text-red-500">Error: {error || 'Failed to load receipt.'}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Button variant="ghost" onClick={() => navigate('/dashboard/receipts')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Receipts
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Receipt Preview</h1>
        </div>
        <div className="space-x-2">
          <Button onClick={handleDownloadPDF} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-white shadow-md">
        <ReceiptPreview
          ref={previewRef}
          receipt={receipt}
          client={client}
          invoice={invoice}
          quote={quote}
        />
      </div>
    </div>
  );
};

export default ReceiptPreviewPage;
