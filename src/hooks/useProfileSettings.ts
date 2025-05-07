
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/hooks/useSettings";

export type UserProfile = {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
};

export const useProfileSettings = () => {
  const { userProfile, updateUserProfile, loading, error } = useSettings();

  return {
    profile: userProfile,
    updateProfile: updateUserProfile,
    loading,
    error
  };
};
