export interface UserProfile {
  id?: string;
  user_id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CompanySettings {
  id?: string;
  user_id?: string;
  company_name?: string;
  logo_url?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  tax_id?: string;
  vat_number?: string;
  registration_number?: string;
  default_currency?: string;
  default_tax_rate?: number;
  payment_terms?: number;
  payment_instructions?: string;
  invoice_prefix?: string;
  quote_prefix?: string;
  receipt_prefix?: string;
  invoice_notes?: string;
  quote_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BillingFormData {
  id?: string;
  user_id?: string;
  billing_name?: string;
  billing_email?: string;
  subscription_plan?: string;
  subscription_status?: string;
  subscription_renewal_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentMethod {
  id?: string;
  user_id: string;
  payment_type: string; // 'credit_card', 'paypal', etc.
  provider: string; // 'visa', 'mastercard', 'paypal', etc.
  last_four?: string;
  expiry_date?: string;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BillingSettings {
  id?: string;
  user_id?: string;
  billing_name?: string;
  billing_email?: string;
  subscription_plan?: string;
  subscription_status?: string;
  subscription_renewal_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface NotificationPreferences {
  id?: string;
  user_id?: string;
  invoice_notifications?: boolean;
  client_activity?: boolean;
  project_updates?: boolean;
  marketing_tips?: boolean;
  email_frequency?: 'immediate' | 'daily' | 'weekly';
  created_at?: string;
  updated_at?: string;
}

export interface SecuritySettings {
  id?: string;
  user_id?: string;
  two_factor_enabled?: boolean;
  last_password_change?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SessionHistory {
  id?: string;
  user_id?: string;
  ip_address?: string;
  device?: string;
  browser?: string;
  login_at: string;
  logout_at?: string;
  os?: string;
  location?: string;
}

export interface UserSettings {
  id?: string;
  user_id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  profile_image_url?: string;
  created_at?: string;
  updated_at?: string;
}
