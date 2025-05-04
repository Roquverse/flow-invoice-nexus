// Client entity type
export interface Client {
  id: string;
  user_id: string;
  business_name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  tax_id?: string;
  notes?: string;
  status: "active" | "inactive" | "archived";
  created_at: string;
  updated_at: string;
}

// Form data for client creation and updates
export interface ClientFormData {
  business_name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  tax_id?: string;
  notes?: string;
  status?: "active" | "inactive" | "archived";
}
