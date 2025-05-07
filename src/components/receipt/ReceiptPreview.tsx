
import React, { forwardRef } from 'react';
import { format } from 'date-fns';
import { Receipt } from '@/types/receipts';
import { Client } from '@/types/clients';
import { Invoice } from '@/types/invoices';
import { Quote } from '@/types/quotes';

interface ReceiptPreviewProps {
  receipt: Receipt;
  client: Client;
  invoice?: Invoice;
  quote?: Quote;
}

const ReceiptPreview = forwardRef<HTMLDivElement, ReceiptPreviewProps>(
  ({ receipt, client, invoice, quote }, ref) => {
    // Calculate totals
    const subtotal = Array.isArray(receipt.items)
      ? receipt.items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)
      : 0;
    
    const taxAmount = receipt.tax_rate ? subtotal * (receipt.tax_rate / 100) : 0;
    const totalAmount = subtotal + taxAmount;

    return (
      <div ref={ref} className="bg-white p-6 shadow-sm border rounded-lg">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">Receipt</h2>
            <p className="text-gray-600">{receipt.receipt_number}</p>
          </div>
          <div className="text-right">
            <h3 className="font-bold">From</h3>
            <p>Your Company Name</p>
            <p>123 Business Street</p>
            <p>City, State 12345</p>
          </div>
        </div>

        <div className="mb-8 flex justify-between">
          <div>
            <h3 className="font-bold mb-2">Bill To</h3>
            <p>{client?.company_name || 'Client Company'}</p>
            <p>{client?.contact_name || receipt.client_name || 'Client Name'}</p>
            <p>{client?.email || receipt.client_email || 'client@example.com'}</p>
            <p>{client?.address || 'Client Address'}</p>
            <p>{client?.city || ''} {client?.state || ''} {client?.postal_code || ''}</p>
          </div>
          <div className="text-right">
            <h3 className="font-bold mb-2">Receipt Details</h3>
            <div className="space-y-1">
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Receipt Date:</span>
                <span>{receipt.issue_date ? format(new Date(receipt.issue_date), 'MMM dd, yyyy') : format(new Date(), 'MMM dd, yyyy')}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-600">Payment Method:</span>
                <span className="capitalize">{receipt.payment_method || 'Cash'}</span>
              </div>
              {receipt.payment_reference && (
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Reference:</span>
                  <span>{receipt.payment_reference}</span>
                </div>
              )}
              {invoice && (
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Invoice:</span>
                  <span>{invoice.invoice_number}</span>
                </div>
              )}
              {quote && (
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Quote:</span>
                  <span>{quote.quote_number}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {receipt.items && receipt.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-3">{item.description}</td>
                  <td className="px-4 py-3 text-right">{item.quantity}</td>
                  <td className="px-4 py-3 text-right">{(item.unit_price || 0).toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">{((item.quantity || 0) * (item.unit_price || 0)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mb-8 flex justify-end">
          <div className="w-64">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Subtotal:</span>
              <span>{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Tax ({receipt.tax_rate || 0}%):</span>
              <span>{taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 font-bold">
              <span>Total:</span>
              <span>{totalAmount.toFixed(2)} {receipt.currency || 'USD'}</span>
            </div>
          </div>
        </div>

        {receipt.notes && (
          <div className="mb-8">
            <h3 className="font-bold mb-2">Notes</h3>
            <p className="text-gray-600">{receipt.notes}</p>
          </div>
        )}

        <div className="text-center text-sm text-gray-500 mt-10">
          <p>Thank you for your business!</p>
        </div>
      </div>
    );
  }
);

ReceiptPreview.displayName = 'ReceiptPreview';

export default ReceiptPreview;
