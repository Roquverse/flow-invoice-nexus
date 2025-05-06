import React, { forwardRef } from "react";
import { Quote, QuoteItem } from "@/types/quotes";
import { Client } from "@/types/clients";
import { formatCurrency } from "@/utils/formatters";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanySettings } from "@/hooks/useSettings";
import "@/styles/invoice.css"; // Reuse invoice styles for consistency
import { useNavigate } from "react-router-dom";

interface QuotePreviewProps {
  quote: Quote;
  items: QuoteItem[];
  client: Client;
  companyName?: string;
  companyLogo?: string;
  companyAddress?: string;
  companyEmail?: string;
  companyPhone?: string;
}

const QuotePreview = forwardRef<HTMLDivElement, QuotePreviewProps>(
  (
    {
      quote,
      items = [],
      client,
      companyName,
      companyLogo,
      companyAddress,
      companyEmail,
      companyPhone,
    },
    ref
  ) => {
    const navigate = useNavigate();
    // Fetch company settings directly
    const { user } = useAuth();
    const { companySettings } = useCompanySettings();

    // Return a placeholder with loading indicator if quote or client is missing
    if (!quote || !client) {
      return (
        <div
          ref={ref}
          className="invoice-container"
          style={{ padding: "2rem", textAlign: "center" }}
        >
          <p>Loading quote data...</p>
        </div>
      );
    }

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

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    };

    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);

    const handleEdit = () => {
      navigate(`/dashboard/quotes/${quote.id}/edit`);
    };

    return (
      <div
        ref={ref}
        className="quote-container"
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "0",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
          color: "#333333",
          backgroundColor: "#ffffff",
        }}
      >
        {/* Back to Quotes Button */}
        {/* <div style={{ marginBottom: "16px", padding: "10px 0" }}>
          <a 
            href="/dashboard/quotes" 
            style={{
              display: "inline-flex",
              alignItems: "center",
              color: "#4b5563",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            <span style={{ marginRight: "8px" }}>←</span>
            Back to Quotes
          </a>
        </div> */}

        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            overflow: "hidden",
            backgroundColor: "#ffffff",
          }}
        >
          {/* Main Quote Content */}
          <div style={{ padding: "30px" }}>
            <div
              className="quote-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "24px",
              }}
            >
              <div>
                {company.logo && (
                  <div
                    className="company-logo"
                    style={{
                      marginBottom: "16px",
                    }}
                  >
                    <img
                      src={company.logo}
                      alt={company.name}
                      style={{
                        maxHeight: "64px",
                        maxWidth: "200px",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                )}
                <h1
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    margin: "0 0 8px 0",
                    color: "#111827",
                    textTransform: "uppercase",
                  }}
                >
                  QUOTE
                </h1>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#4b5563",
                  }}
                >
                  #{quote.quote_number}
                </div>
              </div>

              <div>
                <div
                  className={`quote-status status-${quote.status}`}
                  style={{
                    display: "inline-block",
                    padding: "3px 10px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "500",
                    backgroundColor:
                      quote.status === "accepted"
                        ? "#d1fae5"
                        : quote.status === "sent"
                        ? "#dbeafe"
                        : quote.status === "viewed"
                        ? "#ede9fe"
                        : quote.status === "rejected"
                        ? "#fee2e2"
                        : quote.status === "expired"
                        ? "#fef3c7"
                        : "#f3f4f6",
                    color:
                      quote.status === "accepted"
                        ? "#065f46"
                        : quote.status === "sent"
                        ? "#1e40af"
                        : quote.status === "viewed"
                        ? "#5b21b6"
                        : quote.status === "rejected"
                        ? "#b91c1c"
                        : quote.status === "expired"
                        ? "#92400e"
                        : "#1f2937",
                  }}
                >
                  {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                </div>
              </div>
            </div>

            <div
              className="quote-parties"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: "20px",
                marginBottom: "24px",
              }}
            >
              <div
                className="quote-party from-party"
                style={{
                  flex: "1",
                  backgroundColor: "#f9fafb",
                  padding: "15px",
                  borderRadius: "6px",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    color: "#6b7280",
                    marginBottom: "5px",
                    fontWeight: "500",
                  }}
                >
                  FROM
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    marginBottom: "4px",
                    color: "#111827",
                  }}
                >
                  {company.name}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    lineHeight: "1.5",
                    color: "#4b5563",
                  }}
                >
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
              <div
                className="quote-party to-party"
                style={{
                  flex: "1",
                  backgroundColor: "#f9fafb",
                  padding: "15px",
                  borderRadius: "6px",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    color: "#6b7280",
                    marginBottom: "5px",
                    fontWeight: "500",
                  }}
                >
                  TO
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    marginBottom: "4px",
                    color: "#111827",
                  }}
                >
                  {client.business_name || client.contact_name}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    lineHeight: "1.5",
                    color: "#4b5563",
                  }}
                >
                  {client.address && (
                    <span>
                      {client.address}
                      <br />
                    </span>
                  )}
                  {client.city && client.postal_code && (
                    <span>
                      {client.city}, {client.postal_code}
                      <br />
                    </span>
                  )}
                  {client.country && (
                    <span>
                      {client.country}
                      <br />
                    </span>
                  )}
                  {client.email && client.email}
                </div>
              </div>
            </div>

            <div
              className="quote-details"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "16px",
                marginBottom: "24px",
                backgroundColor: "#f9fafb",
                padding: "12px",
                borderRadius: "6px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#6b7280",
                    marginBottom: "4px",
                    fontWeight: "500",
                  }}
                >
                  Issue Date
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#111827",
                  }}
                >
                  {formatDate(quote.issue_date)}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#6b7280",
                    marginBottom: "4px",
                    fontWeight: "500",
                  }}
                >
                  Expiry Date
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#111827",
                  }}
                >
                  {formatDate(quote.expiry_date)}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#6b7280",
                    marginBottom: "4px",
                    fontWeight: "500",
                  }}
                >
                  Quote Number
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#111827",
                  }}
                >
                  #{quote.quote_number}
                </div>
              </div>
              {quote.payment_plan && (
                <div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#6b7280",
                      marginBottom: "4px",
                      fontWeight: "500",
                    }}
                  >
                    Payment Plan
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#111827",
                    }}
                  >
                    {quote.payment_plan === "full"
                      ? "Full Payment"
                      : `Partial Payment (${quote.payment_percentage}%)`}
                  </div>
                </div>
              )}
            </div>

            <div
              className="line-items-container"
              style={{
                marginBottom: "24px",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "13px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: "#f8fafc",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <th
                      style={{
                        textAlign: "left",
                        padding: "12px 16px",
                        fontWeight: "600",
                        color: "#374151",
                        fontSize: "12px",
                      }}
                    >
                      ITEM DETAILS
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        padding: "12px 16px",
                        fontWeight: "600",
                        color: "#374151",
                        fontSize: "12px",
                      }}
                    >
                      QUANTITY
                    </th>
                    <th
                      style={{
                        textAlign: "right",
                        padding: "12px 16px",
                        fontWeight: "600",
                        color: "#374151",
                        fontSize: "12px",
                      }}
                    >
                      RATE
                    </th>
                    <th
                      style={{
                        textAlign: "right",
                        padding: "12px 16px",
                        fontWeight: "600",
                        color: "#374151",
                        fontSize: "12px",
                      }}
                    >
                      AMOUNT
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom:
                          index === items.length - 1 ? "" : "1px solid #e5e7eb",
                      }}
                    >
                      <td
                        style={{
                          padding: "12px 16px",
                          verticalAlign: "top",
                          wordBreak: "break-word",
                        }}
                      >
                        {item.description}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          textAlign: "center",
                          verticalAlign: "top",
                        }}
                      >
                        {item.quantity}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          textAlign: "right",
                          verticalAlign: "top",
                        }}
                      >
                        {formatCurrency(item.unit_price, quote.currency)}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          textAlign: "right",
                          verticalAlign: "top",
                          fontWeight: "600",
                        }}
                      >
                        {formatCurrency(item.amount, quote.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div
                className="quote-totals"
                style={{
                  marginTop: "24px",
                  marginLeft: "auto",
                  width: "260px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    fontSize: "13px",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "500",
                      color: "#4b5563",
                    }}
                  >
                    Subtotal
                  </div>
                  <div
                    style={{
                      fontWeight: "600",
                      color: "#111827",
                    }}
                  >
                    {formatCurrency(subtotal, quote.currency)}
                  </div>
                </div>

                {quote.discount_amount > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      fontSize: "13px",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "500",
                        color: "#4b5563",
                      }}
                    >
                      Discount
                    </div>
                    <div
                      style={{
                        fontWeight: "600",
                        color: "#111827",
                      }}
                    >
                      {formatCurrency(quote.discount_amount, quote.currency)}
                    </div>
                  </div>
                )}

                {quote.tax_amount > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      fontSize: "13px",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "500",
                        color: "#4b5563",
                      }}
                    >
                      Tax
                    </div>
                    <div
                      style={{
                        fontWeight: "600",
                        color: "#111827",
                      }}
                    >
                      {formatCurrency(quote.tax_amount, quote.currency)}
                    </div>
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px 0",
                    marginTop: "8px",
                    borderTop: "1px solid #e5e7eb",
                    fontSize: "14px",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "600",
                      color: "#111827",
                    }}
                  >
                    Total
                  </div>
                  <div
                    style={{
                      fontWeight: "700",
                      color: "#111827",
                    }}
                  >
                    {formatCurrency(quote.total_amount, quote.currency)}
                  </div>
                </div>

                {quote.payment_plan === "part" && quote.payment_amount && (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 0",
                        marginTop: "12px",
                        borderTop: "1px solid #e5e7eb",
                        fontSize: "13px",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "500",
                          color: "#4b5563",
                        }}
                      >
                        Initial Payment ({quote.payment_percentage}%)
                      </div>
                      <div
                        style={{
                          fontWeight: "600",
                          color: "#111827",
                        }}
                      >
                        {formatCurrency(quote.payment_amount, quote.currency)}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 0",
                        fontSize: "13px",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "500",
                          color: "#4b5563",
                        }}
                      >
                        Balance Due
                      </div>
                      <div
                        style={{
                          fontWeight: "600",
                          color: "#111827",
                        }}
                      >
                        {formatCurrency(
                          quote.total_amount - quote.payment_amount,
                          quote.currency
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {quote.notes && (
              <div
                style={{
                  marginBottom: "20px",
                  padding: "12px",
                  backgroundColor: "#f9fafb",
                  borderRadius: "6px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    marginBottom: "8px",
                    paddingBottom: "8px",
                    borderBottom: "1px solid #e5e7eb",
                    color: "#111827",
                  }}
                >
                  Notes
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    lineHeight: "1.5",
                    color: "#4b5563",
                  }}
                >
                  {quote.notes}
                </div>
              </div>
            )}

            {quote.terms && (
              <div
                style={{
                  marginBottom: "20px",
                  padding: "12px",
                  backgroundColor: "#f9fafb",
                  borderRadius: "6px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    marginBottom: "8px",
                    paddingBottom: "8px",
                    borderBottom: "1px solid #e5e7eb",
                    color: "#111827",
                  }}
                >
                  Terms & Conditions
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    lineHeight: "1.5",
                    color: "#4b5563",
                  }}
                >
                  {quote.terms}
                </div>
              </div>
            )}

            <div
              style={{
                background: "#f0f9ff",
                borderRadius: "6px",
                padding: "12px",
                textAlign: "center",
                color: "#0369a1",
                fontWeight: "500",
                margin: "24px 0",
                fontSize: "13px",
                border: "1px solid #bfdbfe",
              }}
            >
              This quote is valid until {formatDate(quote.expiry_date)}
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid #e5e7eb",
              padding: "16px",
              textAlign: "center",
              backgroundColor: "#f9fafb",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#4b5563",
              }}
            >
              Thank you for your business!
            </div>
          </div>
        </div>

        {/* Media queries for responsive design */}
        <style>
          {`
          @media (max-width: 768px) {
            .quote-parties {
              flex-direction: column;
              gap: 12px;
            }
            
            .quote-details {
              grid-template-columns: 1fr 1fr;
            }
            
            .quote-totals {
              width: 100%;
            }
          }
          `}
        </style>
      </div>
    );
  }
);

QuotePreview.displayName = "QuotePreview";

export default QuotePreview;
