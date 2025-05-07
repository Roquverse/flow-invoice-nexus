
import { useState } from "react";
import { useSettings } from "@/hooks/useSettings";
import { NotificationPreferences } from "@/types/settings";

export const useNotificationPreferences = () => {
  const { notificationPreferences, updateNotificationPreferences, loading, error } = useSettings();
  const [saving, setSaving] = useState(false);

  const updatePreferences = async (preferences: Partial<NotificationPreferences>): Promise<boolean> => {
    try {
      setSaving(true);
      
      // Make sure we only update with valid email frequency values
      if (preferences.email_frequency && 
          !['immediate', 'daily', 'weekly'].includes(preferences.email_frequency)) {
        throw new Error('Invalid email frequency value');
      }
      
      await updateNotificationPreferences(preferences);
      return true;
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    notificationPreferences,
    loading: loading || saving,
    error,
    updatePreferences
  };
};
