import { useSettings } from "./useSettings";
import { UserProfile } from "@/types/settings";

export const useProfileSettings = () => {
  const { userProfile, loading, error, updateUserProfile } = useSettings();

  return {
    profile: userProfile || {
      id: "",
      email: "",
      first_name: "",
      last_name: "",
      phone: "",
      avatar_url: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    loading,
    error,
    updateProfile: updateUserProfile,
  };
};
