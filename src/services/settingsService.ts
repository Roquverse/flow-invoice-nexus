import { supabase } from "@/integrations/supabase/client";
import {
  UserProfile,
  CompanySettings,
  BillingSettings,
  PaymentMethod,
  NotificationPreferences,
  SecuritySettings,
  SessionHistory,
  ProfileFormData,
  CompanyFormData,
  BillingFormData,
  NotificationFormData,
  SecurityFormData,
} from "@/types/settings";

// =========== USER PROFILE ===========
export async function getUserProfile(): Promise<UserProfile | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  const { data, error } = await supabase
    .from("settings.user_profiles")
    .select("*")
    .eq("id", user.user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return data;
}

export async function updateUserProfile(
  profile: ProfileFormData
): Promise<UserProfile | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  // Check if profile exists
  const { data: existingProfile } = await supabase
    .from("settings.user_profiles")
    .select("id")
    .eq("id", user.user.id)
    .single();

  let result;

  if (existingProfile) {
    // Update existing profile
    result = await supabase
      .from("settings.user_profiles")
      .update(profile)
      .eq("id", user.user.id)
      .select();
  } else {
    // Insert new profile
    result = await supabase
      .from("settings.user_profiles")
      .insert({
        id: user.user.id,
        ...profile,
      })
      .select();
  }

  if (result.error) {
    console.error("Error updating user profile:", result.error);
    return null;
  }

  return result.data?.[0] || null;
}

// =========== COMPANY SETTINGS ===========
export async function getCompanySettings(): Promise<CompanySettings | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  const { data, error } = await supabase
    .from("settings.company_settings")
    .select("*")
    .eq("user_id", user.user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 means no results
    console.error("Error fetching company settings:", error);
    return null;
  }

  return data;
}

export async function updateCompanySettings(
  settings: CompanyFormData
): Promise<CompanySettings | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  // Check if settings exist
  const { data: existingSettings } = await supabase
    .from("settings.company_settings")
    .select("id")
    .eq("user_id", user.user.id)
    .single();

  let result;

  if (existingSettings) {
    // Update existing settings
    result = await supabase
      .from("settings.company_settings")
      .update(settings)
      .eq("user_id", user.user.id)
      .select();
  } else {
    // Insert new settings
    result = await supabase
      .from("settings.company_settings")
      .insert({
        user_id: user.user.id,
        ...settings,
      })
      .select();
  }

  if (result.error) {
    console.error("Error updating company settings:", result.error);
    return null;
  }

  return result.data?.[0] || null;
}

// =========== BILLING SETTINGS ===========
export async function getBillingSettings(): Promise<BillingSettings | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  const { data, error } = await supabase
    .from("settings.billing_settings")
    .select("*")
    .eq("user_id", user.user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching billing settings:", error);
    return null;
  }

  return data;
}

export async function updateBillingSettings(
  settings: BillingFormData
): Promise<BillingSettings | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  // Check if settings exist
  const { data: existingSettings } = await supabase
    .from("settings.billing_settings")
    .select("id")
    .eq("user_id", user.user.id)
    .single();

  let result;

  if (existingSettings) {
    // Update existing settings
    result = await supabase
      .from("settings.billing_settings")
      .update(settings)
      .eq("user_id", user.user.id)
      .select();
  } else {
    // Insert new settings with defaults
    result = await supabase
      .from("settings.billing_settings")
      .insert({
        user_id: user.user.id,
        subscription_plan: "free",
        subscription_status: "active",
        ...settings,
      })
      .select();
  }

  if (result.error) {
    console.error("Error updating billing settings:", result.error);
    return null;
  }

  return result.data?.[0] || null;
}

// =========== PAYMENT METHODS ===========
export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return [];

  const { data, error } = await supabase
    .from("settings.payment_methods")
    .select("*")
    .eq("user_id", user.user.id)
    .order("is_default", { ascending: false });

  if (error) {
    console.error("Error fetching payment methods:", error);
    return [];
  }

  return data || [];
}

export async function addPaymentMethod(
  method: Omit<PaymentMethod, "id" | "user_id" | "created_at" | "updated_at">
): Promise<PaymentMethod | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  // If this is marked as default, unset others
  if (method.is_default) {
    await supabase
      .from("settings.payment_methods")
      .update({ is_default: false })
      .eq("user_id", user.user.id);
  }

  const { data, error } = await supabase
    .from("settings.payment_methods")
    .insert({
      user_id: user.user.id,
      ...method,
    })
    .select();

  if (error) {
    console.error("Error adding payment method:", error);
    return null;
  }

  return data?.[0] || null;
}

