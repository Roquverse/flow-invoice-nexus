
import { useState } from "react";
import { useSettings } from "@/hooks/useSettings";
import { supabase } from "@/integrations/supabase/client";
import { SecuritySettings, SessionHistory } from "@/types/settings";

export const useSecuritySettings = () => {
  const { settings, updateSettings, loading: settingsLoading, error: settingsError } = useSettings();
  const [sessionHistory, setSessionHistory] = useState<SessionHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSessionHistory = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setSessionHistory([]);
        return;
      }

      const { data, error } = await supabase
        .from('session_history')
        .select('*')
        .eq('user_id', user.id)
        .order('login_at', { ascending: false });

      if (error) {
        throw error;
      }

      setSessionHistory(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load session history'));
      console.error("Error fetching session history:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateSecuritySettings = async (updates: Partial<SecuritySettings>): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return false;
      }

      const { error } = await supabase
        .from('security_settings')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      // Update local state through settings context
      if (settings && 'securitySettings' in settings) {
        await updateSettings({
          ...settings,
          securitySettings: {
            ...settings.securitySettings,
            ...updates
          }
        });
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update security settings'));
      console.error("Error updating security settings:", err);
      return false;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw error;
      }

      // Update last password change timestamp
      await updateSecuritySettings({
        last_password_change: new Date().toISOString()
      });

      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to change password'));
      console.error("Error changing password:", err);
      return false;
    }
  };

  return {
    securitySettings: settings?.securitySettings,
    sessionHistory,
    loading: loading || settingsLoading,
    error: error || settingsError,
    fetchSessionHistory,
    updateSecuritySettings,
    changePassword
  };
};
