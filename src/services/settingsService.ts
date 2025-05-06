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
import { toast } from "sonner";

// Enhanced debug function to check tables and auth
export async function debugDatabaseStatus() {
  const result = {
    auth: null,
    tables: {},
    error: null,
  };

  try {
    // Check auth status
    const { data: authData, error: authError } = await supabase.auth.getUser();
    result.auth = {
      isAuthenticated: !!authData?.user,
      user: authData?.user,
      error: authError,
    };

    // Try to list tables
    const tables = [
      "user_profiles",
      "company_settings",
      "billing_settings",
      "payment_methods",
      "notification_preferences",
      "security_settings",
      "session_history",
    ];

    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select("*").limit(1);

        result.tables[table] = {
          exists: !error,
          error: error,
        };
      } catch (e) {
        result.tables[table] = {
          exists: false,
          error: e,
        };
      }
    }

    return result;
  } catch (e) {
    result.error = e;
    return result;
  }
}

// =========== USER PROFILE ===========
export async function getUserProfile(): Promise<UserProfile | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  try {
    // First check if profile exists
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.user.id)
      .single();

    if (error) {
      // No result found or other error - try to create profile
      if (error.code === "PGRST116") {
        console.log("No user profile found, attempting to create one");

        // Get user data for email
        const { data: userData } = await supabase.auth.getUser();

        if (!userData.user?.email) {
          console.error("Cannot create profile: No user email available");
          return null;
        }

        // Use upsert with onConflict to handle race conditions
        const { data: newProfile, error: upsertError } = await supabase
          .from("user_profiles")
          .upsert(
            {
              id: user.user.id,
              email: userData.user.email,
              first_name: "",
              last_name: "",
            },
            {
              onConflict: "id",
              ignoreDuplicates: false,
            }
          )
          .select()
          .single();

        if (upsertError) {
          console.error("Error creating user profile:", upsertError);

          // If it was a conflict error, try one more time to fetch the profile
          if (upsertError.code === "23505" || upsertError.code === "409") {
            const { data: existingProfile } = await supabase
              .from("user_profiles")
              .select("*")
              .eq("id", user.user.id)
              .single();

            return existingProfile;
          }

          return null;
        }

        return newProfile;
      } else {
        console.error("Error fetching user profile:", error);
        return null;
      }
    }

    return data;
  } catch (e) {
    console.error("Error accessing user_profiles:", e);
    return null;
  }
}

export async function updateUserProfile(
  profile: ProfileFormData
): Promise<UserProfile | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  try {
    // First, check if we need to create or update by checking if profile exists
    const { data: existing, error: checkError } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("id", user.user.id)
      .maybeSingle();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking profile existence:", checkError);
      return null;
    }

    let result;

    if (existing) {
      // Update existing profile
      result = await supabase
        .from("user_profiles")
        .update({
          first_name: profile.first_name || null,
          last_name: profile.last_name || null,
          email: profile.email,
          phone: profile.phone || null,
        })
        .eq("id", user.user.id)
        .select("*")
        .single();
    } else {
      // Insert new profile
      result = await supabase
        .from("user_profiles")
        .insert({
          id: user.user.id,
          email: profile.email,
          first_name: profile.first_name || null,
          last_name: profile.last_name || null,
          phone: profile.phone || null,
        })
        .select("*")
        .single();
    }

    if (result.error) {
      console.error("Error updating user profile:", result.error);
      return null;
    }

    return result.data;
  } catch (e) {
    console.error("Error updating user profile:", e);
    return null;
  }
}

// =========== COMPANY SETTINGS ===========
export const getCompanySettings = async (): Promise<CompanySettings | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("company_settings")
      .select("*")
      .eq("user_id", user.user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No company settings found
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching company settings:", error);
    toast.error("Failed to load company settings");
    return null;
  }
};

