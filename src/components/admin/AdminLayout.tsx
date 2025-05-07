import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import {
  Users,
  FileText,
  ClipboardCheck,
  Receipt,
  LogOut,
  Home,
  Settings,
  BarChart,
  Menu,
  ChevronDown,
  LayoutDashboard,
  Building2,
  CreditCard,
  Globe,
  ShieldCheck,
  HelpCircle,
  X,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
  badge?: string;
  badgeVariant?: "default" | "success" | "warning" | "destructive" | "outline";
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  href,
  active,
  badge,
  badgeVariant = "success",
}) => {
  return (
    <li className="list-none">
      <Link
        to={href}
        className={cn(
          "flex items-center justify-between px-4 py-2.5 rounded-lg transition-all duration-200",
          active
            ? "bg-emerald-50 text-emerald-700 font-medium"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        )}
      >
        <div className="flex items-center gap-3">
          <Icon
            size={18}
            className={active ? "text-emerald-600" : "text-gray-400"}
          />
          <span className="text-sm">{label}</span>
        </div>
        {badge && (
          <Badge variant={badgeVariant} className="ml-auto text-xs">
            {badge}
          </Badge>
        )}
      </Link>
    </li>
  );
};

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const { isAdminAuthenticated, adminLoading, adminUser, adminLogout } =
    useAdminAuth();

  // Mock notification count
  const [notificationCount, setNotificationCount] = useState<number>(5);

  // Sidebar width for calculations
  const sidebarWidth = 288; // 72 * 4 = 288px (w-72)

  // Update current time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };

    updateTime(); // Initial call
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Check if admin is authenticated
    if (!adminLoading && !isAdminAuthenticated) {
      navigate("/admin/login");
    }

    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [adminLoading, isAdminAuthenticated, navigate, location.pathname]);

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login");
    toast.success("Logged out successfully");
  };

  const isActive = (path: string) => location.pathname === path;

  // Get current date in a nice format
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Admin Sidebar - Desktop */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 bg-white border-r border-gray-100 transition-all duration-300 lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <img src="/logo.png" alt="logo" className="h-8" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute right-2 top-1/2 -translate-y-1/2 lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <div className="px-3 py-4 h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="space-y-1">
            <SidebarItem
              icon={LayoutDashboard}
              label="Dashboard"
              href="/admin/dashboard"
              active={isActive("/admin/dashboard")}
            />
            <SidebarItem
              icon={Users}
              label="Users"
              href="/admin/users"
              active={isActive("/admin/users")}
              badge={notificationCount.toString()}
              badgeVariant="destructive"
            />
            <SidebarItem
              icon={FileText}
              label="Invoices"
              href="/admin/invoices"
              active={isActive("/admin/invoices")}
            />
            <SidebarItem
              icon={ClipboardCheck}
              label="Quotes"
              href="/admin/quotes"
              active={isActive("/admin/quotes")}
            />
            <SidebarItem
              icon={Receipt}
              label="Receipts"
              href="/admin/receipts"
              active={isActive("/admin/receipts")}
            />
            <SidebarItem
              icon={Settings}
              label="Settings"
              href="/admin/settings"
              active={isActive("/admin/settings")}
            />
          </nav>
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <Button
            variant="ghost"
            className="flex items-center w-full justify-center gap-2 text-gray-600 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300",
          !isMobileMenuOpen && "lg:ml-64"
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200 py-3 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden mr-3"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu size={20} />
              </Button>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {adminUser?.username || "Admin"}
                </h2>
                <p className="text-sm text-gray-500">{today}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={20} />
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {notificationCount}
                  </span>
                )}
              </Button>

              <Avatar className="h-9 w-9 bg-emerald-100 text-emerald-700">
                <AvatarFallback>
                  {adminUser?.username?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
