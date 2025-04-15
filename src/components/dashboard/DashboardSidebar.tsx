
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  FileText, 
  Users, 
  FileCheck, 
  Receipt, 
  Package, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  LogOut,
  CreditCard,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isCollapsed: boolean;
  isActive?: boolean;
}

function SidebarLink({ to, icon: Icon, label, isCollapsed, isActive }: SidebarLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-all",
        isActive 
          ? "bg-sidebar-accent text-sidebar-accent-foreground" 
          : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/30"
      )}
    >
      <Icon size={20} />
      {!isCollapsed && <span>{label}</span>}
    </Link>
  );
}

export function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <aside 
      className={cn(
        "bg-sidebar h-screen transition-all duration-300 border-r flex flex-col",
        isCollapsed ? "w-[60px]" : "w-[240px]"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b">
        {!isCollapsed ? (
          <Logo variant="white" />
        ) : (
          <div className="mx-auto">
            <div className="gradient-bg p-1.5 rounded">
              <FileText className="text-white" size={20} />
            </div>
          </div>
        )}
      </div>
      
      <div className="flex flex-col flex-1 py-4 overflow-y-auto">
        <nav className="space-y-1 px-2">
          <SidebarLink 
            to="/dashboard" 
            icon={Home} 
            label="Dashboard" 
            isCollapsed={isCollapsed}
            isActive={isActive("/dashboard")}
          />
          <SidebarLink 
            to="/dashboard/invoices" 
            icon={FileText} 
            label="Invoices" 
            isCollapsed={isCollapsed}
            isActive={isActive("/dashboard/invoices")}
          />
          <SidebarLink 
            to="/dashboard/clients" 
            icon={Users} 
            label="Clients" 
            isCollapsed={isCollapsed}
            isActive={isActive("/dashboard/clients")}
          />
          <SidebarLink 
            to="/dashboard/quotes" 
            icon={FileCheck} 
            label="Quotes" 
            isCollapsed={isCollapsed}
            isActive={isActive("/dashboard/quotes")}
          />
          <SidebarLink 
            to="/dashboard/expenses" 
            icon={Receipt} 
            label="Expenses" 
            isCollapsed={isCollapsed}
            isActive={isActive("/dashboard/expenses")}
          />
          <SidebarLink 
            to="/dashboard/products" 
            icon={Package} 
            label="Products" 
            isCollapsed={isCollapsed}
            isActive={isActive("/dashboard/products")}
          />
          <SidebarLink 
            to="/dashboard/reports" 
            icon={BarChart3} 
            label="Reports" 
            isCollapsed={isCollapsed}
            isActive={isActive("/dashboard/reports")}
          />
          <SidebarLink 
            to="/dashboard/payments" 
            icon={CreditCard} 
            label="Payments" 
            isCollapsed={isCollapsed}
            isActive={isActive("/dashboard/payments")}
          />
        </nav>
      </div>
      
      <div className="p-2 border-t">
        <nav className="space-y-1">
          <SidebarLink 
            to="/dashboard/settings" 
            icon={Settings} 
            label="Settings" 
            isCollapsed={isCollapsed}
            isActive={isActive("/dashboard/settings")}
          />
          <SidebarLink 
            to="/logout" 
            icon={LogOut} 
            label="Logout" 
            isCollapsed={isCollapsed}
          />
        </nav>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute bottom-4 -right-3 h-6 w-6 rounded-full bg-primary text-primary-foreground border border-primary shadow-md"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </Button>
    </aside>
  );
}
