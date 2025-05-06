
// Define the types for the settings module

export interface CompanySettings {
  id?: string;
  user_id: string;
  company_name?: string;
  industry?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  tax_id?: string;
  logo_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id?: string;
  user_id: string;
  full_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  profile_image_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentMethod {
  id: string;
  user_id: string;
  payment_type: string;
  provider: string;
  last_four: string;
  expiry_date?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreferences {
  id: string;
  user_id: string;
  invoice_notifications: boolean;
  client_activity: boolean;
  project_updates: boolean;
  marketing_tips: boolean;
  email_frequency: string;
  email_invoices: boolean;
  email_quotes: boolean;
  email_receipts: boolean;
  email_marketing: boolean;
  created_at: string;
  updated_at: string;
}

export interface SecuritySettings {
  id: string;
  user_id: string;
  two_factor_enabled: boolean;
  ip_restriction: boolean;
  allowed_ips: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface SessionHistory {
  id: string;
  user_id: string;
  ip_address: string;
  device_type: string;
  browser: string;
  login_at: string;
  login_time?: string;
  logout_time?: string;
  created_at: string;
}
