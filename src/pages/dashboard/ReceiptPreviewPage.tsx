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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ReceiptPreviewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        if (receiptData.client_id) {
          const { data: clientData, error: clientError } = await supabase
            .from("clients")
            .select("*")
            .eq("id", receiptData.client_id)
            .single();

          if (clientError) {
            console.error("Failed to fetch client:", clientError);
          } else {
            setClient(clientData as Client);
          }
        }

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

  const handlePrint = async () => {
    if (receiptRef.current) {
      try {
        const canvas = await html2canvas(receiptRef.current, {
          scale: 2, // Increase quality
          logging: false,
          useCORS: true,
          backgroundColor: "#ffffff",
        });

        // A4 dimensions in mm
        const a4Width = 210;
        const a4Height = 297;

        // Create PDF with A4 dimensions
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        // Calculate scaling to fit the A4 page while maintaining aspect ratio
        const imgWidth = a4Width;
        const imgHeight = (canvas.height * a4Width) / canvas.width;

        // Add the image centered on the page
        pdf.addImage(
          canvas.toDataURL("image/jpeg", 1.0),
          "JPEG",
          0,
          0,
          imgWidth,
          imgHeight,
          undefined,
          "FAST"
        );

        // Save the PDF
        pdf.save(`receipt-${receipt?.receipt_number || "preview"}.pdf`);
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading receipt...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Link
          to="/dashboard/receipts"
          className="text-blue-500 hover:underline"
        >
          Go back to receipts
        </Link>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">Receipt not found</p>
        <Link
          to="/dashboard/receipts"
          className="text-blue-500 hover:underline"
        >
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

      <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
        <div ref={receiptRef}>
          <ReceiptPreview
            receipt={receipt}
            client={client || undefined}
            invoice_id={invoice?.id}
            quote_id={quote?.id}
          />
        </div>
      </div>
    </div>
  );
};

export default ReceiptPreviewPage;
