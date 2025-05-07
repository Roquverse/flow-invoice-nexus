
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin as adminLoginService } from "@/services/adminService";
import { AdminUser } from "@/types/admin";

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  adminLoading: boolean;
  adminLogin: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  adminUser: null,
  isAdminAuthenticated: false,
  adminLoading: true,
  adminLogin: async () => ({ success: false }),
  adminLogout: () => {},
});

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminLoading, setAdminLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAuth = () => {
      const storedUser = sessionStorage.getItem("adminUser");
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setAdminUser(user);
        } catch (error) {
          console.error("Error parsing admin user data:", error);
          sessionStorage.removeItem("adminUser");
        }
      }
      setAdminLoading(false);
    };

    checkAdminAuth();
  }, []);

  const adminLogin = async (username: string, password: string) => {
    try {
      const result = await adminLoginService({ username, password });

      if (result.success && result.user) {
        setAdminUser(result.user);
        sessionStorage.setItem("adminUser", JSON.stringify(result.user));
        return { success: true };
      } else {
        return { success: false, error: result.message || "Login failed" };
      }
    } catch (error) {
      console.error("Admin login error:", error);
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  const adminLogout = () => {
    setAdminUser(null);
    sessionStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  const value = {
    adminUser,
    isAdminAuthenticated: !!adminUser,
    adminLoading,
    adminLogin,
    adminLogout,
  };

  return (
    <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
  );
};

export default AdminAuthContext;
