import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type CompanySettings = {
  id?: string;
  user_id?: string;
  company_name?: string;
  logo_url?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  tax_id?: string;
  vat_number?: string;
  registration_number?: string;
  default_currency?: string;
  default_tax_rate?: number;
  payment_terms?: number;
  payment_instructions?: string;
  invoice_prefix?: string;
  quote_prefix?: string;
  receipt_prefix?: string;
  invoice_notes?: string;
  quote_notes?: string;
  created_at?: string;
  updated_at?: string;
};

export const useCompanySettings = () => {
  const [companySettings, setCompanySettings] =
    useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCompanySettings = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("company_settings")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        throw fetchError;
      }

      setCompanySettings(data || null);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanySettings();
  }, []);

  const updateCompanySettings = async (
    companyData: Partial<CompanySettings>
  ) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) return false;

      const { data: existingRecord } = await supabase
        .from("company_settings")
        .select("id")
        .eq("user_id", session.user.id)
        .single();

      let error;

      if (existingRecord) {
        ({ error } = await supabase
          .from("company_settings")
          .update(companyData)
          .eq("user_id", session.user.id));
      } else {
        ({ error } = await supabase
          .from("company_settings")
          .insert({ user_id: session.user.id, ...companyData }));
      }

      if (error) throw error;

      await fetchCompanySettings();
      return true;
    } catch (e) {
      setError(e as Error);
      return false;
    }
  };

  return {
    companySettings,
    updateCompanySettings,
    loading,
    error,
  };
};
