// Receipt entity type
export interface Receipt {
  id: string;
  user_id: string;
  client_id: string;
  invoice_id?: string;
  receipt_number: string;
  reference?: string;
  date: string;
  amount: number;
  payment_method: "cash" | "bank_transfer" | "credit_card" | "paypal" | "other";
  payment_reference?: string;
  notes?: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

// Form data for receipt creation and updates
export interface ReceiptFormData {
  client_id: string;
  invoice_id?: string;
  receipt_number?: string; // Auto-generated if not provided
  reference?: string;
  date: string;
  amount: number;
  payment_method: "cash" | "bank_transfer" | "credit_card" | "paypal" | "other";
  payment_reference?: string;
  notes?: string;
  currency: string;
}
