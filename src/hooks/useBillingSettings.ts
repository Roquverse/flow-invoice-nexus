import { useSettings } from "./useSettings";
import { PaymentMethod } from "@/types/settings";

export const useBillingSettings = () => {
  const {
    billingSettings,
    paymentMethods,
    loading,
    error,
    addPaymentMethod,
    deletePaymentMethod,
  } = useSettings();

  return {
    billingSettings: billingSettings || {
      id: "",
      user_id: "",
      billing_name: null,
      billing_email: null,
      subscription_plan: "free",
      subscription_status: "active",
      subscription_renewal_date: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    paymentMethods: (paymentMethods || []) as PaymentMethod[],
    loading,
    error,
    addPaymentMethod,
    deletePaymentMethod,
  };
};
