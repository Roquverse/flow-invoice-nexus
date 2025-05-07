
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CompanySettings, UserSettings, NotificationPreferences, UserProfile, PaymentMethod, BillingFormData } from "@/types/settings";

export interface UseSettingsReturn {
  userProfile: UserProfile | null;
  companySettings: CompanySettings | null;
  billingSettings: any;
  notificationPreferences: NotificationPreferences | null;
  loading: boolean;
  error: Error | null;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  updateCompanySettings: (data: Partial<CompanySettings>) => Promise<void>;
  updateBillingSettings: (data: BillingFormData) => Promise<void>;
  updateNotificationPreferences: (data: Partial<NotificationPreferences>) => Promise<void>;
}

export const useSettings = (): UseSettingsReturn => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);
  const [billingSettings, setBillingSettings] = useState<any>(null);
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Not authenticated");
      }

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        throw profileError;
      }

      // Fetch company settings
      const { data: companyData, error: companyError } = await supabase
        .from("company_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (companyError) {
        throw companyError;
      }

      // Fetch billing settings
      const { data: billingData, error: billingError } = await supabase
        .from("billing_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (billingError) {
        throw billingError;
      }

      // Fetch notification preferences
      const { data: notificationData, error: notificationError } = await supabase
        .from("notification_preferences")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (notificationError) {
        throw notificationError;
      }

      setUserProfile(profileData || null);
      setCompanySettings(companyData || null);
      setBillingSettings(billingData || null);
      setNotificationPreferences(notificationData || null);
    } catch (err) {
      console.error("Error fetching settings:", err);
      setError(err instanceof Error ? err : new Error("Failed to load settings"));
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Not authenticated");
      }

      const { error } = await supabase
        .from("user_profiles")
        .update(data)
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      // Refresh data
      await fetchData();
    } catch (err) {
      console.error("Error updating user profile:", err);
      setError(err instanceof Error ? err : new Error("Failed to update profile"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCompanySettings = async (data: Partial<CompanySettings>) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Not authenticated");
      }

      if (companySettings?.id) {
        // Update existing record
        const { error } = await supabase
          .from("company_settings")
          .update(data)
          .eq("id", companySettings.id);
  
        if (error) {
          throw error;
        }
      } else {
        // Insert new record
        const { error } = await supabase
          .from("company_settings")
          .insert({
            ...data,
            user_id: user.id
          });
  
        if (error) {
          throw error;
        }
      }

      // Refresh data
      await fetchData();
    } catch (err) {
      console.error("Error updating company settings:", err);
      setError(err instanceof Error ? err : new Error("Failed to update company settings"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBillingSettings = async (data: BillingFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Not authenticated");
      }

      if (billingSettings?.id) {
        // Update existing record
        const { error } = await supabase
          .from("billing_settings")
          .update(data)
          .eq("id", billingSettings.id);
  
        if (error) {
          throw error;
        }
      } else {
        // Insert new record
        const { error } = await supabase
          .from("billing_settings")
          .insert({
            ...data,
            user_id: user.id
          });
  
        if (error) {
          throw error;
        }
      }

      // Refresh data
      await fetchData();
    } catch (err) {
      console.error("Error updating billing settings:", err);
      setError(err instanceof Error ? err : new Error("Failed to update billing settings"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateNotificationPreferences = async (data: Partial<NotificationPreferences>) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Not authenticated");
      }

      // Fix email_frequency type issue
      if (data.email_frequency) {
        // Ensure it's one of the valid values
        const validFrequencies = ["immediate", "daily", "weekly"];
        if (!validFrequencies.includes(data.email_frequency as string)) {
          data.email_frequency = "immediate"; // Default to immediate if invalid
        }
      }

      if (notificationPreferences?.id) {
        // Update existing record
        const { error } = await supabase
          .from("notification_preferences")
          .update(data)
          .eq("id", notificationPreferences.id);
  
        if (error) {
          throw error;
        }
      } else {
        // Insert new record
        const { error } = await supabase
          .from("notification_preferences")
          .insert({
            ...data,
            user_id: user.id
          });
  
        if (error) {
          throw error;
        }
      }

      // Refresh data
      await fetchData();
    } catch (err) {
      console.error("Error updating notification preferences:", err);
      setError(err instanceof Error ? err : new Error("Failed to update notification preferences"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    userProfile,
    companySettings,
    billingSettings,
    notificationPreferences,
    loading,
    error,
    updateUserProfile,
    updateCompanySettings,
    updateBillingSettings,
    updateNotificationPreferences
  };
};

// Export default for backward compatibility
export default useSettings;
