
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { settingsService } from "@/services/settingsService";
import { 
  CompanySettings, 
  UserProfile,
  PaymentMethod, 
  NotificationPreferences,
  SecuritySettings,
  SessionHistory
} from "@/types/settings";
import { toast } from "sonner";

export const useSettings = () => {
  const { user } = useAuth();
  const userId = user?.id;

  // State for various settings
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);
  const [billingSettings, setBillingSettings] = useState<any>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences | null>(null);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
  const [sessionHistory, setSessionHistory] = useState<SessionHistory[]>([]);
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all settings
  const loadAllSettings = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Load user profile
      const userProfileData = await settingsService.getUserProfile(userId);
      setUserProfile(userProfileData as unknown as UserProfile);
      
      // Load company settings
      const companyData = await settingsService.getCompanySettings(userId);
      setCompanySettings(companyData);
      
      // Load billing settings and payment methods
      await loadBillingSettings();
      
      // Load notification preferences
      await loadNotificationPreferences();
      
      // Load security settings and session history
      await loadSecuritySettings();
      
    } catch (error) {
      console.error("Failed to load settings:", error);
      setError("Failed to load user settings");
    } finally {
      setLoading(false);
    }
  };
  
  // Load billing-specific settings
  const loadBillingSettings = async () => {
    if (!userId) return;
    
    try {
      const billingData = await settingsService.getBillingSettings(userId);
      setBillingSettings(billingData);
      
      const paymentData = await settingsService.getPaymentMethods(userId);
      setPaymentMethods(paymentData as unknown as PaymentMethod[]);
      
    } catch (error) {
      console.error("Failed to load billing settings:", error);
    }
  };
  
  // Load notification preferences
  const loadNotificationPreferences = async () => {
    if (!userId) return;
    
    try {
      const notificationData = await settingsService.getNotificationPreferences(userId);
      setNotificationPreferences(notificationData as unknown as NotificationPreferences);
    } catch (error) {
      console.error("Failed to load notification preferences:", error);
    }
  };
  
  // Load security settings and session history
  const loadSecuritySettings = async () => {
    if (!userId) return;
    
    try {
      const securityData = await settingsService.getSecuritySettings(userId);
      setSecuritySettings(securityData as unknown as SecuritySettings);
      
      const historyData = await settingsService.getSessionHistory(userId);
      setSessionHistory(historyData as unknown as SessionHistory[]);
      
    } catch (error) {
      console.error("Failed to load security settings:", error);
    }
  };
  
  // Update user profile
  const updateUserProfile = async (profileData: Partial<UserProfile>) => {
    if (!userId) return null;
    
    setLoading(true);
    try {
      const updatedProfile = await settingsService.updateUserProfile({
        user_id: userId,
        ...profileData
      });
      
      setUserProfile(prevProfile => ({
        ...prevProfile as UserProfile,
        ...updatedProfile
      }));
      
      toast.success("Profile updated successfully");
      return updatedProfile;
      
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
      return null;
      
    } finally {
      setLoading(false);
    }
  };
  
  // Update company settings
  const updateCompanySettings = async (companyData: Partial<CompanySettings>) => {
    if (!userId) return null;
    
    setLoading(true);
    try {
      const updatedCompany = await settingsService.updateCompanySettings({
        user_id: userId,
        ...companyData
      });
      
      setCompanySettings(prevSettings => ({
        ...prevSettings as CompanySettings,
        ...updatedCompany
      }));
      
      toast.success("Company settings updated successfully");
      return updatedCompany;
      
    } catch (error) {
      console.error("Failed to update company settings:", error);
      toast.error("Failed to update company settings");
      return null;
      
    } finally {
      setLoading(false);
    }
  };
  
  // Update notification preferences
  const updateNotificationPreferences = async (preferences: Partial<NotificationPreferences>) => {
    if (!userId || !notificationPreferences) return null;
    
    setLoading(true);
    try {
      const updatedPreferences = await settingsService.updateNotificationPreferences({
        ...notificationPreferences,
        ...preferences
      });
      
      setNotificationPreferences(prevPreferences => ({
        ...prevPreferences as NotificationPreferences,
        ...updatedPreferences
      }));
      
      toast.success("Notification preferences updated successfully");
      return updatedPreferences;
      
    } catch (error) {
      console.error("Failed to update notification preferences:", error);
      toast.error("Failed to update notification preferences");
      return null;
      
    } finally {
      setLoading(false);
    }
  };
  
  // Update security settings
  const updateSecuritySettings = async (settings: Partial<SecuritySettings>) => {
    if (!userId || !securitySettings) return null;
    
    setLoading(true);
    try {
      const updatedSettings = await settingsService.updateSecuritySettings({
        ...securitySettings,
        ...settings
      });
      
      setSecuritySettings(prevSettings => ({
        ...prevSettings as SecuritySettings,
        ...updatedSettings
      }));
      
      toast.success("Security settings updated successfully");
      return updatedSettings;
      
    } catch (error) {
      console.error("Failed to update security settings:", error);
      toast.error("Failed to update security settings");
      return null;
      
    } finally {
      setLoading(false);
    }
  };
  
  // Add a payment method
  const addPaymentMethod = async (paymentMethod: Partial<PaymentMethod>) => {
    if (!userId) return null;
    
    setLoading(true);
    try {
      const newMethod = await settingsService.addPaymentMethod({
        user_id: userId,
        ...paymentMethod
      });
      
      setPaymentMethods(prevMethods => [
        ...prevMethods,
        newMethod as unknown as PaymentMethod
      ]);
      
      toast.success("Payment method added successfully");
      return newMethod;
      
    } catch (error) {
      console.error("Failed to add payment method:", error);
      toast.error("Failed to add payment method");
      return null;
      
    } finally {
      setLoading(false);
    }
  };
  
  // Delete a payment method
  const deletePaymentMethod = async (methodId: string) => {
    setLoading(true);
    try {
      const result = await settingsService.deletePaymentMethod(methodId);
      
      if (result) {
        setPaymentMethods(prevMethods => 
          prevMethods.filter(method => method.id !== methodId)
        );
        
        toast.success("Payment method deleted successfully");
      }
      
      return result;
      
    } catch (error) {
      console.error("Failed to delete payment method:", error);
      toast.error("Failed to delete payment method");
      return false;
      
    } finally {
      setLoading(false);
    }
  };
  
  // Change password
  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!userId) return false;
    
    setLoading(true);
    try {
      const result = await settingsService.updatePassword(userId, currentPassword, newPassword);
      
      if (result.success) {
        toast.success("Password updated successfully");
        return true;
      } else {
        toast.error(result.message || "Failed to update password");
        return false;
      }
      
    } catch (error) {
      console.error("Failed to change password:", error);
      toast.error("Failed to update password");
      return false;
      
    } finally {
      setLoading(false);
    }
  };
  
  // Load settings when user changes
  useEffect(() => {
    if (userId) {
      loadAllSettings();
    }
  }, [userId]);
  
  return {
    userProfile,
    companySettings,
    billingSettings,
    paymentMethods,
    notificationPreferences,
    securitySettings,
    sessionHistory,
    loading,
    error,
    updateUserProfile,
    updateCompanySettings,
    updateNotificationPreferences,
    updateSecuritySettings,
    addPaymentMethod,
    deletePaymentMethod,
    changePassword,
    refresh: loadAllSettings
  };
};
