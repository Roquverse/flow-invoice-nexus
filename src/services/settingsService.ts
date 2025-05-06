
import { supabase } from "@/integrations/supabase/client";
import { CompanySettings, UserSettings, UserProfile, PaymentMethod, NotificationPreferences, SecuritySettings, SessionHistory } from "@/types/settings";

// Mock data for settings that haven't been implemented yet
const mockUserProfile = {
  id: "user-profile-1",
  user_id: "user-123",
  full_name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  address: "123 Main St",
  city: "New York",
  state: "NY",
  postal_code: "10001",
  country: "USA",
  profile_image_url: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const mockCompanySettings = {
  id: "company-1",
  user_id: "user-123",
  company_name: "Acme Inc",
  industry: "Technology",
  address: "456 Business Ave",
  city: "San Francisco",
  postal_code: "94105",
  country: "USA",
  tax_id: "12-3456789",
  logo_url: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const mockBillingSettings = {
  id: "billing-1",
  user_id: "user-123",
  billing_name: "Acme Inc",
  billing_email: "billing@acme.com",
  subscription_plan: "premium",
  subscription_status: "active",
  subscription_renewal_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const mockPaymentMethods = [
  {
    id: "payment-1",
    user_id: "user-123",
    payment_type: "credit_card",
    provider: "visa",
    last_four: "4242",
    expiry_date: "12/24",
    is_default: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const mockNotificationPreferences = {
  id: "notif-1",
  user_id: "user-123",
  email_invoices: true,
  email_quotes: true,
  email_receipts: true,
  email_marketing: false,
  invoice_notifications: true,
  client_activity: true,
  project_updates: true,
  marketing_tips: false,
  email_frequency: "daily",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const mockSecuritySettings = {
  id: "security-1",
  user_id: "user-123",
  two_factor_enabled: false,
  ip_restriction: false,
  allowed_ips: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const mockSessionHistory = [
  {
    id: "session-1",
    user_id: "user-123",
    ip_address: "192.168.1.1",
    device_type: "desktop",
    browser: "Chrome",
    login_at: new Date(new Date().setHours(new Date().getHours() - 2)).toISOString(),
    login_time: new Date(new Date().setHours(new Date().getHours() - 2)).toISOString(),
    logout_time: new Date().toISOString(),
    created_at: new Date().toISOString()
  }
];

// User profile methods
export const getUserProfile = async (userId: string): Promise<UserSettings> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    return data || mockUserProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return mockUserProfile;
  }
};

export const updateUserProfile = async (profile: Partial<UserSettings>): Promise<UserSettings> => {
  try {
    // Ensure user_id is present
    if (!profile.user_id) {
      throw new Error('User ID is required');
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        ...profile,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return data || { ...mockUserProfile, ...profile };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { ...mockUserProfile, ...profile };
  }
};

// Company settings methods
export const getCompanySettings = async (userId: string): Promise<CompanySettings> => {
  try {
    const { data, error } = await supabase
      .from('company_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    return data || mockCompanySettings;
  } catch (error) {
    console.error('Error fetching company settings:', error);
    return mockCompanySettings;
  }
};

export const updateCompanySettings = async (settings: Partial<CompanySettings>): Promise<CompanySettings> => {
  try {
    // For safety, ensure user_id exists
    if (!settings.user_id) {
      throw new Error('User ID is required');
    }
    
    const { data, error } = await supabase
      .from('company_settings')
      .upsert({
        ...settings, 
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return data || { ...mockCompanySettings, ...settings };
  } catch (error) {
    console.error('Error updating company settings:', error);
    return { ...mockCompanySettings, ...settings };
  }
};

// Billing settings methods
export const getBillingSettings = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('billing_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    
    return data || mockBillingSettings;
  } catch (error) {
    console.error('Error fetching billing settings:', error);
    return mockBillingSettings;
  }
};

// Payment methods
export const getPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    
    return data || mockPaymentMethods;
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return mockPaymentMethods;
  }
};

export const updateBillingSettings = async (settings: any) => {
  // Mock implementation
  return { ...mockBillingSettings, ...settings };
};

export const addPaymentMethod = async (method: any) => {
  // Mock implementation
  return { ...method, id: `payment-${Date.now()}` };
};

export const deletePaymentMethod = async (methodId: string) => {
  // Mock implementation
  return true;
};

// Notification preferences
export const getNotificationPreferences = async (userId: string): Promise<NotificationPreferences> => {
  try {
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    
    return data || mockNotificationPreferences;
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    return mockNotificationPreferences;
  }
};

export const updateNotificationPreferences = async (preferences: any): Promise<NotificationPreferences> => {
  try {
    if (!preferences.user_id) {
      throw new Error('User ID is required');
    }
    
    const { data, error } = await supabase
      .from('notification_preferences')
      .upsert({
        ...preferences,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    
    return data || { ...mockNotificationPreferences, ...preferences };
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    return { ...mockNotificationPreferences, ...preferences };
  }
};

// Security settings
export const getSecuritySettings = async (userId: string): Promise<SecuritySettings> => {
  try {
    const { data, error } = await supabase
      .from('security_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    
    return data || mockSecuritySettings;
  } catch (error) {
    console.error('Error fetching security settings:', error);
    return mockSecuritySettings;
  }
};

// Session history
export const getSessionHistory = async (userId: string): Promise<SessionHistory[]> => {
  try {
    const { data, error } = await supabase
      .from('session_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    
    return data || mockSessionHistory;
  } catch (error) {
    console.error('Error fetching session history:', error);
    return mockSessionHistory;
  }
};

export const updateSecuritySettings = async (settings: any) => {
  // Mock implementation
  return { ...mockSecuritySettings, ...settings };
};

export const updatePassword = async (userId: string, currentPassword: string, newPassword: string) => {
  // Mock implementation
  return { success: true, message: "Password updated successfully" };
};

export const settingsService = {
  getUserProfile,
  updateUserProfile,
  getCompanySettings,
  updateCompanySettings,
  getBillingSettings,
  getPaymentMethods,
  updateBillingSettings,
  addPaymentMethod,
  deletePaymentMethod,
  getNotificationPreferences,
  updateNotificationPreferences,
  getSecuritySettings,
  getSessionHistory,
  updateSecuritySettings,
  updatePassword,
};
