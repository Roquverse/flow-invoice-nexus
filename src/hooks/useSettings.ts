import { useState, useEffect } from "react";
import { toast } from "sonner";
import * as settingsService from "@/services/settingsService";
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

// Hook for managing profile data
export function useProfileSettings() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const data = await settingsService.getUserProfile();
        setProfile(data);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to load profile")
        );
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const updateProfile = async (data: ProfileFormData) => {
    try {
      setLoading(true);
      const updated = await settingsService.updateUserProfile(data);
      if (updated) {
        setProfile(updated);
        toast.success("Profile updated successfully");
        return true;
      } else {
        toast.error("Failed to update profile");
        return false;
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to update profile")
      );
      console.error("Error updating profile:", err);
      toast.error("Error updating profile");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error, updateProfile };
}

// Hook for managing company settings
export function useCompanySettings() {
  const [companySettings, setCompanySettings] =
    useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadCompanySettings() {
      try {
        setLoading(true);
        const data = await settingsService.getCompanySettings();
        setCompanySettings(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to load company settings")
        );
        console.error("Error loading company settings:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCompanySettings();
  }, []);

  const updateCompanySettings = async (data: CompanyFormData) => {
    try {
      setLoading(true);
      const updated = await settingsService.updateCompanySettings(data);
      if (updated) {
        setCompanySettings(updated);
        toast.success("Company settings updated successfully");
        return true;
      } else {
        toast.error("Failed to update company settings");
        return false;
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to update company settings")
      );
      console.error("Error updating company settings:", err);
      toast.error("Error updating company settings");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { companySettings, loading, error, updateCompanySettings };
}

// Hook for managing billing settings
export function useBillingSettings() {
  const [billingSettings, setBillingSettings] =
    useState<BillingSettings | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadBillingData() {
      try {
        setLoading(true);
        const [settings, methods] = await Promise.all([
          settingsService.getBillingSettings(),
          settingsService.getPaymentMethods(),
        ]);
        setBillingSettings(settings);
        setPaymentMethods(methods);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to load billing data")
        );
        console.error("Error loading billing data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadBillingData();
  }, []);

  const updateBillingSettings = async (data: BillingFormData) => {
    try {
      setLoading(true);
      const updated = await settingsService.updateBillingSettings(data);
      if (updated) {
        setBillingSettings(updated);
        toast.success("Billing settings updated successfully");
        return true;
      } else {
        toast.error("Failed to update billing settings");
        return false;
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to update billing settings")
      );
      console.error("Error updating billing settings:", err);
      toast.error("Error updating billing settings");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addPaymentMethod = async (
    method: Omit<PaymentMethod, "id" | "user_id" | "created_at" | "updated_at">
  ) => {
    try {
      setLoading(true);
      const added = await settingsService.addPaymentMethod(method);
      if (added) {
        setPaymentMethods((prev) => {
          // If the new method is default, update all others
          if (added.is_default) {
            return [added, ...prev.map((m) => ({ ...m, is_default: false }))];
          }
          return [added, ...prev];
        });
        toast.success("Payment method added successfully");
        return true;
      } else {
        toast.error("Failed to add payment method");
        return false;
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to add payment method")
      );
      console.error("Error adding payment method:", err);
      toast.error("Error adding payment method");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deletePaymentMethod = async (id: string) => {
    try {
      setLoading(true);
      const success = await settingsService.deletePaymentMethod(id);
      if (success) {
        setPaymentMethods((prev) => prev.filter((method) => method.id !== id));
        toast.success("Payment method removed successfully");
        return true;
      } else {
        toast.error("Failed to remove payment method");
        return false;
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to remove payment method")
      );
      console.error("Error removing payment method:", err);
      toast.error("Error removing payment method");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    billingSettings,
    paymentMethods,
    loading,
    error,
    updateBillingSettings,
    addPaymentMethod,
    deletePaymentMethod,
  };
}

// Hook for managing notification preferences
export function useNotificationSettings() {
  const [notificationPreferences, setNotificationPreferences] =
    useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadNotificationPreferences() {
      try {
        setLoading(true);
        const data = await settingsService.getNotificationPreferences();
        setNotificationPreferences(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to load notification preferences")
        );
        console.error("Error loading notification preferences:", err);
      } finally {
        setLoading(false);
      }
    }

    loadNotificationPreferences();
  }, []);

  const updateNotificationPreferences = async (data: NotificationFormData) => {
    try {
      setLoading(true);
      const updated = await settingsService.updateNotificationPreferences(data);
      if (updated) {
        setNotificationPreferences(updated);
        toast.success("Notification preferences updated successfully");
        return true;
      } else {
        toast.error("Failed to update notification preferences");
        return false;
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to update notification preferences")
      );
      console.error("Error updating notification preferences:", err);
      toast.error("Error updating notification preferences");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    notificationPreferences,
    loading,
    error,
    updateNotificationPreferences,
  };
}

// Hook for managing security settings
export function useSecuritySettings() {
  const [securitySettings, setSecuritySettings] =
    useState<SecuritySettings | null>(null);
  const [sessionHistory, setSessionHistory] = useState<SessionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadSecurityData() {
      try {
        setLoading(true);
        const [settings, sessions] = await Promise.all([
          settingsService.getSecuritySettings(),
          settingsService.getSessionHistory(),
        ]);
        setSecuritySettings(settings);
        setSessionHistory(sessions);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to load security data")
        );
        console.error("Error loading security data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadSecurityData();
  }, []);

  const updateSecuritySettings = async (
    data: Omit<
      SecurityFormData,
      "current_password" | "new_password" | "confirm_password"
    >
  ) => {
    try {
      setLoading(true);
      const updated = await settingsService.updateSecuritySettings(data);
      if (updated) {
        setSecuritySettings(updated);
        toast.success("Security settings updated successfully");
        return true;
      } else {
        toast.error("Failed to update security settings");
        return false;
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to update security settings")
      );
      console.error("Error updating security settings:", err);
      toast.error("Error updating security settings");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      setLoading(true);
      const success = await settingsService.updatePassword(
        currentPassword,
        newPassword
      );
      if (success) {
        toast.success("Password updated successfully");
        return true;
      } else {
        toast.error("Failed to update password");
        return false;
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to update password")
      );
      console.error("Error updating password:", err);
      toast.error("Error updating password");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    securitySettings,
    sessionHistory,
    loading,
    error,
    updateSecuritySettings,
    updatePassword,
  };
}

// Combined hook for all settings
export function useSettings() {
  const profile = useProfileSettings();
  const company = useCompanySettings();
  const billing = useBillingSettings();
  const notifications = useNotificationSettings();
  const security = useSecuritySettings();

  const loading =
    profile.loading ||
    company.loading ||
    billing.loading ||
    notifications.loading ||
    security.loading;
  const error =
    profile.error ||
    company.error ||
    billing.error ||
    notifications.error ||
    security.error;

  return {
    profile,
    company,
    billing,
    notifications,
    security,
    loading,
    error,
  };
}
