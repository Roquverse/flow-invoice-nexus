
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdminUser } from "@/services/adminService";

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  adminLoading: boolean;
  adminLogin: (
    username: string,
    password: string
  ) => Promise<{
    success: boolean;
    error?: string;
  }>;
  adminLogout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  adminUser: null,
  isAdminAuthenticated: false,
  adminLoading: true,
  adminLogin: async () => ({ success: false }),
  adminLogout: () => {},
});

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

// Helper function to hash password with salt using Web Crypto API
async function hashPassword(password: string, salt: string): Promise<string> {
  // Convert password to Uint8Array
  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password);

  // Hash the password using SHA-256
  const hashBuffer = await crypto.subtle.digest("SHA-256", passwordData);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] =
    useState<boolean>(false);
  const [adminLoading, setAdminLoading] = useState<boolean>(true);

  // Check for existing admin session on mount
  useEffect(() => {
    const checkAdminAuth = () => {
      const adminAuth = localStorage.getItem("adminAuthenticated");
      const adminUserData = localStorage.getItem("adminUser");

      if (adminAuth === "true" && adminUserData) {
        try {
          const parsedUser = JSON.parse(adminUserData);
          setAdminUser(parsedUser);
          setIsAdminAuthenticated(true);
        } catch (e) {
          console.error("Error parsing admin user data");
          localStorage.removeItem("adminAuthenticated");
          localStorage.removeItem("adminUser");
        }
      }

      setAdminLoading(false);
    };

    checkAdminAuth();
  }, []);

  // Admin login function using admin_users table
  const adminLogin = async (username: string, password: string) => {
    try {
      // First, try to get the admin user by username
      const { data: adminUserData, error } = await supabase
        .from("admin_users")
        .select("*")
        .eq("username", username)
        .eq("is_active", true)
        .single();

      if (error) {
        console.error("Admin login error:", error.code);
        return {
          success: false,
          error: "Invalid admin credentials. Please try again.",
        };
      }

      if (!adminUserData) {
        return {
          success: false,
          error: "Invalid admin credentials. Please try again.",
        };
      }

      // Verify password using stored hash and salt
      const hashedPassword = await hashPassword(password, adminUserData.salt);

      if (hashedPassword === adminUserData.password_hash) {
        const adminUser: AdminUser = {
          id: adminUserData.id,
          username: adminUserData.username,
          email: adminUserData.email,
          role: adminUserData.role,
          created_at: adminUserData.created_at,
          last_login: new Date().toISOString(),
          status: adminUserData.is_active ? "active" : "inactive",
        };

        // Update last login time
        const { error: updateError } = await supabase
          .from("admin_users")
          .update({ last_login: new Date().toISOString() })
          .eq("id", adminUserData.id);

        if (updateError) {
          console.error("Error updating last login");
        }

        localStorage.setItem("adminAuthenticated", "true");
        localStorage.setItem("adminUser", JSON.stringify(adminUser));

        setAdminUser(adminUser);
        setIsAdminAuthenticated(true);

        return { success: true };
      } else {
        return {
          success: false,
          error: "Invalid admin credentials. Please try again.",
        };
      }
    } catch (error) {
      console.error("Login error");
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  };

  // Admin logout function
  const adminLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminUser");
    setAdminUser(null);
    setIsAdminAuthenticated(false);
  };

  const value = {
    adminUser,
    isAdminAuthenticated,
    adminLoading,
    adminLogin,
    adminLogout,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}
