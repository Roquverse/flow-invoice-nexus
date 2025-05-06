import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Printer, Send, Edit } from "lucide-react";
import { getClientById } from "@/services/clientService";
import { Invoice, InvoiceItem } from "@/types/invoices";
import { Client } from "@/types/clients";
import InvoicePreview from "@/components/invoice/InvoicePreview";
import { downloadPDF } from "@/utils/pdf";
import { invoiceService } from "@/services/invoiceService";
import { toast } from "sonner";
import "@/styles/invoice.css";

const ModernInvoicePreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add the modern-invoice-page class to the dashboard-content element
    const dashboardContent = document.querySelector(".dashboard-content");
    if (dashboardContent) {
      dashboardContent.classList.add("modern-invoice-page");
    }

    // Cleanup function to remove the class when component unmounts
    return () => {
      if (dashboardContent) {
        dashboardContent.classList.remove("modern-invoice-page");
      }
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const { invoice: fetchedInvoice, items: fetchedItems } =
          await invoiceService.getInvoiceById(id);

        if (!fetchedInvoice) {
          throw new Error("Invoice not found");
        }

        setInvoice(fetchedInvoice);
        setItems(fetchedItems);

        // Fetch client data
        const clientData = await getClientById(fetchedInvoice.client_id);
        if (clientData) {
          setClient(clientData);
        }
      } catch (err: any) {
        console.error("Error fetching invoice:", err);
        toast.error(err.message || "Failed to load invoice data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDownload = async () => {
    if (previewRef.current && invoice) {
      try {
        await downloadPDF(
          previewRef,
          `Invoice-${invoice.invoice_number}`,
          "invoice",
          invoice.invoice_number
        );
        toast.success("Invoice downloaded successfully");
      } catch (error: any) {
        toast.error(error.message || "Failed to download invoice");
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEdit = () => {
    if (id) {
      navigate(`/dashboard/invoices/${id}/edit`);
    }
  };

  const handleSend = () => {
    // This would integrate with an email service in a real app
    toast.success("Invoice sent to client successfully!");
  };

  if (loading || !invoice || !client) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="modern-invoice-page">
      <div className="invoice-actions">
        <button
          className="invoice-button button-secondary"
          onClick={() => navigate("/dashboard/invoices")}
        >
          <ArrowLeft size={16} />
          Back to Invoices
        </button>
        <div className="action-buttons">
          <button
            className="invoice-button button-secondary"
            onClick={handleEdit}
          >
            <Edit size={16} />
            Edit
          </button>
          <button
            className="invoice-button button-secondary"
            onClick={handlePrint}
          >
            <Printer size={16} />
            Print
          </button>
          <button
            className="invoice-button button-secondary"
            onClick={handleDownload}
          >
            <Download size={16} />
            Download
          </button>
          <button
            className="invoice-button button-primary"
            onClick={handleSend}
          >
            <Send size={16} />
            Send
          </button>
        </div>
      </div>

      <div id="printable-content">
        <InvoicePreview
          ref={previewRef}
          invoice={invoice}
          items={items}
          client={client}
        />
      </div>

      {/* Print styles */}
      <style>
        {`
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
            .invoice-actions, .no-print {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ModernInvoicePreviewPage;
