
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
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm",
        isActive 
          ? "bg-white/10 text-white" 
          : "text-white/70 hover:text-white hover:bg-white/5"
      )}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
}

export function DashboardSidebar() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <aside className="bg-[#0f1b38] h-screen w-[240px] flex flex-col border-r border-white/5">
      <div className="p-4 flex items-center gap-2">
        <Avatar className="h-10 w-10 bg-orange-500 text-white">
          <AvatarFallback>D</AvatarFallback>
        </Avatar>
        <div className="text-white font-medium">Dundy</div>
      </div>
      
      <div className="p-3">
        <Button variant="secondary" className="w-full justify-between bg-[#1e2a4a] hover:bg-[#263358] text-white border-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center">AC</div>
            <span>ACME,INC.</span>
          </div>
          <ChevronRight size={16} />
        </Button>
      </div>
      
      <div className="p-3">
        <div className="text-white/50 text-xs mb-2">Filtrer mon activité</div>
        <div className="space-y-1">
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
      
      <div className="p-3 border-t border-white/10">
        <div className="text-white/50 text-xs mb-2">Se faire payer</div>
        <div className="space-y-1">
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
      
      <div className="p-3">
        <div className="text-white/50 text-xs mb-2">Gérer ma structure</div>
        <div className="space-y-1">
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
      
      <div className="mt-auto p-3 border-t border-white/10">
        <div className="space-y-1">
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
