
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Receipt } from "@/types/receipts";
import { Client } from "@/types/clients";
import { Invoice } from "@/types/invoices";
import { Quote } from "@/types/quotes";
import ReceiptPreview from "@/components/receipt/ReceiptPreview";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ReceiptPreviewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fix the ref handling
  const receiptRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const fetchReceipt = async () => {
      if (!id) {
        setError("Receipt ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch receipt data
        const { data: receiptData, error: receiptError } = await supabase
          .from("receipts")
          .select("*")
          .eq("id", id)
          .single();

        if (receiptError) {
          throw new Error(`Failed to fetch receipt: ${receiptError.message}`);
        }

        if (!receiptData) {
          setError("Receipt not found.");
          setLoading(false);
          return;
        }

        setReceipt(receiptData as Receipt);

        // Fetch client data
        const { data: clientData, error: clientError } = await supabase
          .from("clients")
          .select("*")
          .eq("id", receiptData.client_id)
          .single();

        if (clientError) {
          throw new Error(`Failed to fetch client: ${clientError.message}`);
        }

        setClient(clientData as Client);

        // Fetch invoice data if invoice_id exists
        if (receiptData.invoice_id) {
          const { data: invoiceData, error: invoiceError } = await supabase
            .from("invoices")
            .select("*")
            .eq("id", receiptData.invoice_id)
            .single();

          if (invoiceError) {
            console.error("Failed to fetch invoice:", invoiceError);
          } else {
            setInvoice(invoiceData as Invoice);
          }
        }

        // Fetch quote data if quote_id exists
        if (receiptData.quote_id) {
          const { data: quoteData, error: quoteError } = await supabase
            .from("quotes")
            .select("*")
            .eq("id", receiptData.quote_id)
            .single();

          if (quoteError) {
            console.error("Failed to fetch quote:", quoteError);
          } else {
            setQuote(quoteData as Quote);
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to load receipt.");
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [id]);

  const handlePrint = () => {
    if (receiptRef.current) {
      html2canvas(receiptRef.current).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "px",
          format: [canvas.width, canvas.height],
        });
        pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
        pdf.save(`receipt-${receipt?.receipt_number || "preview"}.pdf`);
      });
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading receipt...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Link to="/dashboard/receipts" className="text-blue-500 hover:underline">
          Go back to receipts
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8">
      <div className="mb-4 flex justify-between items-center">
        <Link to="/dashboard/receipts">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Receipts
          </Button>
        </Link>
        <div>
          <Button onClick={handlePrint}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>
      
      {receipt && client && (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
          <div ref={receiptRef}>
            <ReceiptPreview
              receipt={receipt}
              client={client}
              invoice={invoice || undefined}
              quote={quote || undefined}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptPreviewPage;
