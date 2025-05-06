import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { 
  Users, FileText, ClipboardCheck, Receipt, 
  LogOut, Home, Settings, BarChart,
  Menu, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, href, active }) => {
  return (
    <li>
      <Link
        to={href}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors",
          active 
            ? "bg-[#4caf50]/10 text-[#4caf50] font-medium" 
            : "hover:bg-gray-100 text-gray-700"
        )}
      >
        <Icon size={18} className={active ? "text-[#4caf50]" : "text-gray-500"} />
        <span>{label}</span>
      </Link>
    </li>
  );
};

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");

  // Update current time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    
    updateTime(); // Initial call
    const interval = setInterval(updateTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Check if admin is authenticated
    const isAdminAuthenticated = localStorage.getItem("adminAuthenticated");
    if (!isAdminAuthenticated) {
      navigate("/admin/login");
    }

    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    navigate("/admin/login");
    toast.success("Logged out successfully");
  };

  const isActive = (path: string) => location.pathname === path;
  
  // Get current date in a nice format
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Admin Sidebar - Desktop */}
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-full w-64 bg-white shadow-sm border-r border-gray-200 transition-transform lg:translate-x-0 lg:static",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-5 border-b border-gray-100 bg-[#4caf50] text-white">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <p className="text-xs mt-1 text-green-50">Manage your application</p>
        </div>
        
        <nav className="p-4 space-y-6">
          <div>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">Overview</h2>
            <ul className="space-y-1">
              <SidebarItem 
                icon={Home} 
                label="Dashboard" 
                href="/admin/dashboard" 
                active={isActive("/admin/dashboard")}
              />
            </ul>
          </div>
          
          <div>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">Management</h2>
            <ul className="space-y-1">
              <SidebarItem 
                icon={Users} 
                label="Users" 
                href="/admin/users" 
                active={isActive("/admin/users")}
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
                icon={BarChart} 
                label="Subscriptions" 
                href="/admin/subscriptions" 
                active={isActive("/admin/subscriptions")}
              />
            </ul>
          </div>
          
          <div>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">Configuration</h2>
            <ul className="space-y-1">
              <SidebarItem 
                icon={Settings} 
                label="Settings" 
                href="/admin/settings" 
                active={isActive("/admin/settings")}
              />
            </ul>
          </div>
          
          <div className="mt-auto pt-6">
            <Button
              variant="ghost"
              className="flex items-center w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={handleLogout}
            >
              <LogOut size={18} className="mr-2" />
              <span>Logout</span>
            </Button>
          </div>
        </nav>
      </aside>

      {/* Main Content with Header */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 py-4 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden mr-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu size={20} />
              </Button>
              <div>
                <h2 className="text-lg font-semibold">Welcome, Admin</h2>
                <p className="text-sm text-gray-500">{today}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium">{currentTime}</p>
                <p className="text-xs text-gray-500">Local time</p>
              </div>
              
              <Avatar className="h-9 w-9 bg-[#4caf50]/10 text-[#4caf50]">
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
      
      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
