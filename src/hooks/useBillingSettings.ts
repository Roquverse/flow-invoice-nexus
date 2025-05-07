
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/hooks/useSettings";
import { BillingFormData, PaymentMethod } from "@/types/settings";

export const useBillingSettings = () => {
  const { billingSettings, updateBillingSettings: updateBilling, loading, error } = useSettings();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setPaymentMethods([]);
        return;
      }

      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      setPaymentMethods(data || []);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    }
  };

  const addPaymentMethod = async (paymentData: Partial<PaymentMethod>): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return false;
      }
      
      // Make sure required fields are present
      if (!paymentData.payment_type || !paymentData.provider) {
        console.error("Missing required fields for payment method");
        return false;
      }

      const { error } = await supabase
        .from('payment_methods')
        .insert({
          ...paymentData,
          payment_type: paymentData.payment_type,
          provider: paymentData.provider,
          user_id: user.id,
        });

      if (error) {
        throw error;
      }

      // Refresh payment methods list
      await fetchPaymentMethods();
      return true;
    } catch (error) {
      console.error("Error adding payment method:", error);
      return false;
    }
  };

  const deletePaymentMethod = async (paymentMethodId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', paymentMethodId);

      if (error) {
        throw error;
      }

      // Refresh payment methods list
      await fetchPaymentMethods();
      return true;
    } catch (error) {
      console.error("Error deleting payment method:", error);
      return false;
    }
  };

  // Create a wrapper function for updateBillingSettings to ensure it's accessible
  const updateBillingSettings = async (data: BillingFormData): Promise<boolean> => {
    try {
      await updateBilling(data);
      return true;
    } catch (error) {
      console.error("Error updating billing settings:", error);
      return false;
    }
  };

  return {
    billingSettings,
    paymentMethods,
    loading,
    error,
    updateBillingSettings,
    addPaymentMethod,
    deletePaymentMethod
  };
};
