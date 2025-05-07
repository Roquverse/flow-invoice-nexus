
import React, { forwardRef } from "react";
import { Client } from "@/types/clients";
import { Invoice } from "@/types/invoices";
import { Quote } from "@/types/quotes";
import { Receipt } from "@/types/receipts";
import { ReceiptDisplay } from "@/types/index";
import { formatCurrency, formatDate } from "@/utils/formatters";

export interface ReceiptPreviewProps {
  receipt: Receipt | ReceiptDisplay;
  client: Client;
  invoice?: Invoice | null;
  quote?: Quote | null;
}

export const ReceiptPreview = forwardRef<HTMLDivElement, ReceiptPreviewProps>(
  ({ receipt, client, invoice, quote }, ref) => {
    // Helper function to get issue date from either receipt type
    const getIssueDate = () => {
      if ('issue_date' in receipt) {
        return receipt.issue_date;
      } else {
        return receipt.date; // Fall back to date field for Receipt type
      }
    };

    // Determine if we're dealing with ReceiptDisplay or Receipt
    const isReceiptDisplay = 'items' in receipt;
    
    return (
      <div ref={ref} className="bg-white p-6 max-w-4xl mx-auto">
        <div className="border-b pb-4 mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Receipt</h1>
            <p className="text-gray-600 mt-1">#{receipt.receipt_number}</p>
            <p className="text-gray-600 mt-1">Date: {formatDate(getIssueDate() || receipt.date)}</p>
          </div>
          <div className="text-right">
            {/* Highlight payment status */}
            <span className="inline-block px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
              Paid
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-sm font-semibold text-gray-600 uppercase mb-2">From</h2>
            <div className="text-gray-800">
              <p className="font-medium">{client.business_name}</p>
              <p>{client.contact_name}</p>
              <p>{client.address}</p>
              <p>
                {client.city}, {client.postal_code}
              </p>
              <p>{client.country}</p>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-600 uppercase mb-2">Payment Details</h2>
            <div className="text-gray-800">
              <p>
                <span className="font-medium">Method:</span> {receipt.payment_method}
              </p>
              {receipt.payment_reference && (
                <p>
                  <span className="font-medium">Reference:</span> {receipt.payment_reference}
                </p>
              )}
              {receipt.reference && (
                <p>
                  <span className="font-medium">Reference:</span> {receipt.reference}
                </p>
              )}
              <p>
                <span className="font-medium">Amount:</span>{" "}
                {formatCurrency(receipt.amount, receipt.currency)}
              </p>
            </div>
          </div>
        </div>

        {isReceiptDisplay && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-600 uppercase mb-4">Items</h2>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2 font-semibold">Description</th>
                  <th className="py-2 font-semibold text-right">Qty</th>
                  <th className="py-2 font-semibold text-right">Price</th>
                  <th className="py-2 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {(receipt as ReceiptDisplay).items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{item.description}</td>
                    <td className="py-2 text-right">{item.quantity}</td>
                    <td className="py-2 text-right">
                      {formatCurrency(item.unit_price, receipt.currency)}
                    </td>
                    <td className="py-2 text-right">
                      {formatCurrency(item.quantity * item.unit_price, receipt.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {invoice && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-600 uppercase mb-2">
              Related Invoice
            </h2>
            <p className="text-gray-800">
              <span className="font-medium">Invoice #:</span> {invoice.invoice_number}
            </p>
          </div>
        )}

        {quote && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-600 uppercase mb-2">
              Related Quote
            </h2>
            <p className="text-gray-800">
              <span className="font-medium">Quote #:</span> {quote.quote_number}
            </p>
          </div>
        )}

        {receipt.notes && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-600 uppercase mb-2">Notes</h2>
            <p className="text-gray-800">{receipt.notes}</p>
          </div>
        )}

        <div className="text-center text-gray-500 text-sm mt-12">
          <p>Thank you for your business!</p>
        </div>
      </div>
    );
  }
);

ReceiptPreview.displayName = "ReceiptPreview";
