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
  PieChart,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCompanySettings } from "@/hooks/useCompanySettings";
import "@/styles/dashboard.css";

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
}

function SidebarLink({ to, icon: Icon, label, isActive }: SidebarLinkProps) {
  return (
    <Link
      to={to}
      className={cn("nav-link mobile-nav-link", isActive && "active")}
    >
      <span className="nav-link-content mobile-nav-link-content">
        <Icon className="nav-icon mobile-nav-icon" />
        <span className="nav-label mobile-nav-label">{label}</span>
      </span>
    </Link>
  );
}

export function DashboardSidebar() {
  const location = useLocation();
  const { companySettings, loading } = useCompanySettings();

  const isActive = (path: string) => location.pathname === path;

  // Get company initials for the badge
  const getCompanyInitials = () => {
    if (!companySettings?.company_name) return "AC";

    const words = companySettings.company_name.split(" ");
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  return (
    <aside className="dashboard-sidebar mobile-dashboard-sidebar">
      <div className="sidebar-header mobile-sidebar-header">
        <div className="logo-container mobile-logo-container">
          <img src="/logo.png" alt="Logo" className="logo mobile-logo" />
        </div>
      </div>

      <div className="nav-section mobile-nav-section">
        <Button className="organization-switcher mobile-organization-switcher">
          <div className="flex items-center gap-2">
            <span className="mobile-company-name">
              {companySettings?.company_name || "My Company"}
            </span>
          </div>
          <ChevronRight size={16} />
        </Button>
      </div>

      <div className="nav-section mobile-nav-section">
        <div className="nav-section-title mobile-nav-section-title">
          Overview
        </div>
        <div className="nav-links mobile-nav-links">
          <SidebarLink
            to="/dashboard"
            icon={LayoutDashboard}
            label="Dashboard"
            isActive={isActive("/dashboard")}
          />
        </div>

        <div className="nav-section-title mobile-nav-section-title">
          Documents
        </div>
        <div className="nav-links mobile-nav-links">
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

        <div className="nav-section-title mobile-nav-section-title">
          Management
        </div>
        <div className="nav-links mobile-nav-links">
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
        </div>
      </div>

      <div className="nav-section mt-auto mobile-nav-section">
        <div className="nav-section-title mobile-nav-section-title">
          Account
        </div>
        <div className="nav-links mobile-nav-links">
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
