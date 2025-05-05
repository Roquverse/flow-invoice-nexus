
// Quote entity type
export interface Quote {
  id: string;
  user_id: string;
  client_id: string;
  project_id?: string;
  quote_number: string;
  reference?: string;
  issue_date: string;
  expiry_date: string;
  status: "draft" | "sent" | "viewed" | "accepted" | "rejected" | "expired";
  total_amount: number;
  tax_amount?: number;
  discount_amount?: number;
  currency: string;
  notes?: string;
  terms?: string;
  footer?: string;
  created_at: string;
  updated_at: string;
  // Additional fields for forms
  subtotal?: number;
  tax_rate?: number;
  items?: QuoteItem[];
}

// Quote item entity type
export interface QuoteItem {
  id: string;
  quote_id: string;
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

// Form data for quote creation and updates
export interface QuoteFormData {
  client_id: string;
  project_id?: string;
  quote_number?: string; // Auto-generated if not provided
  reference?: string;
  issue_date: string;
  expiry_date: string;
  status?: "draft" | "sent" | "viewed" | "accepted" | "rejected" | "expired";
  currency: string;
  notes?: string;
  terms?: string;
  footer?: string;
  items: QuoteItemFormData[];
  tax_amount?: number;
  discount_amount?: number;
  subtotal?: number;
  tax_rate?: number;
  total_amount?: number;
}

// Form data for quote item creation and updates
export interface QuoteItemFormData {
  id?: string; // Only for existing items
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate?: number;
  discount_rate?: number;
  total?: number; // For convenience
}
