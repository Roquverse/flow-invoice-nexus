import React, { forwardRef } from "react";
import { Invoice, InvoiceItem } from "@/types/invoices";
import { Client } from "@/types/clients";
import { formatCurrency } from "@/utils/formatters";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanySettings } from "@/hooks/useSettings";
import "@/styles/invoice.css";

interface InvoicePreviewProps {
  invoice: Invoice;
  items: InvoiceItem[];
  client: Client;
  // Keep these props for backward compatibility but make them optional
  companyName?: string;
  companyLogo?: string;
  companyAddress?: string;
  companyEmail?: string;
  companyPhone?: string;
}

const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
  (
    {
      invoice,
      items,
      client,
      // These props will be used as fallbacks
      companyName,
      companyLogo,
      companyAddress,
      companyEmail,
      companyPhone,
    },
    ref
  ) => {
    // Fetch company settings directly
    const { user } = useAuth();
    const { companySettings } = useCompanySettings();

    // Format company address
    const formatCompanyAddress = () => {
      const parts = [];
      if (companySettings?.address) parts.push(companySettings.address);

      const cityPostal = [];
      if (companySettings?.city) cityPostal.push(companySettings.city);
      if (companySettings?.postal_code)
        cityPostal.push(companySettings.postal_code);
      if (cityPostal.length > 0) parts.push(cityPostal.join(" "));

      if (companySettings?.country) parts.push(companySettings.country);

      return parts.join("\n") || companyAddress || "Company Address Not Set";
    };

    // Get company details, with fallbacks to props and defaults
    const company = {
      name:
        companySettings?.company_name ||
        companyName ||
        user?.email ||
        "Your Company",
      logo: companySettings?.logo_url || companyLogo || "",
      address: formatCompanyAddress(),
      email: user?.email || companyEmail || "email@company.com",
      phone: user?.phone || companyPhone || "Phone Not Set",
    };

    const getStatusClass = (status: string) => {
      switch (status) {
        case "draft":
          return "status-draft";
        case "sent":
          return "status-sent";
        case "viewed":
          return "status-viewed";
        case "paid":
          return "status-paid";
        case "overdue":
          return "status-overdue";
        case "cancelled":
          return "status-cancelled";
        default:
          return "status-draft";
      }
    };

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    };

    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const tax = invoice.tax_amount || 0;
    const discount = invoice.discount_amount || 0;
    const total = invoice.total_amount;

    return (
      <div ref={ref} className="preview-container">
        <div className="invoice-container">
          <div className="invoice-header">
            <div className="invoice-header-left">
              {company.logo && (
                <div className="company-logo mb-4">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="max-h-16 max-w-[200px] object-contain"
                  />
                </div>
              )}
              <h1 className="invoice-title">INVOICE</h1>
              <div className="invoice-number">#{invoice.invoice_number}</div>
            </div>
            <div
              className="invoice-header-right"
              style={{
                textAlign: "right",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <div
                className={`invoice-status ${getStatusClass(invoice.status)}`}
                style={{
                  display: "inline-block",
                  width: "auto",
                  maxWidth: "fit-content",
                  padding: "6px 12px",
                  marginBottom: "10px",
                }}
              >
                {invoice.status}
              </div>
            </div>
          </div>

          <div className="invoice-body">
            <div className="invoice-parties" data-print-layout="horizontal">
              <div className="invoice-party from-party">
                <div className="party-title">From</div>
                <div className="party-name">{company.name}</div>
                <div className="party-details">
                  {company.address.split("\n").map((line, i) =>
                    line.trim() ? (
                      <React.Fragment key={i}>
                        {line}
                        <br />
                      </React.Fragment>
                    ) : null
                  )}
                  {company.email}
                  <br />
                  {company.phone}
                </div>
              </div>
              <div className="invoice-party to-party">
                <div className="party-title">Bill To</div>
                <div className="party-name">
                  {client.business_name || client.contact_name}
                </div>
                <div className="party-details">
                  {client.address && `${client.address}`}
                  <br />
                  {client.city &&
                    client.postal_code &&
                    `${client.city}, ${client.postal_code}`}
                  <br />
                  {client.country && `${client.country}`}
                  <br />
                  {client.email && `${client.email}`}
                </div>
              </div>
            </div>

            <div className="invoice-details-grid">
              {invoice.reference && (
                <div className="invoice-detail">
                  <div className="detail-label">Reference</div>
                  <div className="detail-value">{invoice.reference}</div>
                </div>
              )}
              <div className="invoice-detail">
                <div className="detail-label">Issue Date</div>
                <div className="detail-value">
                  {formatDate(invoice.issue_date)}
                </div>
              </div>
              <div className="invoice-detail">
                <div className="detail-label">Due Date</div>
                <div className="detail-value">
                  {formatDate(invoice.due_date)}
                </div>
              </div>
            </div>

            <div className="line-items-container">
              <table className="line-items-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th className="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="item-description">{item.description}</td>
                      <td>{item.quantity}</td>
                      <td>
                        {formatCurrency(item.unit_price, invoice.currency)}
                      </td>
                      <td className="text-right">
                        {formatCurrency(item.amount, invoice.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div
                className="invoice-totals"
                style={{
                  width: "350px",
                  maxWidth: "350px",
                  marginLeft: "auto",
                  marginRight: "0",
                }}
              >
                <div className="totals-row">
                  <div className="totals-label">Subtotal</div>
                  <div className="totals-value">
                    {formatCurrency(subtotal, invoice.currency)}
                  </div>
                </div>

                {discount > 0 && (
                  <div className="totals-row">
                    <div className="totals-label">Discount</div>
                    <div className="totals-value">
                      {formatCurrency(discount, invoice.currency)}
                    </div>
                  </div>
                )}

                {tax > 0 && (
                  <div className="totals-row">
                    <div className="totals-label">Tax</div>
                    <div className="totals-value">
                      {formatCurrency(subtotal * (tax / 100), invoice.currency)}
                    </div>
                  </div>
                )}

                <div className="grand-total totals-row">
                  <div className="totals-label">Total Due</div>
                  <div className="totals-value">
                    {formatCurrency(total, invoice.currency)}
                  </div>
                </div>
              </div>
            </div>

            {invoice.notes && (
              <div className="invoice-notes">
                <div className="notes-title">Notes</div>
                <div className="notes-content">{invoice.notes}</div>
              </div>
            )}

            {invoice.terms && (
              <div className="invoice-terms">
                <div className="terms-title">Terms & Conditions</div>
                <div className="terms-content">{invoice.terms}</div>
              </div>
            )}
          </div>

          <div className="invoice-footer">
            <div className="thank-you">Thank you for your business!</div>
            {/* You could add a customizable message here from invoice.footer_message */}
          </div>
        </div>
      </div>
    );
  }
);

InvoicePreview.displayName = "InvoicePreview";

export default InvoicePreview;
