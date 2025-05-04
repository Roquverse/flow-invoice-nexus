import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  FileText,
  Users,
  Package,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  CreditCard,
  Home,
  Clock,
  Filter,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
      <Icon className="nav-icon" />
      <span>{label}</span>
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
          <Avatar className="h-10 w-10 bg-orange-500 text-white">
            <AvatarFallback>D</AvatarFallback>
          </Avatar>
          <div className="text-white font-medium">Dundy</div>
        </div>
      </div>

      <div className="nav-section">
        <Button variant="secondary" className="organization-switcher">
          <div className="flex items-center gap-2">
            <div className="organization-badge">AC</div>
            <span>ACME,INC.</span>
          </div>
          <ChevronRight size={16} />
        </Button>
      </div>

      <div className="nav-section">
        <div className="nav-section-title">Filtrer mon activité</div>
        <div className="nav-links">
          <SidebarLink
            to="/dashboard"
            icon={Calendar}
            label="Aujourd'hui"
            isActive={isActive("/dashboard")}
          />
          <SidebarLink
            to="/dashboard/transactions"
            icon={Filter}
            label="Transactions"
            isActive={isActive("/dashboard/transactions")}
          />
        </div>
      </div>

      <div className="nav-section">
        <div className="nav-section-title">Se faire payer</div>
        <div className="nav-links">
          <SidebarLink
            to="/dashboard/invoices"
            icon={FileText}
            label="Factures"
            isActive={isActive("/dashboard/invoices")}
          />
          <SidebarLink
            to="/dashboard/reminders"
            icon={Clock}
            label="Relances"
            isActive={isActive("/dashboard/reminders")}
          />
          <SidebarLink
            to="/dashboard/clients"
            icon={Users}
            label="Clients"
            isActive={isActive("/dashboard/clients")}
          />
        </div>
      </div>

      <div className="nav-section">
        <div className="nav-section-title">Gérer ma structure</div>
        <div className="nav-links">
          <SidebarLink
            to="/dashboard/team"
            icon={Users}
            label="Équipe"
            isActive={isActive("/dashboard/team")}
          />
          <SidebarLink
            to="/dashboard/settings"
            icon={Settings}
            label="Paramètres"
            isActive={isActive("/dashboard/settings")}
          />
        </div>
      </div>

      <div className="nav-section mt-auto">
        <div className="nav-links">
          <SidebarLink
            to="/dashboard/account"
            icon={Settings}
            label="Mon entreprise"
            isActive={isActive("/dashboard/account")}
          />
        </div>
      </div>
    </aside>
  );
}
