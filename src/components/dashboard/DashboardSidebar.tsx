import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  ChevronRight,
  Receipt,
  ClipboardCheck,
  FolderKanban,
  CreditCard,
  PieChart,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import "@/styles/dashboard.css";

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
}

function SidebarLink({ to, icon: Icon, label, isActive }: SidebarLinkProps) {
  return (
    <Link to={to} className={cn("nav-link", isActive && "active")}>
      <span className="nav-link-content">
        <Icon className="nav-icon" />
        <span className="nav-label">{label}</span>
      </span>
    </Link>
  );
}

export function DashboardSidebar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <img src="/logo.png" alt="Logo" className="logo" />
        </div>
      </div>

      <div className="nav-section">
        <Button className="organization-switcher">
          <div className="flex items-center gap-2">
            <div className="organization-badge">AC</div>
            <span>ACME,INC.</span>
          </div>
          <ChevronRight size={16} />
        </Button>
      </div>

      <div className="nav-section">
        <div className="nav-section-title">Overview</div>
        <div className="nav-links">
          <SidebarLink
            to="/dashboard"
            icon={LayoutDashboard}
            label="Dashboard"
            isActive={isActive("/dashboard")}
          />
          <SidebarLink
            to="/dashboard/analytics"
            icon={PieChart}
            label="Analytics"
            isActive={isActive("/dashboard/analytics")}
          />
        </div>

        <div className="nav-section-title">Documents</div>
        <div className="nav-links">
          <SidebarLink
            to="/dashboard/invoices"
            icon={FileText}
            label="Invoices"
            isActive={isActive("/dashboard/invoices")}
          />
          <SidebarLink
            to="/dashboard/quotes"
            icon={ClipboardCheck}
            label="Quotes"
            isActive={isActive("/dashboard/quotes")}
          />
          <SidebarLink
            to="/dashboard/receipts"
            icon={Receipt}
            label="Receipts"
            isActive={isActive("/dashboard/receipts")}
          />
        </div>

        <div className="nav-section-title">Management</div>
        <div className="nav-links">
          <SidebarLink
            to="/dashboard/clients"
            icon={Users}
            label="Clients"
            isActive={isActive("/dashboard/clients")}
          />
          <SidebarLink
            to="/dashboard/projects"
            icon={FolderKanban}
            label="Projects"
            isActive={isActive("/dashboard/projects")}
          />
          <SidebarLink
            to="/dashboard/payments"
            icon={CreditCard}
            label="Payments"
            isActive={isActive("/dashboard/payments")}
          />
        </div>
      </div>

      <div className="nav-section mt-auto">
        <div className="nav-section-title">Account</div>
        <div className="nav-links">
          <SidebarLink
            to="/dashboard/settings"
            icon={Settings}
            label="Settings"
            isActive={isActive("/dashboard/settings")}
          />
        </div>
      </div>
    </aside>
  );
}
