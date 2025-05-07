
import { useSettings } from "./useSettings";
import { SecuritySettings, SessionHistory } from "@/types/settings";

export const useSecuritySettings = () => {
  const {
    securitySettings,
    sessionHistory,
    loading,
    error,
    updateSecuritySettings,
    changePassword,
  } = useSettings();

  return {
    securitySettings:
      securitySettings ||
      ({
        id: "",
        user_id: "",
        two_factor_enabled: false,
        last_password_change: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as SecuritySettings),
    sessionHistory: (sessionHistory || []) as SessionHistory[],
    loading,
    error,
    updateSecuritySettings,
    changePassword,
  };
};