export async function updateCompanySettings(
  settings: CompanyFormData
): Promise<CompanySettings | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  try {
    // Check if settings exist
    const { data: existingSettings } = await supabase
      .from("company_settings")
      .select("*")
      .eq("user_id", user.user.id)
      .single();

    let result;

    // Include logo_url in settings
    const updatedSettings = {
      ...settings,
      // If logo_url is empty string, set to null for the database
      logo_url: settings.logo_url || null,
    };

    if (existingSettings) {
      // Update existing settings
      result = await supabase
        .from("company_settings")
        .update(updatedSettings)
        .eq("user_id", user.user.id)
        .select();
    } else {
      // Insert new settings
      result = await supabase
        .from("company_settings")
        .insert({
          user_id: user.user.id,
          ...updatedSettings,
        })
        .select();
    }

    if (result.error) {
      console.error("Error updating company settings:", result.error);
      return null;
    }

    return result.data?.[0] || null;
  } catch (e) {
    console.error("Error accessing schema:", e);
    return null;
  }
}

// =========== BILLING SETTINGS ===========
export async function getBillingSettings(): Promise<BillingSettings | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  try {
    const { data, error } = await supabase
      .from("billing_settings")
      .select("*")
      .eq("user_id", user.user.id)
      .single();

    if (error) {
      // No result found - create a new billing record
      if (error.code === "PGRST116") {
        console.log("No billing settings found, creating default");

        const { data: newSettings, error: createError } = await supabase
          .from("billing_settings")
          .upsert(
            {
              user_id: user.user.id,
              billing_name: "",
              billing_email: user.user.email || "",
              subscription_plan: "free",
              subscription_status: "active",
            },
            {
              onConflict: "user_id",
              ignoreDuplicates: false,
            }
          )
          .select()
          .single();

        if (createError) {
          console.error("Error creating billing settings:", createError);
          return null;
        }

        return newSettings;
      } else {
        console.error("Error fetching billing settings:", error);
        return null;
      }
    }

    return data;
  } catch (e) {
    console.error("Error accessing billing_settings:", e);
    return null;
  }
}

export async function updateBillingSettings(
  settings: BillingFormData
): Promise<BillingSettings | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  try {
    // Check if settings exist
    const { data: existingSettings } = await supabase
      .from("billing_settings")
      .select("id")
      .eq("user_id", user.user.id)
      .single();

    let result;

    if (existingSettings) {
      // Update existing settings
      result = await supabase
        .from("billing_settings")
        .update(settings)
        .eq("user_id", user.user.id)
        .select();
    } else {
      // Insert new settings with defaults
      result = await supabase
        .from("billing_settings")
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
  } catch (e) {
    console.error("Error accessing schema:", e);
    return null;
  }
}

// =========== PAYMENT METHODS ===========
export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return [];

  try {
    const { data, error } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("user_id", user.user.id)
      .order("is_default", { ascending: false });

    if (error) {
      console.error("Error fetching payment methods:", error);
      return [];
    }

    return data || [];
  } catch (e) {
    console.error("Error accessing schema:", e);
    return [];
  }
}

export async function addPaymentMethod(
  method: Omit<PaymentMethod, "id" | "user_id" | "created_at" | "updated_at">
): Promise<PaymentMethod | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  try {
    // If this is marked as default, unset others
    if (method.is_default) {
      await supabase
        .from("payment_methods")
        .update({ is_default: false })
        .eq("user_id", user.user.id);
    }

    const { data, error } = await supabase
      .from("payment_methods")
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
  } catch (e) {
    console.error("Error accessing schema:", e);
    return null;
  }
}

export async function deletePaymentMethod(id: string): Promise<boolean> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return false;

  try {
    const { error } = await supabase
      .from("payment_methods")
      .delete()
      .eq("id", id)
      .eq("user_id", user.user.id);

    if (error) {
      console.error("Error deleting payment method:", error);
      return false;
    }

    return true;
  } catch (e) {
    console.error("Error accessing schema:", e);
    return false;
  }
}

