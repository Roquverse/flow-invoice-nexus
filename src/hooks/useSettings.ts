import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  UserProfile,
  SecuritySettings,
  NotificationPreferences,
  PaymentMethod,
  SessionHistory,
} from "@/types/settings";

export const useSettings = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [securitySettings, setSecuritySettings] =
    useState<SecuritySettings | null>(null);
  const [notificationPreferences, setNotificationPreferences] =
    useState<NotificationPreferences | null>(null);
  const [sessionHistory, setSessionHistory] = useState<SessionHistory[] | null>(
    null
  );
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[] | null>(
    null
  );
  const [billingSettings, setBillingSettings] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSettings = async () => {
    try {
      // Get current user
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setLoading(false);
        return;
      }

      const userId = session.user.id;

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        throw profileError;
      }

      // Fetch notification preferences
      const { data: notificationData, error: notificationError } =
        await supabase
          .from("notification_preferences")
          .select("*")
          .eq("user_id", userId)
          .single();

      if (notificationError && notificationError.code !== "PGRST116") {
        throw notificationError;
      }

      // Fetch security settings
      const { data: securityData, error: securityError } = await supabase
        .from("security_settings")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (securityError && securityError.code !== "PGRST116") {
        throw securityError;
      }

      // Fetch session history
      const { data: sessionData, error: sessionError } = await supabase
        .from("session_history")
        .select("*")
        .eq("user_id", userId)
        .order("login_at", { ascending: false })
        .limit(5);

      if (sessionError) {
        throw sessionError;
      }

      // Fetch payment methods
      const { data: paymentData, error: paymentError } = await supabase
        .from("payment_methods")
        .select("*")
        .eq("user_id", userId);

      if (paymentError) {
        throw paymentError;
      }

      // Fetch billing settings
      const { data: billingData, error: billingError } = await supabase
        .from("billing_settings")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (billingError && billingError.code !== "PGRST116") {
        throw billingError;
      }

      // Update state with fetched data
      setUserProfile(profileData || null);
      setNotificationPreferences(notificationData || null);
      setSecuritySettings(securityData || null);
      setSessionHistory(sessionData || null);
      setPaymentMethods(paymentData || null);
      setBillingSettings(billingData || null);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Update functions for each settings category
  const updateUserProfile = async (userData: Partial<UserProfile>) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) return false;

      const { error } = await supabase
        .from("user_profiles")
        .update(userData)
        .eq("id", session.user.id);

      if (error) throw error;

      // Refresh settings
      fetchSettings();
      return true;
    } catch (e) {
      setError(e as Error);
      return false;
    }
  };

  const updateNotificationPreferences = async (
    notificationData: Partial<NotificationPreferences>
  ) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) return false;

      // Check if the record exists
      const { data: existingRecord } = await supabase
        .from("notification_preferences")
        .select("id")
        .eq("user_id", session.user.id)
        .single();

      let error;

      if (existingRecord) {
        // Update existing record
        ({ error } = await supabase
          .from("notification_preferences")
          .update(notificationData)
          .eq("user_id", session.user.id));
      } else {
        // Create new record
        ({ error } = await supabase
          .from("notification_preferences")
          .insert({ user_id: session.user.id, ...notificationData }));
      }

      if (error) throw error;

      // Refresh settings
      fetchSettings();
      return true;
    } catch (e) {
      setError(e as Error);
      return false;
    }
  };

  const updateSecuritySettings = async (
    securityData: Partial<SecuritySettings>
  ) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) return false;

      // Check if the record exists
      const { data: existingRecord } = await supabase
        .from("security_settings")
        .select("id")
        .eq("user_id", session.user.id)
        .single();

      let error;

      if (existingRecord) {
        // Update existing record
        ({ error } = await supabase
          .from("security_settings")
          .update(securityData)
          .eq("user_id", session.user.id));
      } else {
        // Create new record
        ({ error } = await supabase
          .from("security_settings")
          .insert({ user_id: session.user.id, ...securityData }));
      }

      if (error) throw error;

      // Refresh settings
      fetchSettings();
      return true;
    } catch (e) {
      setError(e as Error);
      return false;
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      return true;
    } catch (e) {
      setError(e as Error);
      return false;
    }
  };

  const addPaymentMethod = async (paymentData: Partial<PaymentMethod>) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) return false;

      // Ensure required fields are present
      const paymentMethodData = {
        user_id: session.user.id,
        payment_type: paymentData.payment_type || "credit_card",
        provider: paymentData.provider || "visa",
        last_four: paymentData.last_four || "0000",
        is_default: paymentData.is_default || false,
        ...paymentData,
      };

      const { error } = await supabase
        .from("payment_methods")
        .insert(paymentMethodData);

      if (error) throw error;

      // Refresh settings
      fetchSettings();
      return true;
    } catch (e) {
      setError(e as Error);
      return false;
    }
  };

  const deletePaymentMethod = async (paymentMethodId: string) => {
    try {
      const { error } = await supabase
        .from("payment_methods")
        .delete()
        .eq("id", paymentMethodId);

      if (error) throw error;

      // Refresh settings
      fetchSettings();
      return true;
    } catch (e) {
      setError(e as Error);
      return false;
    }
  };

  const refresh = async () => {
    await fetchSettings();
  };

  return {
    userProfile,
    securitySettings,
    notificationPreferences,
    sessionHistory,
    paymentMethods,
    billingSettings,
    loading,
    error,
    updateUserProfile,
    updateNotificationPreferences,
    updateSecuritySettings,
    changePassword,
    addPaymentMethod,
    deletePaymentMethod,
    refresh,
  };
};
