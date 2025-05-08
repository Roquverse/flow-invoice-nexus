
import { useState, useEffect } from 'react';
import { useSettings } from './useSettings';
import { BillingSettings } from '@/types/settings';
import { supabase } from '@/integrations/supabase/client';

export const useBillingSettings = () => {
  const [billingSettings, setBillingSettings] = useState<BillingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const settings = useSettings();

  // Add updateBillingSettings function
  const updateBillingSettings = async (updatedSettings: Partial<BillingSettings>) => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setLoading(false);
        return false;
      }
      
      const { data, error: updateError } = await supabase
        .from('billing_settings')
        .update(updatedSettings)
        .eq('user_id', session.user.id);
        
      if (updateError) throw updateError;
      
      setBillingSettings(prev => prev ? { ...prev, ...updatedSettings } : null);
      await settings.refresh(); // Refresh the main settings context
      return data;
    } catch (err) {
      console.error("Error updating billing settings:", err);
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (settings.billingSettings) {
      setBillingSettings(settings.billingSettings);
      setLoading(false);
    }
  }, [settings.billingSettings]);

  return {
    billingSettings,
    loading,
    error,
    updateBillingSettings
  };
};
