import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Printer, Edit, Send } from "lucide-react";
import { getQuoteById } from "@/services/quoteService";
import { getClientById } from "@/services/clientService";
import { Quote, QuoteItem } from "@/types/quotes";
import { Client } from "@/types/clients";
import QuotePreview from "@/components/quote/QuotePreview";
import { downloadPDF } from "@/utils/pdf";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanySettings } from "@/hooks/useSettings";
import { toast } from "sonner";
import "@/styles/invoice.css";

const QuotePreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { companySettings } = useCompanySettings();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        const { quote: fetchedQuote, items: fetchedItems } = await getQuoteById(
          id
        );

        if (!fetchedQuote) {
          throw new Error("Quote not found");
        }

        setQuote(fetchedQuote);
        setItems(fetchedItems);

        // Fetch client data
        const clientData = await getClientById(fetchedQuote.client_id);
        if (clientData) {
          setClient(clientData);
        }
      } catch (err: any) {
        console.error("Error fetching quote:", err);
        toast.error(err.message || "Failed to load quote data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Prepare company address with proper formatting
  const formatCompanyAddress = () => {
    const parts = [];
    if (companySettings?.address) parts.push(companySettings.address);

    const cityPostal = [];
    if (companySettings?.city) cityPostal.push(companySettings.city);
    if (companySettings?.postal_code)
      cityPostal.push(companySettings.postal_code);
    if (cityPostal.length > 0) parts.push(cityPostal.join(" "));

    if (companySettings?.country) parts.push(companySettings.country);

    return parts.join("\n");
  };

  const handleDownload = async () => {
    if (!quote || !client || !previewRef.current) return;

    try {
      await downloadPDF(
        previewRef,
        `Quote-${quote.quote_number}`,
        "quote",
        quote.quote_number
      );
      toast.success("Quote downloaded successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to download PDF");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEdit = () => {
    if (id) {
      navigate(`/dashboard/quotes/${id}/edit`);
    }
  };

  const handleSend = () => {
    // This would integrate with an email service in a real app
    toast.success("Quote sent to client successfully!");
  };

  if (loading || !quote || !client) {
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
          onClick={() => navigate("/dashboard/quotes")}
        >
          <ArrowLeft size={16} />
          Back to Quotes
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

      <div id="printable-content" className="compact-invoice">
        <QuotePreview
          ref={previewRef}
          quote={{
            ...quote,
            payment_plan: quote.payment_percentage === 100 ? "full" : "part",
          }}
          items={items}
          client={client}
          companyName={companySettings?.company_name || "Your Company"}
          companyLogo={companySettings?.logo_url || ""}
          companyAddress={formatCompanyAddress()}
          companyEmail={user?.email || "email@company.com"}
          companyPhone={user?.phone || "+1 234 567 890"}
        />
      </div>

      {/* Print styles */}
      <style>
        {`
          /* Add compact styles for the quote preview */
          .compact-invoice .invoice-container {
            padding: 20px !important;
            margin: 0 auto !important;
            max-width: 100% !important;
          }
          
          .compact-invoice .invoice-header {
            padding: 0 !important;
            margin-bottom: 15px !important;
            display: flex !important;
            flex-direction: column !important;
          }
          
          .compact-invoice .invoice-body {
            padding: 0 !important;
          }
          
          .compact-invoice .invoice-parties {
            margin-bottom: 15px !important;
            gap: 20px !important;
            font-size: 12px !important;
            display: flex !important;
            flex-direction: column !important;
          }
          
          @media (min-width: 768px) {
            .compact-invoice .invoice-parties {
              flex-direction: row !important;
            }
          }
          
          .compact-invoice .party-title {
            margin-bottom: 5px !important;
          }
          
          .compact-invoice .party-name {
            margin-bottom: 5px !important;
          }
          
          .compact-invoice .party-details {
            font-size: 10px !important;
            line-height: 1.4 !important;
          }
          
          .compact-invoice .invoice-details-grid {
            margin-bottom: 15px !important;
            padding: 5px !important;
            background-color: #f9fafb !important;
            border-radius: 4px !important;
            margin-top: -5px !important;
            flex-wrap: wrap !important;
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8px !important;
          }
          
          @media (min-width: 768px) {
            .compact-invoice .invoice-details-grid {
              display: flex !important;
              flex-direction: row !important;
              grid-template-columns: none !important;
            }
          }
          
          .invoice-detail {
            flex: 1 !important;
            min-width: 0 !important;
            padding: 5px !important;
          }
          
          .detail-label {
            font-size: 9px !important;
            color: #6b7280 !important;
            font-weight: 500 !important;
            margin-bottom: 2px !important;
          }
          
          .detail-value {
            font-size: 10px !important;
            font-weight: 600 !important;
            word-break: break-word !important;
          }
          
          .compact-invoice .line-items-container {
            margin-bottom: 15px !important;
            width: 100% !important;
            overflow-x: auto !important;
          }
          
          .compact-invoice .line-items-table {
            min-width: 100% !important;
            table-layout: auto !important;
          }
          
          .compact-invoice .line-items-table th,
          .compact-invoice .line-items-table td {
            padding: 8px 10px !important;
            font-size: 12px !important;
            white-space: normal !important;
            word-break: break-word !important;
          }
          
          .compact-invoice .invoice-totals {
            margin-bottom: 15px !important;
            margin-left: auto !important;
            width: 100% !important;
          }
          
          @media (min-width: 768px) {
            .compact-invoice .invoice-totals {
              width: 50% !important;
            }
          }
          
          .compact-invoice .totals-row {
            padding: 6px 15px !important;
            font-size: 12px !important;
            display: flex !important;
            justify-content: space-between !important;
          }
          
          .compact-invoice .grand-total {
            font-size: 14px !important;
          }
          
          .compact-invoice .grand-total .totals-value {
            font-size: 16px !important;
          }
          
          .compact-invoice .invoice-notes,
          .compact-invoice .invoice-terms {
            padding: 10px !important;
            margin-bottom: 15px !important;
          }
          
          .compact-invoice .notes-title,
          .compact-invoice .terms-title {
            margin-bottom: 5px !important;
            padding-bottom: 5px !important;
            font-size: 13px !important;
          }
          
          .compact-invoice .notes-content,
          .compact-invoice .terms-content {
            font-size: 12px !important;
            line-height: 1.4 !important;
          }
          
          .compact-invoice .invoice-footer {
            margin-top: 15px !important;
            padding: 10px 0 !important;
          }
          
          .compact-invoice .thank-you {
            font-size: 13px !important;
          }
          
          .invoice-details-grid {
            font-size: 10px !important;
          }

          /* Action buttons mobile styles */
          .invoice-actions {
            display: flex !important;
            flex-direction: column !important;
            gap: 10px !important;
            margin-bottom: 15px !important;
          }
          
          @media (min-width: 768px) {
            .invoice-actions {
              flex-direction: row !important;
              justify-content: space-between !important;
            }
          }
          
          .action-buttons {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 8px !important;
          }
          
          .invoice-button {
            padding: 8px 12px !important;
            font-size: 12px !important;
            display: flex !important;
            align-items: center !important;
            gap: 4px !important;
          }
          
          /* Print styles */
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
              padding: 0 !important;
              margin: 0 !important;
              max-width: none !important;
            }
            .invoice-actions, .no-print {
              display: none !important;
            }
            
            /* Force page size to fit */
            @page {
              size: A4;
              margin: 10mm;
            }
            
            /* Ensure everything fits on one page */
            html, body {
              width: 210mm;
              height: 297mm;
            }
            
            /* Fixed, direct style overrides for specific elements */
            #printable-content .invoice-container {
              font-size: 10px !important;
              padding: 15px !important;
              box-shadow: none !important;
              border: 1px solid #e5e7eb !important;
              max-width: 100% !important;
            }
            
            /* Direct and specific selectors for the parties section */
            #printable-content .invoice-parties {
              display: flex !important;
              flex-direction: row !important;
              justify-content: space-between !important;
              gap: 20px !important;
              margin-bottom: 15px !important;
              width: 100% !important;
            }
            
            #printable-content .invoice-party {
              flex: 1 1 auto !important;
              max-width: 48% !important;
              min-width: 48% !important;
              width: 48% !important;
              display: block !important;
            }
            
            /* Force side-by-side layout using float as a fallback */
            #printable-content .invoice-party:first-child {
              float: left !important;
              clear: left !important;
            }
            
            #printable-content .invoice-party:last-child {
              float: right !important;
              clear: right !important;
            }
            
            #printable-content .party-title {
              font-size: 11pt !important;
              margin-bottom: 3px !important;
              font-weight: bold !important;
            }
            
            #printable-content .party-name {
              font-size: 12pt !important;
              font-weight: 600 !important;
              margin-bottom: 3px !important;
            }
            
            #printable-content .party-details {
              font-size: 9pt !important;
              line-height: 1.3 !important;
            }
            
            /* Move and style invoice details for print */
            #printable-content .invoice-details-grid {
              display: flex !important;
              flex-direction: row !important;
              justify-content: space-between !important;
              gap: 10px !important;
              margin: 0 0 10px 0 !important;
              width: 100% !important;
              padding: 5px !important;
              background-color: #f9fafb !important;
              border-radius: 0 !important;
              border: none !important;
            }
            
            #printable-content .invoice-detail {
              flex: 1 1 auto !important;
              min-width: 0 !important;
              padding: 3px !important;
              margin: 0 !important;
            }
            
            #printable-content .detail-label {
              font-size: 8pt !important;
              color: #6b7280 !important;
              font-weight: 500 !important;
              margin-bottom: 1px !important;
              display: block !important;
            }
            
            #printable-content .detail-value {
              font-size: 9pt !important;
              font-weight: 600 !important;
              display: block !important;
            }
            
            /* Rest of print styles */
            .line-items-table th,
            .line-items-table td {
              padding: 6px 8px !important;
              font-size: 9pt !important;
            }
            
            .invoice-totals {
              width: 200px !important;
            }
            
            .totals-row {
              padding: 4px 8px !important;
              font-size: 9pt !important;
            }
            
            .grand-total {
              font-size: 10pt !important;
            }
            
            .grand-total .totals-value {
              font-size: 11pt !important;
            }
            
            .invoice-footer {
              margin-top: 10px !important;
              padding: 5px 0 !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default QuotePreviewPage;
