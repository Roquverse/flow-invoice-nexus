import { useSettings } from "./useSettings";
import { CompanySettings } from "@/types/settings";

export const useCompanySettings = () => {
  const { companySettings, loading, error, updateCompanySettings } =
    useSettings();

  return {
    companySettings: companySettings || {
      id: "",
      user_id: "",
      company_name: null,
      industry: null,
      address: null,
      city: null,
      postal_code: null,
      country: null,
      tax_id: null,
      logo_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    loading,
    error,
    updateCompanySettings,
  };
};
