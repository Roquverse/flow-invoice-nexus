
import React, { forwardRef } from "react";
import { formatCurrency } from "@/utils/formatters";
import { Receipt } from "@/types/receipts";
import { Client } from "@/types/clients";
import { Invoice } from "@/types/invoices";
import { Quote } from "@/types/quotes";

interface ReceiptPreviewProps {
  receipt: Receipt;
  client?: Client;
  invoice?: Invoice;
  quote?: Quote;
}

const ReceiptPreview = forwardRef<HTMLDivElement, ReceiptPreviewProps>(
  ({ receipt, client, invoice, quote }, ref) => {
    const formattedAmount = formatCurrency(receipt.amount, receipt.currency);
    const formattedDate = new Date(receipt.date).toLocaleDateString();

    return (
      <div ref={ref} className="bg-white p-6 rounded-lg shadow-sm border">
        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Receipt</h2>
            <p className="text-sm text-gray-600">#{receipt.receipt_number}</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-semibold text-gray-800">{formattedAmount}</div>
            <div className="text-sm text-gray-600">Paid on {formattedDate}</div>
          </div>
        </div>

        {/* Client & Payment Info */}
        <div className="grid grid-cols-2 gap-8 mb-10">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">From</h3>
            <div className="text-gray-800">
              {client?.business_name || "Your Company"}
            </div>
            <div className="text-gray-600 text-sm mt-2">
              {client?.address && <div>{client.address}</div>}
              {client?.city && (
                <div>
                  {client.city}{client?.postal_code ? `, ${client.postal_code}` : ""}
                </div>
              )}
              {client?.country && <div>{client.country}</div>}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-2">Payment Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-600">Date:</div>
              <div className="text-gray-800">{formattedDate}</div>
              
              <div className="text-gray-600">Amount:</div>
              <div className="text-gray-800">{formattedAmount}</div>
              
              <div className="text-gray-600">Method:</div>
              <div className="text-gray-800 capitalize">
                {receipt.payment_method.replace("_", " ")}
              </div>
              
              {receipt.payment_reference && (
                <>
                  <div className="text-gray-600">Reference:</div>
                  <div className="text-gray-800">{receipt.payment_reference}</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Payment Description */}
        <div className="border-t border-gray-200 pt-6 mb-10">
          <h3 className="font-medium text-gray-700 mb-4">Payment For</h3>
          {invoice ? (
            <div className="flex justify-between">
              <div>
                <div className="text-gray-800">Invoice #{invoice.invoice_number}</div>
                <div className="text-sm text-gray-600">Issued on {new Date(invoice.issue_date).toLocaleDateString()}</div>
              </div>
              <div className="text-gray-800">{formatCurrency(invoice.total_amount, receipt.currency)}</div>
            </div>
          ) : quote ? (
            <div className="flex justify-between">
              <div>
                <div className="text-gray-800">Quote #{quote.quote_number}</div>
                <div className="text-sm text-gray-600">Issued on {new Date(quote.issue_date).toLocaleDateString()}</div>
              </div>
              <div className="text-gray-800">{formatCurrency(quote.total_amount, receipt.currency)}</div>
            </div>
          ) : (
            <div className="text-gray-600">
              General payment
              {receipt.reference ? ` (Reference: ${receipt.reference})` : ''}
            </div>
          )}
        </div>

        {/* Notes */}
        {receipt.notes && (
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Notes</h3>
            <p className="text-gray-600 text-sm whitespace-pre-wrap">{receipt.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 mt-10 pt-6 border-t border-gray-200">
          <p>Thank you for your business!</p>
        </div>
      </div>
    );
  }
);

ReceiptPreview.displayName = "ReceiptPreview";

export default ReceiptPreview;
