import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { getReceiptById } from "@/services/receiptService";
import { getClientById } from "@/services/clientService";
import { getInvoiceById } from "@/services/invoiceService";
import { Receipt } from "@/types/receipts";
import { Invoice } from "@/types/invoices";
import { Client } from "@/types/clients";
import ReceiptPreview from "@/components/receipt/ReceiptPreview";
import { downloadPDF } from "@/utils/pdf";

const ReceiptPreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const fetchedReceipt = await getReceiptById(id);

        if (!fetchedReceipt) {
          throw new Error("Receipt not found");
        }

        setReceipt(fetchedReceipt);

        // Fetch client data
        const clientData = await getClientById(fetchedReceipt.client_id);
        if (clientData) {
          setClient(clientData);
        }

        // Fetch invoice data if there's a related invoice
        if (fetchedReceipt.invoice_id) {
          const { invoice: fetchedInvoice } = await getInvoiceById(
            fetchedReceipt.invoice_id
          );
          if (fetchedInvoice) {
            setInvoice(fetchedInvoice);
          }
        }
      } catch (err) {
        console.error("Error fetching receipt:", err);
        setError("Failed to load receipt data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDownload = async () => {
    if (!receipt || !client || !previewRef.current) return;

    try {
      await downloadPDF(
        previewRef,
        client.business_name.replace(/\s+/g, "-").toLowerCase(),
        "receipt",
        receipt.receipt_number
      );
    } catch (err) {
      console.error("Error downloading PDF:", err);
      setError("Failed to download PDF");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !receipt || !client) {
    return (
      <div className="p-8">
        <div className="bg-red-100 p-4 rounded-md text-red-700 mb-4">
          {error || "Could not load receipt data"}
        </div>
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard/receipts")}
        >
          Return to Receipts
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard/receipts")}
            className="mr-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Receipts
          </Button>
          <h1 className="text-2xl font-bold">Receipt Preview</h1>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="flex items-center"
          >
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <div
        className="bg-gray-50 p-4 rounded-lg border mb-8"
        id="printable-content"
      >
        <ReceiptPreview
          ref={previewRef}
          receipt={receipt}
          client={client}
          invoice={invoice}
        />
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-content, #printable-content * {
            visibility: visible;
          }
          #printable-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            margin: 0;
          }
          button, .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ReceiptPreviewPage;
