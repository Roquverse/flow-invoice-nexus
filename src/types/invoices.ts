
// Invoice entity type
export interface Invoice {
  id: string;
  user_id: string;
  client_id: string;
  project_id?: string;
  invoice_number: string;
  reference?: string;
  issue_date: string;
  due_date: string;
  status: "draft" | "sent" | "viewed" | "paid" | "overdue" | "cancelled";
  total_amount: number;
  tax_amount?: number;
  discount_amount?: number;
  currency: string;
  notes?: string;
  terms?: string;
  footer?: string;
  created_at: string;
  updated_at: string;
  // Additional fields needed for forms
  subtotal?: number;
  tax_rate?: number;
  items?: InvoiceItem[];
}

// Invoice item entity type
export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate?: number;
  discount_rate?: number;
  amount: number; // quantity * unit_price
  created_at: string;
  updated_at: string;
  total?: number; // Additional field for convenience
}

// Form data for invoice creation and updates
export interface InvoiceFormData {
  client_id: string;
  project_id?: string;
  invoice_number?: string; // Auto-generated if not provided
  reference?: string;
  issue_date: string;
  due_date: string;
  status?: "draft" | "sent" | "viewed" | "paid" | "overdue" | "cancelled";
  currency: string;
  notes?: string;
  terms?: string;
  footer?: string;
  items: InvoiceItemFormData[];
  tax_amount?: number;
  discount_amount?: number;
  subtotal?: number;
  tax_rate?: number;
  total_amount?: number;
}

// Form data for invoice item creation and updates
export interface InvoiceItemFormData {
  id?: string; // Only for existing items
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate?: number;
  discount_rate?: number;
  total?: number; // For convenience
}
