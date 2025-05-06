
import { supabase } from "@/integrations/supabase/client";
import { CompanySettings, UserSettings } from "@/types/settings";

interface CompanySettingsResponse {
  company_name: string;
  logo_url: string;
  industry: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  tax_id: string;
  id: string;
  user_id: string;
}

interface NotificationPreferencesResponse {
  id: string;
  user_id: string;
  invoice_notifications: boolean;
  client_activity: boolean;
  project_updates: boolean;
  marketing_tips: boolean;
  email_frequency: string;
}

interface BillingSettingsResponse {
  id: string;
  user_id: string;
  subscription_plan: string;
  billing_name: string;
  billing_email: string;
  subscription_renewal_date: string;
  subscription_status: string;
}

interface SecuritySettingsResponse {
  id: string;
  user_id: string;
  two_factor_enabled: boolean;
  last_password_change: string;
}

/**
 * Service for managing user settings
 */
export const settingsService = {
  /**
   * Get company settings for the current user
   */
  async getCompanySettings(): Promise<CompanySettings | null> {
    try {
      const { data, error } = await supabase
        .from("company_settings")
        .select("*")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as CompanySettings;
    } catch (error) {
      console.error("Error fetching company settings:", error);
      return null;
    }
  },

  /**
   * Update company settings
   */
  async updateCompanySettings(settings: Partial<CompanySettings>): Promise<CompanySettings> {
    try {
      const { data, error } = await supabase
        .from("company_settings")
        .update(settings)
        .match({ user_id: settings.user_id })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as CompanySettings;
    } catch (error) {
      console.error("Error updating company settings:", error);
      throw error;
    }
  },

  /**
   * Create company settings for a new user
   */
  async createCompanySettings(settings: Partial<CompanySettings>): Promise<CompanySettings> {
    try {
      const { data, error } = await supabase
        .from("company_settings")
        .insert(settings)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as CompanySettings;
    } catch (error) {
      console.error("Error creating company settings:", error);
      throw error;
    }
  },

  /**
   * Get all user settings
   */
  async getAllSettings(userId: string): Promise<UserSettings | null> {
    try {
      // Fetch company settings
      const { data: companyData, error: companyError } = await supabase
        .from("company_settings")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (companyError && companyError.code !== "PGRST116") {
        // PGRST116 is the "not found" error code
        throw new Error(`Error fetching company settings: ${companyError.message}`);
      }

      // Fetch notification preferences
      const { data: notificationData, error: notificationError } = await supabase
        .from("notification_preferences")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (notificationError && notificationError.code !== "PGRST116") {
        throw new Error(`Error fetching notification preferences: ${notificationError.message}`);
      }

      // Fetch billing settings
      const { data: billingData, error: billingError } = await supabase
        .from("billing_settings")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (billingError && billingError.code !== "PGRST116") {
        throw new Error(`Error fetching billing settings: ${billingError.message}`);
      }

      // Fetch security settings
      const { data: securityData, error: securityError } = await supabase
        .from("security_settings")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (securityError && securityError.code !== "PGRST116") {
        throw new Error(`Error fetching security settings: ${securityError.message}`);
      }

      return {
        company: companyData as CompanySettings,
        notification: notificationData as NotificationPreferencesResponse,
        billing: billingData as BillingSettingsResponse,
        security: securityData as SecuritySettingsResponse,
      };
    } catch (error) {
      console.error("Error fetching all settings:", error);
      return null;
    }
  },
};
