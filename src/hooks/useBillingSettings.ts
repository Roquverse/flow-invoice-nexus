
import { useState, useEffect } from 'react';
import { useSettings } from './useSettings';
import { BillingSettings } from '@/types/settings';

export const useBillingSettings = () => {
  const [billingSettings, setBillingSettings] = useState<BillingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const settings = useSettings();

  // Add updateBillingSettings function
  const updateBillingSettings = async (updatedSettings: Partial<BillingSettings>) => {
    try {
      // This will delegate to the main settings context's update function
      if (settings.updateBillingSettings) {
        const result = await settings.updateBillingSettings(updatedSettings);
        setBillingSettings(prev => prev ? { ...prev, ...updatedSettings } : null);
        return result;
      }
      return false;
    } catch (error) {
      console.error("Error updating billing settings:", error);
      return false;
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
    updateBillingSettings
  };
};
