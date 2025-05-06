import React, { forwardRef } from "react";
import { Receipt } from "@/types/receipts";
import { Client } from "@/types/clients";
import { Invoice } from "@/types/invoices";
import { Quote } from "@/types/quotes";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { useCompanySettings } from "@/hooks/useSettings";

interface ReceiptPreviewProps {
  receipt: Receipt;
  client: Client | null;
  invoice?: Invoice | null;
  quote?: Quote | null;
}

const ReceiptPreview = forwardRef<HTMLDivElement, ReceiptPreviewProps>(
  ({ receipt, client, invoice, quote }, ref) => {
    // Get company settings for logo and company info
    const { companySettings } = useCompanySettings();

    // Determine the reference document (invoice or quote)
    const referenceDocument = invoice || quote;
    const referenceType = invoice ? "Invoice" : quote ? "Quote" : null;
    const referenceNumber = invoice
      ? invoice.invoice_number
      : quote
      ? quote.quote_number
      : null;

    return (
      <div ref={ref} className="p-8 max-w-4xl mx-auto bg-white">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">RECEIPT</h1>
            <p className="text-lg text-gray-500">
              <span className="font-semibold">Receipt Number:</span>{" "}
              {receipt.receipt_number}
            </p>
            {referenceDocument && (
              <p className="text-lg text-gray-500">
                <span className="font-semibold">{referenceType} Number:</span>{" "}
                {referenceNumber}
              </p>
            )}
            <p className="text-lg text-gray-500">
              <span className="font-semibold">Date:</span>{" "}
              {formatDate(receipt.date)}
            </p>
          </div>
          <div className="text-right flex flex-col items-end">
            {companySettings?.logo_url && (
              <div className="mb-3">
                <img
                  src={companySettings.logo_url}
                  alt={companySettings.company_name || "Company Logo"}
                  className="max-h-16 max-w-[200px] object-contain"
                />
              </div>
            )}
            <h2 className="text-xl font-bold text-gray-800">
              {companySettings?.company_name || "Your Company"}
            </h2>
            <p className="text-gray-600">
              {companySettings?.address || "123 Business Street"}
            </p>
            <p className="text-gray-600">
              {companySettings?.city && companySettings?.postal_code
                ? `${companySettings.city}, ${companySettings.postal_code}`
                : "City, State ZIP"}
            </p>
            {companySettings?.country && (
              <p className="text-gray-600">{companySettings.country}</p>
            )}
          </div>
        </div>

        {/* Client Info */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Receipt To:</h2>
          {client ? (
            <div>
              <p className="text-gray-700 font-bold">
                {client.business_name || client.contact_name}
              </p>
              <p className="text-gray-600">{client.address}</p>
              <p className="text-gray-600">{client.email}</p>
              <p className="text-gray-600">{client.phone}</p>
            </div>
          ) : (
            <p className="text-gray-500 italic">No client information</p>
          )}
        </div>

        {/* Payment Details */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Payment Details
          </h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/3">
                    Amount Paid
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(receipt.amount, receipt.currency)}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                    Payment Method
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {receipt.payment_method.replace("_", " ")}
                  </td>
                </tr>
                {receipt.payment_reference && (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                      Payment Reference
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {receipt.payment_reference}
                    </td>
                  </tr>
                )}
                {referenceDocument && (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                      {referenceType} Reference
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {referenceNumber}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notes */}
        {receipt.notes && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Notes</h2>
            <div className="border rounded-lg p-4 bg-gray-50">
              <p className="text-gray-700 whitespace-pre-line">
                {receipt.notes}
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center border-t pt-8">
          <p className="text-gray-500 text-sm">
            Thank you for your business! This receipt serves as proof of
            payment.
          </p>
        </div>
      </div>
    );
  }
);

ReceiptPreview.displayName = "ReceiptPreview";

export default ReceiptPreview;
