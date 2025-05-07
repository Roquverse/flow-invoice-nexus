
import React, { forwardRef } from 'react';
import { Receipt } from '@/types/receipts';
import { Client } from '@/types/clients';
import { Invoice } from '@/types/invoices';
import { Quote } from '@/types/quotes';
import { formatCurrency, formatDate } from '@/utils/formatters';

export interface ReceiptPreviewProps {
  receipt: Receipt;
  client: Client;
  invoice: Invoice | null;
  quote: Quote | null;
}

export const ReceiptPreview = forwardRef<HTMLDivElement, ReceiptPreviewProps>(
  ({ receipt, client, invoice, quote }, ref) => {
    return (
      <div ref={ref} className="p-6 max-w-4xl mx-auto bg-white">
        <div className="border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Receipt</h1>
          <p className="text-gray-500">{receipt.receipt_number}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">From</h2>
            <p className="text-gray-700 font-bold">Your Company</p>
            <p className="text-gray-600">123 Business St.</p>
            <p className="text-gray-600">Business City, 12345</p>
            <p className="text-gray-600">contact@yourcompany.com</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-3">To</h2>
            <p className="text-gray-700 font-bold">{client.business_name}</p>
            <p className="text-gray-600">{client.contact_name}</p>
            <p className="text-gray-600">{client.address}</p>
            <p className="text-gray-600">{client.city}, {client.postal_code}</p>
            <p className="text-gray-600">{client.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">Receipt Details</h2>
            <div className="grid grid-cols-2 gap-2">
              <p className="text-gray-600">Date:</p>
              <p className="text-gray-900">{formatDate(receipt.date)}</p>
              
              <p className="text-gray-600">Payment Method:</p>
              <p className="text-gray-900">{receipt.payment_method.replace('_', ' ')}</p>
              
              {receipt.payment_reference && (
                <>
                  <p className="text-gray-600">Reference:</p>
                  <p className="text-gray-900">{receipt.payment_reference}</p>
                </>
              )}
              
              {receipt.reference && (
                <>
                  <p className="text-gray-600">Reference:</p>
                  <p className="text-gray-900">{receipt.reference}</p>
                </>
              )}
            </div>
          </div>
          <div>
            {invoice && (
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Related Invoice</h2>
                <p className="text-gray-600">Invoice #{invoice.invoice_number}</p>
                <p className="text-gray-600">Date: {formatDate(invoice.issue_date)}</p>
              </div>
            )}
            
            {quote && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Related Quote</h2>
                <p className="text-gray-600">Quote #{quote.quote_number}</p>
                <p className="text-gray-600">Date: {formatDate(quote.issue_date)}</p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t pt-6 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Payment Amount</h2>
            <p className="text-2xl font-bold">{formatCurrency(receipt.amount, receipt.currency)}</p>
          </div>
          
          {receipt.notes && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Notes</h3>
              <p className="text-gray-700">{receipt.notes}</p>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Thank you for your payment!</p>
        </div>
      </div>
    );
  }
);

ReceiptPreview.displayName = 'ReceiptPreview';