export async function deletePaymentMethod(id: string): Promise<boolean> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return false;

  const { error } = await supabase
    .from("settings.payment_methods")
    .delete()
    .eq("id", id)
    .eq("user_id", user.user.id);

  if (error) {
    console.error("Error deleting payment method:", error);
    return false;
  }

  return true;
}

// =========== NOTIFICATION PREFERENCES ===========
export async function getNotificationPreferences(): Promise<NotificationPreferences | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  const { data, error } = await supabase
    .from("settings.notification_preferences")
    .select("*")
    .eq("user_id", user.user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching notification preferences:", error);
    return null;
  }

  return data;
}

export async function updateNotificationPreferences(
  preferences: NotificationFormData
): Promise<NotificationPreferences | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  // Check if preferences exist
  const { data: existingPreferences } = await supabase
    .from("settings.notification_preferences")
    .select("id")
    .eq("user_id", user.user.id)
    .single();

  let result;

  if (existingPreferences) {
    // Update existing preferences
    result = await supabase
      .from("settings.notification_preferences")
      .update(preferences)
      .eq("user_id", user.user.id)
      .select();
  } else {
    // Insert new preferences
    result = await supabase
      .from("settings.notification_preferences")
      .insert({
        user_id: user.user.id,
        ...preferences,
      })
      .select();
  }

  if (result.error) {
    console.error("Error updating notification preferences:", result.error);
    return null;
  }

  return result.data?.[0] || null;
}

// =========== SECURITY SETTINGS ===========
export async function getSecuritySettings(): Promise<SecuritySettings | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  const { data, error } = await supabase
    .from("settings.security_settings")
    .select("*")
    .eq("user_id", user.user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching security settings:", error);
    return null;
  }

  return data;
}

export async function updateSecuritySettings(
  settings: Omit<
    SecurityFormData,
    "current_password" | "new_password" | "confirm_password"
  >
): Promise<SecuritySettings | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  // Check if settings exist
  const { data: existingSettings } = await supabase
    .from("settings.security_settings")
    .select("id")
    .eq("user_id", user.user.id)
    .single();

  let result;

  if (existingSettings) {
    // Update existing settings
    result = await supabase
      .from("settings.security_settings")
      .update(settings)
      .eq("user_id", user.user.id)
      .select();
  } else {
    // Insert new settings
    result = await supabase
      .from("settings.security_settings")
      .insert({
        user_id: user.user.id,
        ...settings,
      })
      .select();
  }

  if (result.error) {
    console.error("Error updating security settings:", result.error);
    return null;
  }

  return result.data?.[0] || null;
}

export async function updatePassword(
  currentPassword: string,
  newPassword: string
): Promise<boolean> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error("Error updating password:", error);
      return false;
    }

    // Update the last_password_change field
    const { data: user } = await supabase.auth.getUser();

    if (user.user) {
      await supabase.from("settings.security_settings").upsert(
        {
          user_id: user.user.id,
          last_password_change: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
    }

    return true;
  } catch (error) {
    console.error("Error updating password:", error);
    return false;
  }
}

// =========== SESSION HISTORY ===========
export async function getSessionHistory(): Promise<SessionHistory[]> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return [];

  const { data, error } = await supabase
    .from("settings.session_history")
    .select("*")
    .eq("user_id", user.user.id)
    .order("login_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching session history:", error);
    return [];
  }

  return data || [];
}

export async function recordSessionLogin(
  sessionInfo: Partial<SessionHistory>
): Promise<boolean> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return false;

  const { error } = await supabase.from("settings.session_history").insert({
    user_id: user.user.id,
    login_at: new Date().toISOString(),
    ...sessionInfo,
  });

  if (error) {
    console.error("Error recording session login:", error);
    return false;
  }

  return true;
}

export async function recordSessionLogout(sessionId: string): Promise<boolean> {
  const { error } = await supabase
    .from("settings.session_history")
    .update({
      logout_at: new Date().toISOString(),
    })
    .eq("id", sessionId);

  if (error) {
    console.error("Error recording session logout:", error);
    return false;
  }

  return true;
}
