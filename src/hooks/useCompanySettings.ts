
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/hooks/useSettings";

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
  const { companySettings, updateCompanySettings, loading, error } = useSettings();

  return {
    companySettings,
    updateCompanySettings,
    loading,
    error
  };
};
