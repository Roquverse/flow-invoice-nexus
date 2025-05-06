
import React, { useEffect } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { 
  Users, FileText, ClipboardCheck, Receipt, 
  LogOut, Home, Settings, BarChart
} from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is authenticated
    const isAdminAuthenticated = localStorage.getItem("adminAuthenticated");
    if (!isAdminAuthenticated) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 bg-[#4caf50] text-white">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md"
              >
                <Home size={18} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/users"
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md"
              >
                <Users size={18} />
                <span>Users</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/invoices"
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md"
              >
                <FileText size={18} />
                <span>Invoices</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/quotes"
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md"
              >
                <ClipboardCheck size={18} />
                <span>Quotes</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/receipts"
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md"
              >
                <Receipt size={18} />
                <span>Receipts</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/subscriptions"
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md"
              >
                <BarChart size={18} />
                <span>Subscriptions</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/settings"
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md"
              >
                <Settings size={18} />
                <span>Settings</span>
              </Link>
            </li>
            <li className="mt-6">
              <Button
                variant="ghost"
                className="flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 hover:text-red-600 w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </Button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
