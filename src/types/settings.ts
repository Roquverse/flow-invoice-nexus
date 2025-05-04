export interface UserProfile {
  id: string; // UUID from auth.users
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CompanySettings {
  id: string; // UUID
  user_id: string; // UUID from auth.users
  company_name?: string;
  industry?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  tax_id?: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface BillingSettings {
  id: string; // UUID
  user_id: string; // UUID from auth.users
  billing_name?: string;
  billing_email?: string;
  subscription_plan: string; // 'free', 'pro', etc.
  subscription_status: string; // 'active', 'canceled', etc.
  subscription_renewal_date?: string; // ISO date string
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  id: string; // UUID
  user_id: string; // UUID from auth.users
  payment_type: string; // 'credit_card', 'bank_account', etc.
  provider: string; // 'visa', 'mastercard', 'stripe', etc.
  last_four?: string; // Last four digits of card or account
  expiry_date?: string; // ISO date string
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreferences {
  id: string; // UUID
  user_id: string; // UUID from auth.users
  invoice_notifications: boolean;
  client_activity: boolean;
  project_updates: boolean;
  marketing_tips: boolean;
  email_frequency: "immediate" | "daily" | "weekly";
  created_at: string;
  updated_at: string;
}

export interface SecuritySettings {
  id: string; // UUID
  user_id: string; // UUID from auth.users
  two_factor_enabled: boolean;
  last_password_change?: string; // ISO date string
  created_at: string;
  updated_at: string;
}

export interface SessionHistory {
  id: string; // UUID
  user_id: string; // UUID from auth.users
  device?: string;
  browser?: string;
  os?: string;
  ip_address?: string;
  location?: string;
  login_at: string; // ISO date string
  logout_at?: string; // ISO date string
}

// Form interfaces for updating settings
export interface ProfileFormData {
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
}

export interface CompanyFormData {
  company_name?: string;
  industry?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  tax_id?: string;
}

export interface BillingFormData {
  billing_name?: string;
  billing_email?: string;
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
  current_password?: string;
  new_password?: string;
  confirm_password?: string;
}
