
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/hooks/useSettings";
import { SecuritySettings, SessionHistory } from "@/types/settings";

export const useSecuritySettings = () => {
  const { securitySettings, updateSecuritySettings, loading: settingsLoading, error: settingsError } = useSettings();
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
    securitySettings,
    sessionHistory,
    loading: loading || settingsLoading,
    error: error || settingsError,
    fetchSessionHistory,
    updateSecuritySettings,
    changePassword
  };
};
