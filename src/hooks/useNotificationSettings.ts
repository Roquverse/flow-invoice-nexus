import { useSettings } from "./useSettings";
import { NotificationPreferences } from "@/types/settings";

export const useNotificationSettings = () => {
  const {
    notificationPreferences,
    loading,
    error,
    updateNotificationPreferences,
  } = useSettings();

  return {
    notificationPreferences: notificationPreferences || {
      id: "",
      user_id: "",
      invoice_notifications: true,
      client_activity: true,
      project_updates: false,
      marketing_tips: false,
      email_frequency: "immediate",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    loading,
    error,
    updateNotificationPreferences,
  };
};
