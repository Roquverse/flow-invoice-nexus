import React, { forwardRef } from "react";
import { Receipt } from "@/types/receipts";
import { Client } from "@/types/clients";
import { Invoice } from "@/types/invoices";
import { formatCurrency } from "@/utils/formatters";

interface ReceiptPreviewProps {
  receipt: Receipt;
  client: Client;
  invoice?: Invoice | null;
  companyName?: string;
  companyLogo?: string;
  companyAddress?: string;
  companyEmail?: string;
  companyPhone?: string;
}

const ReceiptPreview = forwardRef<HTMLDivElement, ReceiptPreviewProps>(
  (
    {
      receipt,
      client,
      invoice,
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">RECEIPT</h1>
            <div className="text-gray-600 mb-1">
              <span className="font-semibold">Receipt #:</span>{" "}
              {receipt.receipt_number}
            </div>
            <div className="text-gray-600 mb-1">
              <span className="font-semibold">Date:</span>{" "}
              {new Date(receipt.date).toLocaleDateString()}
            </div>
            {invoice && (
              <div className="text-gray-600 mb-1">
                <span className="font-semibold">For Invoice:</span>{" "}
                {invoice.invoice_number}
              </div>
            )}
          </div>
        </div>

        {/* Client Details */}
        <div className="border-t border-b border-gray-200 py-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Received From:
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
        </div>

        {/* Payment Details */}
        <div className="mb-8 border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Payment Details
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Amount Paid</p>
              <p className="text-lg font-semibold text-gray-800">
                {formatCurrency(receipt.amount, receipt.currency)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Payment Method</p>
              <p className="text-gray-700 capitalize">
                {receipt.payment_method.replace("_", " ")}
              </p>
            </div>

            {receipt.payment_reference && (
              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-1">Payment Reference</p>
                <p className="text-gray-700">{receipt.payment_reference}</p>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        {receipt.notes && (
          <div className="mb-8">
            <h3 className="text-gray-700 font-semibold mb-2">Notes:</h3>
            <p className="text-gray-600 text-sm whitespace-pre-wrap border-t border-b border-gray-200 py-4">
              {receipt.notes}
            </p>
          </div>
        )}

        {/* Official Receipt */}
        <div className="border-2 border-gray-300 rounded-lg p-4 mb-6 text-center">
          <p className="text-lg font-semibold text-gray-800 mb-1">
            Official Receipt
          </p>
          <p className="text-gray-600">
            This is an official receipt for the payment received.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm border-t border-gray-200 pt-4">
          Thank you for your payment!
        </div>
      </div>
    );
  }
);

ReceiptPreview.displayName = "ReceiptPreview";

export default ReceiptPreview;
