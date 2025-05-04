import React, { forwardRef } from "react";
import { Quote, QuoteItem } from "@/types/quotes";
import { Client } from "@/types/clients";
import { formatCurrency } from "@/utils/formatters";

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
      items,
      client,
      companyName = "Your Company",
      companyLogo,
      companyAddress = "Your Company Address",
      companyEmail = "email@company.com",
      companyPhone = "+1 234 567 890",
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            {companyLogo ? (
              <img src={companyLogo} alt={companyName} className="h-16 mb-2" />
            ) : (
              <h1 className="text-2xl font-bold text-gray-800">
                {companyName}
              </h1>
            )}
            <div className="text-gray-500 text-sm mt-1">{companyAddress}</div>
            <div className="text-gray-500 text-sm">{companyEmail}</div>
            <div className="text-gray-500 text-sm">{companyPhone}</div>
          </div>
          <div className="text-right">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">QUOTE</h1>
            <div className="text-gray-600 mb-1">
              <span className="font-semibold">Quote #:</span>{" "}
              {quote.quote_number}
            </div>
            <div className="text-gray-600 mb-1">
              <span className="font-semibold">Issue Date:</span>{" "}
              {new Date(quote.issue_date).toLocaleDateString()}
            </div>
            <div className="text-gray-600 mb-1">
              <span className="font-semibold">Expiry Date:</span>{" "}
              {new Date(quote.expiry_date).toLocaleDateString()}
            </div>
            <div className="text-gray-600 mb-1">
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`uppercase font-medium ${
                  quote.status === "accepted"
                    ? "text-green-600"
                    : quote.status === "rejected"
                    ? "text-red-600"
                    : quote.status === "expired"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {quote.status}
              </span>
            </div>
          </div>
        </div>

        {/* Client Details */}
        <div className="border-t border-b border-gray-200 py-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Prepared For:
          </h2>
          <div className="text-gray-600 font-medium">
            {client.business_name}
          </div>
          {client.contact_name && (
            <div className="text-gray-600">Attn: {client.contact_name}</div>
          )}
          {client.address && (
            <div className="text-gray-600">{client.address}</div>
          )}
          {client.city && client.postal_code && (
            <div className="text-gray-600">
              {client.city}, {client.postal_code}
            </div>
          )}
          {client.country && (
            <div className="text-gray-600">{client.country}</div>
          )}
          {client.email && <div className="text-gray-600">{client.email}</div>}
          {client.phone && <div className="text-gray-600">{client.phone}</div>}
        </div>

        {/* Quote Items */}
        <table className="w-full mb-8 text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-right">Quantity</th>
              <th className="py-2 px-4 text-right">Unit Price</th>
              <th className="py-2 px-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-3 px-4 text-gray-700">{item.description}</td>
                <td className="py-3 px-4 text-right text-gray-700">
                  {item.quantity}
                </td>
                <td className="py-3 px-4 text-right text-gray-700">
                  {formatCurrency(item.unit_price, quote.currency)}
                </td>
                <td className="py-3 px-4 text-right text-gray-700">
                  {formatCurrency(item.amount, quote.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Quote Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="font-medium text-gray-600">Subtotal:</span>
              <span className="text-gray-700">
                {formatCurrency(
                  items.reduce((sum, item) => sum + item.amount, 0),
                  quote.currency
                )}
              </span>
            </div>
            {quote.tax_amount && quote.tax_amount > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="font-medium text-gray-600">Tax:</span>
                <span className="text-gray-700">
                  {formatCurrency(quote.tax_amount, quote.currency)}
                </span>
              </div>
            )}
            {quote.discount_amount && quote.discount_amount > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="font-medium text-gray-600">Discount:</span>
                <span className="text-gray-700">
                  {formatCurrency(quote.discount_amount, quote.currency)}
                </span>
              </div>
            )}
            <div className="flex justify-between py-2 text-lg font-bold">
              <span className="text-gray-700">Total:</span>
              <span className="text-gray-800">
                {formatCurrency(quote.total_amount, quote.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Notes and Terms */}
        {(quote.notes || quote.terms) && (
          <div className="border-t border-gray-200 pt-4 mb-4">
            {quote.notes && (
              <div className="mb-4">
                <h3 className="text-gray-700 font-semibold mb-1">Notes:</h3>
                <p className="text-gray-600 text-sm whitespace-pre-wrap">
                  {quote.notes}
                </p>
              </div>
            )}
            {quote.terms && (
              <div>
                <h3 className="text-gray-700 font-semibold mb-1">
                  Terms and Conditions:
                </h3>
                <p className="text-gray-600 text-sm whitespace-pre-wrap">
                  {quote.terms}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Valid Until */}
        <div className="border rounded-lg bg-blue-50 p-4 mb-6 text-center">
          <p className="text-blue-800 font-medium">
            This quote is valid until{" "}
            {new Date(quote.expiry_date).toLocaleDateString()}
          </p>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm border-t border-gray-200 pt-4">
          {quote.footer || "Thank you for considering our services!"}
        </div>
      </div>
    );
  }
);

QuotePreview.displayName = "QuotePreview";

export default QuotePreview;