// =========== NOTIFICATION PREFERENCES ===========
export const getNotificationPreferences =
  async (): Promise<NotificationPreferences | null> => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("notification_preferences")
        .select("*")
        .eq("user_id", user.user.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No notification preferences found
          return null;
        }
        throw error;
      }

      // Cast the email_frequency to the allowed type
      return {
        ...data,
        email_frequency: data.email_frequency as
          | "immediate"
          | "daily"
          | "weekly",
      };
    } catch (error) {
      console.error("Error fetching notification preferences:", error);
      toast.error("Failed to load notification preferences");
      return null;
    }
  };

export async function updateNotificationPreferences(
  preferences: NotificationFormData
): Promise<NotificationPreferences | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  try {
    // Check if preferences exist
    const { data: existingPreferences } = await supabase
      .from("notification_preferences")
      .select("id")
      .eq("user_id", user.user.id)
      .single();

    let result;

    if (existingPreferences) {
      // Update existing preferences
      result = await supabase
        .from("notification_preferences")
        .update(preferences)
        .eq("user_id", user.user.id)
        .select();
    } else {
      // Insert new preferences
      result = await supabase
        .from("notification_preferences")
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
  } catch (e) {
    console.error("Error accessing schema:", e);
    return null;
  }
}

// =========== SECURITY SETTINGS ===========
export async function getSecuritySettings(): Promise<SecuritySettings | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  try {
    const { data, error } = await supabase
      .from("security_settings")
      .select("*")
      .eq("user_id", user.user.id)
      .single();

    if (error) {
      // No result found - create default security settings
      if (error.code === "PGRST116") {
        console.log("No security settings found, creating default");

        const { data: newSettings, error: createError } = await supabase
          .from("security_settings")
          .upsert(
            {
              user_id: user.user.id,
              two_factor_enabled: false,
              last_password_change: new Date().toISOString(),
            },
            {
              onConflict: "user_id",
              ignoreDuplicates: false,
            }
          )
          .select()
          .single();

        if (createError) {
          console.error("Error creating security settings:", createError);
          return null;
        }

        return newSettings;
      } else {
        console.error("Error fetching security settings:", error);
        return null;
      }
    }

    return data;
  } catch (e) {
    console.error("Error accessing security_settings:", e);
    return null;
  }
}

export async function updateSecuritySettings(
  settings: Omit<
    SecurityFormData,
    "current_password" | "new_password" | "confirm_password"
  >
): Promise<SecuritySettings | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  try {
    // Check if settings exist
    const { data: existingSettings } = await supabase
      .from("security_settings")
      .select("id")
      .eq("user_id", user.user.id)
      .single();

    let result;

    if (existingSettings) {
      // Update existing settings
      result = await supabase
        .from("security_settings")
        .update(settings)
        .eq("user_id", user.user.id)
        .select();
    } else {
      // Insert new settings
      result = await supabase
        .from("security_settings")
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
  } catch (e) {
    console.error("Error accessing schema:", e);
    return null;
  }
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
      await supabase.from("security_settings").upsert(
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

  try {
    const { data, error } = await supabase
      .from("session_history")
      .select("*")
      .eq("user_id", user.user.id)
      .order("login_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching session history:", error);
      return [];
    }

    return data || [];
  } catch (e) {
    console.error("Error accessing schema:", e);
    return [];
  }
}

export async function recordSessionLogin(
  sessionInfo: Partial<SessionHistory>
): Promise<boolean> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return false;

  try {
    const { error } = await supabase.from("session_history").insert({
      user_id: user.user.id,
      login_at: new Date().toISOString(),
      ...sessionInfo,
    });

    if (error) {
      console.error("Error recording session login:", error);
      return false;
    }

    return true;
  } catch (e) {
    console.error("Error accessing schema:", e);
    return false;
  }
}

export async function recordSessionLogout(sessionId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("session_history")
      .update({
        logout_at: new Date().toISOString(),
      })
      .eq("id", sessionId);

    if (error) {
      console.error("Error recording session logout:", error);
      return false;
    }

    return true;
  } catch (e) {
    console.error("Error accessing schema:", e);
    return false;
  }
}
