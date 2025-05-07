
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({
  children,
}) => {
  const { isAdminAuthenticated, adminLoading } = useAdminAuth();
  const location = useLocation();

  if (adminLoading) {
    // Show a loading state while checking admin authentication
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Verifying admin credentials...</p>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    // Redirect to admin login if not authenticated
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
