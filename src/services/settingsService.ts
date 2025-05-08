import { supabase } from "@/integrations/supabase/client";
import {
  CompanySettings,
  UserSettings,
  UserProfile,
  PaymentMethod,
  NotificationPreferences,
  SecuritySettings,
  SessionHistory,
} from "@/types/settings";

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
  updated_at: new Date().toISOString(),
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
  updated_at: new Date().toISOString(),
};

const mockBillingSettings = {
  id: "billing-1",
  user_id: "user-123",
  billing_name: "Acme Inc",
  billing_email: "billing@acme.com",
  subscription_plan: "premium",
  subscription_status: "active",
  subscription_renewal_date: new Date(
    new Date().setMonth(new Date().getMonth() + 1)
  ).toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
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
    updated_at: new Date().toISOString(),
  },
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
  email_frequency: "daily" as "immediate" | "daily" | "weekly",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const mockSecuritySettings = {
  id: "security-1",
  user_id: "user-123",
  two_factor_enabled: false,
  ip_restriction: false,
  allowed_ips: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const mockSessionHistory = [
  {
    id: "session-1",
    user_id: "user-123",
    ip_address: "192.168.1.1",
    device_type: "desktop",
    browser: "Chrome",
    login_at: new Date(
      new Date().setHours(new Date().getHours() - 2)
    ).toISOString(),
    login_time: new Date(
      new Date().setHours(new Date().getHours() - 2)
    ).toISOString(),
    logout_time: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
];

// User profile methods
export const getUserProfile = async (userId: string): Promise<UserSettings> => {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;

    // Transform the profile data to match UserSettings interface
    const userSettings: UserSettings = {
      id: data.id,
      user_id: data.id, // In user_profiles table, id is the user_id
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      email: data.email,
      phone: data.phone || "",
      address: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      profile_image_url: data.avatar_url,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    return userSettings;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    // Create a mock profile with the provided user ID
    return {
      ...mockUserProfile,
      id: userId,
      user_id: userId,
    };
  }
};

export const updateUserProfile = async (
  profile: Partial<UserSettings>
): Promise<UserSettings> => {
  try {
    // Ensure user_id is present
    if (!profile.user_id) {
      throw new Error("User ID is required");
    }

    console.log("Updating profile with:", {
      id: profile.user_id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      email: profile.email,
      phone: profile.phone,
      avatar_url: profile.profile_image_url,
    });

    // Transform UserSettings to match user_profiles table structure
    const userProfileData = {
      id: profile.user_id, // In user_profiles table, id is the user_id
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      avatar_url: profile.profile_image_url,
    };

    // First try to insert, if that fails (due to existing record), then update
    const { data: updatedProfile, error: profileError } = await supabase
      .from("user_profiles")
      .upsert(userProfileData, {
        onConflict: "id",
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (profileError) {
      console.error("Error updating profile:", profileError);
      throw profileError;
    }

    console.log("Profile updated successfully:", updatedProfile);

    // Transform back to UserSettings format
    return {
      id: updatedProfile.id,
      user_id: updatedProfile.id,
      first_name: updatedProfile.first_name || "",
      last_name: updatedProfile.last_name || "",
      email: updatedProfile.email,
      phone: updatedProfile.phone || "",
      address: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      profile_image_url: updatedProfile.avatar_url,
      created_at: updatedProfile.created_at,
      updated_at: updatedProfile.updated_at,
    };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { ...mockUserProfile, ...profile };
  }
};

// Company settings methods
export const getCompanySettings = async (
  userId: string
): Promise<CompanySettings> => {
  try {
    const { data, error } = await supabase
      .from("company_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) throw error;

    return (
      data || {
        id: "",
        user_id: userId,
        company_name: null,
        industry: null,
        address: null,
        city: null,
        postal_code: null,
        country: null,
        tax_id: null,
        logo_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error("Error fetching company settings:", error);
    throw error;
  }
};

export const updateCompanySettings = async (
  settings: Partial<CompanySettings> & { user_id: string }
): Promise<CompanySettings> => {
  try {
    const { data, error } = await supabase
      .from("company_settings")
      .upsert({
        ...settings,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error updating company settings:", error);
    throw error;
  }
};

// Billing settings methods
export const getBillingSettings = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("billing_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) throw error;

    return data || mockBillingSettings;
  } catch (error) {
    console.error("Error fetching billing settings:", error);
    return mockBillingSettings;
  }
};

// Payment methods
export const getPaymentMethods = async (
  userId: string
): Promise<PaymentMethod[]> => {
  try {
    const { data, error } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;

    return data || mockPaymentMethods;
  } catch (error) {
    console.error("Error fetching payment methods:", error);
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
export const getNotificationPreferences = async (
  userId: string
): Promise<NotificationPreferences> => {
  try {
    const { data, error } = await supabase
      .from("notification_preferences")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) throw error;

    // Convert string email_frequency to the proper union type
    let emailFreq: "immediate" | "daily" | "weekly" = "immediate";
    if (data?.email_frequency === "daily") emailFreq = "daily";
    if (data?.email_frequency === "weekly") emailFreq = "weekly";

    return data ? {
      ...data,
      email_frequency: emailFreq
    } : {
      id: "",
      user_id: userId,
      invoice_notifications: true,
      client_activity: true,
      project_updates: false,
      marketing_tips: false,
      email_frequency: "immediate",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching notification preferences:", error);
    throw error;
  }
};

export const updateNotificationPreferences = async (
  preferences: Partial<NotificationPreferences> & { user_id: string }
): Promise<NotificationPreferences> => {
  try {
    // Ensure email_frequency is a valid value
    let emailFreq: "immediate" | "daily" | "weekly" = "immediate";
    if (preferences.email_frequency === "daily") emailFreq = "daily";
    if (preferences.email_frequency === "weekly") emailFreq = "weekly";
    
    const updatedPreferences = {
      ...preferences,
      email_frequency: emailFreq
    };

    const { data, error } = await supabase
      .from("notification_preferences")
      .upsert({
        ...updatedPreferences,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      email_frequency: data.email_frequency as "immediate" | "daily" | "weekly"
    };
  } catch (error) {
    console.error("Error updating notification preferences:", error);
    throw error;
  }
};

// Security settings
export const getSecuritySettings = async (
  userId: string
): Promise<SecuritySettings> => {
  try {
    const { data, error } = await supabase
      .from("security_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) throw error;

    return (
      data || {
        id: "",
        user_id: userId,
        two_factor_enabled: false,
        last_password_change: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error("Error fetching security settings:", error);
    throw error;
  }
};

// Session history
export const getSessionHistory = async (
  userId: string
): Promise<SessionHistory[]> => {
  try {
    const { data, error } = await supabase
      .from("session_history")
      .select("*")
      .eq("user_id", userId)
      .order("login_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Error fetching session history:", error);
    throw error;
  }
};

export const updateSecuritySettings = async (
  settings: Partial<SecuritySettings> & { user_id: string }
): Promise<SecuritySettings> => {
  try {
    const { data, error } = await supabase
      .from("security_settings")
      .upsert({
        ...settings,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error updating security settings:", error);
    throw error;
  }
};

// Password update
export const updatePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    // First verify the current password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: userId, // Assuming userId is the email
      password: currentPassword,
    });

    if (signInError) {
      return {
        success: false,
        message: "Current password is incorrect",
      };
    }

    // Update the password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      return {
        success: false,
        message: "Failed to update password",
      };
    }

    // Update last_password_change in security_settings
    await supabase
      .from("security_settings")
      .upsert({
        user_id: userId,
        last_password_change: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    return {
      success: true,
      message: "Password updated successfully",
    };
  } catch (error) {
    console.error("Error updating password:", error);
    return {
      success: false,
      message: "An error occurred while updating password",
    };
  }
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
