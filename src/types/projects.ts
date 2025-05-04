// Project entity type
export interface Project {
  id: string;
  user_id: string;
  client_id: string | null;
  name: string;
  description?: string;
  status: "active" | "completed" | "on-hold" | "cancelled";
  start_date?: string;
  end_date?: string;
  budget?: number;
  currency: string;
  hourly_rate?: number;
  is_fixed_price: boolean;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

// Client basic info for dropdown selection
export interface ClientBasicInfo {
  id: string;
  business_name: string;
}

// Form data for project creation and updates
export interface ProjectFormData {
  name: string;
  client_id?: string;
  description?: string;
  status?: "active" | "completed" | "on-hold" | "cancelled";
  start_date?: string;
  end_date?: string;
  budget?: number;
  currency?: string;
  hourly_rate?: number;
  is_fixed_price?: boolean;
  tags?: string[];
}
