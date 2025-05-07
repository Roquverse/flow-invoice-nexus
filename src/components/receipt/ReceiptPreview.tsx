
import React, { forwardRef } from "react";
import { format } from "date-fns";
import { ReceiptDisplay } from "@/types";
import { Receipt } from "@/types/receipts";
import { Client } from "@/types/clients";
import { Invoice } from "@/types/invoices";
import { Quote } from "@/types/quotes";
import { useCompanySettings } from "@/hooks/useCompanySettings";

interface ReceiptPreviewProps {
  receipt: Receipt | ReceiptDisplay;
  client?: Client | null;
  invoice?: Invoice | null;
  quote?: Quote | null;
}

// Use forwardRef to properly handle the ref being passed
export const ReceiptPreview = forwardRef<HTMLDivElement, ReceiptPreviewProps>(
  ({ receipt, client, invoice, quote }, ref) => {
    const { companySettings } = useCompanySettings();

    // Format the receipt date consistently
    const displayDate = receipt.date 
      ? format(new Date(receipt.date), "MMM dd, yyyy")
      : receipt.issue_date 
        ? format(new Date(receipt.issue_date), "MMM dd, yyyy") 
        : "";

    // Function to get client name from either receipt type
    const getClientName = () => {
      if ('client_name' in receipt) {
        return receipt.client_name;
      }
      return client?.business_name || client?.contact_name || "Client";
    };

    // Function to get client email from either receipt type
    const getClientEmail = () => {
      if ('client_email' in receipt) {
        return receipt.client_email;
      }
      return client?.email || "";
    };

    // For ReceiptDisplay type, we already have items
    // For Receipt type from receipts.ts, we don't have items, so use an empty array
    const displayItems = 'items' in receipt ? receipt.items : [];

    return (
      <div className="bg-white p-8 rounded shadow-md" ref={ref}>
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            {companySettings?.logo_url ? (
              <img
                src={companySettings?.logo_url}
                alt="Company Logo"
                className="h-12"
              />
            ) : (
              <div className="text-lg font-semibold">
                {companySettings?.company_name || "Your Company"}
              </div>
            )}
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold mb-2">Receipt</h2>
            <div>{companySettings?.company_name || "Your Company"}</div>
            <div>{companySettings?.address || "Your Address"}</div>
            <div>{companySettings?.city || "Your City"}</div>
            <div>{companySettings?.country || "Your Country"}</div>
          </div>
        </div>

        {/* Receipt Information Section */}
        <div className="flex justify-between mb-6">
          <div>
            <div className="font-semibold">Billed to:</div>
            <div>{getClientName()}</div>
            <div>{getClientEmail()}</div>
          </div>
          <div className="text-right">
            <div>
              <span className="font-semibold">Receipt Number:</span>{" "}
              {receipt.receipt_number}
            </div>
            <div>
              <span className="font-semibold">Date:</span>{" "}
              {displayDate}
            </div>
          </div>
        </div>

        {/* Display items table only if we have items */}
        {displayItems.length > 0 && (
          <table className="w-full mb-8">
            <thead>
              <tr className="text-left">
                <th className="py-2">Description</th>
                <th className="py-2">Quantity</th>
                <th className="py-2">Unit Price</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {displayItems.map((item, index) => (
                <tr key={index}>
                  <td className="py-2">{item.description}</td>
                  <td className="py-2">{item.quantity}</td>
                  <td className="py-2">${item.unit_price}</td>
                  <td className="py-2 text-right">
                    ${(item.quantity * item.unit_price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Total Amount Section */}
        <div className="flex justify-end">
          <div className="w-1/2 text-right">
            {'subtotal' in receipt && receipt.subtotal && (
              <>
                <div className="flex justify-between">
                  <span className="font-semibold">Subtotal:</span>
                  <span>${receipt.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Tax ({receipt.tax_rate}%):</span>
                  <span>${receipt.tax_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Total:</span>
                  <span>${receipt.total.toFixed(2)}</span>
                </div>
              </>
            )}
            {'amount' in receipt && (
              <div className="flex justify-between">
                <span className="font-semibold">Amount:</span>
                <span>${receipt.amount.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Section */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Thank you for your business!
          </p>
        </div>
      </div>
    );
  }
);

// Add display name for React DevTools
ReceiptPreview.displayName = "ReceiptPreview";
