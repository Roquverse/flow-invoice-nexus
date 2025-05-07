
// Define the types for the settings module

export interface CompanySettings {
  id: string;
  user_id: string;
  company_name: string | null;
  industry: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  tax_id: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
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
  first_name?: string;
  last_name?: string;
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
  created_at: string;
  updated_at: string;
}

export interface SecuritySettings {
  id: string;
  user_id: string;
  two_factor_enabled: boolean;
  last_password_change: string | null;
  created_at: string;
  updated_at: string;
}

export interface SessionHistory {
  id: string;
  user_id: string;
  device: string | null;
  browser: string | null;
  os: string | null;
  ip_address: string | null;
  location: string | null;
  login_at: string;
  logout_at: string | null;
}

export interface ProfileFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export interface CompanyFormData {
  company_name: string;
  industry: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  tax_id: string;
  logo_url: string;
}

export interface BillingFormData {
  billing_name: string;
  billing_email: string;
}

export interface NotificationFormData {
  invoice_notifications: boolean;
  client_activity: boolean;
  project_updates: boolean;
  marketing_tips: boolean;
  email_frequency: "immediate" | "daily" | "weekly";
}

export interface SecurityFormData {
  two_factor_enabled: boolean;
}
