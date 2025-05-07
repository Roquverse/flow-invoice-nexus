
// Receipt types
export interface ReceiptItem {
  description: string;
  quantity: number;
  unit_price: number;
}

// This is the Receipt type used in ReceiptPreview component
export interface ReceiptDisplay {
  id: string;
  receipt_number: string;
  client_id: string;
  client_name: string;
  client_email: string;
  issue_date: string;
  items: ReceiptItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  payment_method: "cash" | "bank_transfer" | "credit_card" | "paypal" | "other";
  payment_reference?: string;
  currency: string;
  notes?: string;
  quote_id?: string;
  invoice_id?: string;
  reference?: string;
  date: string;
  amount: number;
}

// Export Receipt from receipts.ts to avoid duplicate definitions
export type { Receipt, ReceiptFormData } from './receipts';
