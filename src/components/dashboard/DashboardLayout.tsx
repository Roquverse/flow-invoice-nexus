import { Outlet, Navigate } from "react-router-dom";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import "@/styles/dashboard.css";

export function DashboardLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Toggle sidebar menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Close sidebar
  const closeSidebar = () => {
    setMenuOpen(false);
  };

  // Handle document clicks to close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If sidebar is open and click is outside sidebar
      if (
        menuOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        // But don't close if clicking the hamburger button (handled by toggleMenu)
        if ((event.target as Element).closest(".md\\:hidden")) {
          return;
        }
        closeSidebar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // Close menu when window resizes beyond mobile breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && menuOpen) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuOpen]);

  // Prevent body scrolling when sidebar is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f8f9fc]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <div className="flex h-screen">
      {/* Apply 'open' class to sidebar on mobile when menu is toggled */}
      <div
        ref={sidebarRef}
        className={`dashboard-sidebar-container ${
          menuOpen ? "sidebar-open" : ""
        }`}
      >
        <DashboardSidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader onMenuToggle={toggleMenu} />
        <main className="dashboard-main">
          <div className="dashboard-content">
            <Outlet />
          </div>
        </main>
      </div>
      {/* Mobile menu overlay */}
      <div
        className={`menu-overlay ${menuOpen ? "open" : ""}`}
        onClick={closeSidebar}
      ></div>
    </div>
  );
}
