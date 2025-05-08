
import { useState, useEffect } from 'react';
import { useSettings } from './useSettings';
import { SecuritySettings } from '@/types/settings';
import { supabase } from '@/integrations/supabase/client';

export const useSecuritySettings = () => {
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const settings = useSettings();

  // Update security settings
  const updateSecuritySettings = async (updatedSettings: Partial<SecuritySettings>) => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setLoading(false);
        return false;
      }
      
      const { data, error: updateError } = await supabase
        .from('security_settings')
        .update(updatedSettings)
        .eq('user_id', session.user.id);
        
      if (updateError) throw updateError;
      
      setSecuritySettings(prev => prev ? { ...prev, ...updatedSettings } : null);
      await settings.refresh(); // Refresh the main settings context
      return data;
    } catch (err) {
      console.error("Error updating security settings:", err);
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (settings.securitySettings) {
      setSecuritySettings(settings.securitySettings);
      setLoading(false);
    }
  }, [settings.securitySettings]);

  return {
    securitySettings,
    loading,
    error,
    updateSecuritySettings
  };
};

export default useSecuritySettings;
