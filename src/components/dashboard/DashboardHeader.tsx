import { useState, useEffect } from "react";
import { Bell, Menu, Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SignOutButton } from "@/components/SignOutButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useInvoices } from "@/hooks/useInvoices";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import { formatDate } from "@/utils/formatters";
import "@/styles/dashboard.css";

interface DashboardHeaderProps {
  onMenuToggle?: () => void;
}

export function DashboardHeader({ onMenuToggle }: DashboardHeaderProps) {
  const [user, setUser] = useState<any>(null);
  const { invoices } = useInvoices();
  const { profile } = useProfileSettings();
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const navigate = useNavigate();

  // Get user on component mount
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      }
    };
    getUser();
  }, []);

  // Set recent invoices when invoices data is loaded
  useEffect(() => {
    if (invoices && invoices.length > 0) {
      // Get the 3 most recent invoices
      const recent = [...invoices]
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 3);
      setRecentInvoices(recent);
    }
  }, [invoices]);

  // Get user first name
  const getFirstName = () => {
    // First try to get name from profile settings
    if (profile?.first_name) {
      return profile.first_name;
    }

    // Fall back to user metadata if profile not available
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(" ")[0];
    }

    return "User";
  };

  // Get first letter of user's name for avatar
  const getUserFirstLetter = () => {
    // First try to get letter from profile settings
    if (profile?.first_name) {
      return profile.first_name.trim()[0].toUpperCase();
    }

    // Fall back to user metadata
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.trim()[0].toUpperCase();
    }

    return "U";
  };

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-content">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="md:hidden"
          >
            <Menu size={20} />
          </Button>
          <div className="hidden md:flex items-center gap-3">
            <div className="text-lg font-medium hidden lg:block">
              Welcome, <span className="text-primary">{getFirstName()}</span>
            </div>
          </div>
        </div>

        <div className="user-menu">
          <div className="hidden md:block">
            <SignOutButton />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="notification-button"
              >
                <Bell size={20} />
                <span className="notification-badge">
                  {recentInvoices.length}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
              <DropdownMenuLabel>Recent Invoices</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {recentInvoices.length === 0 ? (
                <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                  No recent invoices
                </div>
              ) : (
                recentInvoices.map((invoice) => (
                  <DropdownMenuItem
                    key={invoice.id}
                    onClick={() =>
                      navigate(`/dashboard/invoices/${invoice.id}`)
                    }
                    className="flex items-center gap-2 p-3 cursor-pointer"
                  >
                    <div className="flex-shrink-0 h-9 w-9 bg-primary/10 rounded-full flex items-center justify-center">
                      <FileText size={16} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {invoice.invoice_number}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(invoice.issue_date)} - ${invoice.total}
                      </p>
                    </div>
                    <div
                      className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${
                        invoice.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : invoice.status === "overdue"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    `}
                    >
                      {invoice.status.charAt(0).toUpperCase() +
                        invoice.status.slice(1)}
                    </div>
                  </DropdownMenuItem>
                ))
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate("/dashboard/invoices")}
                className="justify-center text-sm font-medium text-primary"
              >
                View All Invoices
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full"
                size="icon"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={user?.user_metadata?.avatar_url || ""}
                    alt="User avatar"
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getUserFirstLetter()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {getFirstName() || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || ""}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/dashboard/settings")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/dashboard/settings")}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <SignOutButton variant="ghost" withIcon={false} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
