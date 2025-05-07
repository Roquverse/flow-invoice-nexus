import { supabase } from "@/integrations/supabase/client";

// Define types for admin data
export interface AdminUser {
  id: string;
  email: string;
  username: string;
  role: string;
  created_at: string;
  last_login?: string;
  status: "active" | "inactive" | "suspended";
}

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface CompanySetting {
  user_id: string;
  company_name: string | null;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  totalInvoices: number;
  paidInvoices: number;
  overdueInvoices: number;
  totalQuotes: number;
  acceptedQuotes: number;
  pendingQuotes: number;
  rejectedQuotes: number;
  averageInvoiceAmount: number;
  totalRevenue: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
  cancelledSubscriptions: number;
}

export interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  totalInvoices: number;
  paidInvoices: number;
  overdueInvoices: number;
  totalQuotes: number;
  acceptedQuotes: number;
  pendingQuotes: number;
  rejectedQuotes: number;
  averageInvoiceAmount: number;
  totalRevenue: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
  cancelledSubscriptions: number;
}

// User Management
export async function getAdminUsers(): Promise<AdminUser[]> {
  try {
    // Get regular users first
    const { data: regularUsers, error: userError } = await supabase
      .from("user_profiles")
      .select(
        `
        id,
        first_name,
        last_name,
        email,
        phone,
        avatar_url,
        created_at
      `
      )
      .order("created_at", { ascending: false });

    if (userError) {
      console.error("Error fetching users:", userError);
      return [];
    }

    // Get admin user IDs to exclude
    const { data: adminUsers, error: adminError } = await supabase
      .from("admin_users")
      .select("id");

    if (adminError) {
      console.error("Error fetching admin users:", adminError);
      return [];
    }

    const adminIds = new Set(adminUsers?.map((user) => user.id) || []);

    // Filter out admin users
    const filteredUsers =
      regularUsers?.filter((user) => !adminIds.has(user.id)) || [];

    // Get company settings for these users
    const { data: companySettings, error: companyError } = await supabase
      .from("company_settings")
      .select("user_id, company_name")
      .in(
        "user_id",
        filteredUsers.map((user) => user.id)
      );

    if (companyError) {
      console.error("Error fetching company settings:", companyError);
      return [];
    }

    // Create a map of user_id to company_name
    const companyMap = new Map(
      companySettings?.map((setting) => [
        setting.user_id,
        setting.company_name,
      ]) || []
    );

    return filteredUsers.map((user: UserProfile) => ({
      id: user.id,
      email: user.email,
      username:
        companyMap.get(user.id) ||
        `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
        "Unnamed User",
      role: "user",
      created_at: user.created_at,
      last_login: null,
      status: "active",
    }));
  } catch (e) {
    console.error("Error accessing users:", e);
    return [];
  }
}

export const getAdminDashboardStats =
  async (): Promise<AdminDashboardStats> => {
    try {
      // Get total users count (excluding admin users)
      const { count: totalUsers, error: usersError } = await supabase
        .from("user_profiles")
        .select("*", { count: "exact", head: true })
        .not(
          "id",
          "in",
          (
            await supabase.from("admin_users").select("id")
          ).data?.map((u) => u.id) || []
        );

      if (usersError) throw usersError;

      // Get active users (users who have logged in within the last 30 days, excluding admins)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: activeUsers, error: activeUsersError } = await supabase
        .from("session_history")
        .select("user_id", { count: "exact", head: true })
        .gte("login_at", thirtyDaysAgo.toISOString())
        .not(
          "user_id",
          "in",
          (
            await supabase.from("admin_users").select("id")
          ).data?.map((u) => u.id) || []
        );

      if (activeUsersError) throw activeUsersError;

      // Get new users (users who registered in the last 30 days, excluding admins)
      const { count: newUsers, error: newUsersError } = await supabase
        .from("user_profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", thirtyDaysAgo.toISOString())
        .not(
          "id",
          "in",
          (
            await supabase.from("admin_users").select("id")
          ).data?.map((u) => u.id) || []
        );

      if (newUsersError) throw newUsersError;

      // Get subscription stats (excluding admin users)
      const { data: subscriptionStats, error: subscriptionError } =
        await supabase
          .from("billing_settings")
          .select("subscription_status, user_id")
          .not(
            "user_id",
            "in",
            (
              await supabase.from("admin_users").select("id")
            ).data?.map((u) => u.id) || []
          );

      if (subscriptionError) throw subscriptionError;

      const subscriptionCounts = subscriptionStats.reduce(
        (acc, curr) => {
          acc.totalSubscriptions++;
          if (curr.subscription_status === "active") acc.activeSubscriptions++;
          if (curr.subscription_status === "trial") acc.trialSubscriptions++;
          if (curr.subscription_status === "cancelled")
            acc.cancelledSubscriptions++;
          return acc;
        },
        {
          totalSubscriptions: 0,
          activeSubscriptions: 0,
          trialSubscriptions: 0,
          cancelledSubscriptions: 0,
        }
      );

      // For now, return mock data for invoices and quotes
      // TODO: Implement real data fetching when those tables are created
      return {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        newUsers: newUsers || 0,
        totalInvoices: 0,
        paidInvoices: 0,
        overdueInvoices: 0,
        totalQuotes: 0,
        acceptedQuotes: 0,
        pendingQuotes: 0,
        rejectedQuotes: 0,
        averageInvoiceAmount: 0,
        totalRevenue: 0,
        ...subscriptionCounts,
      };
    } catch (error) {
      console.error("Error fetching admin dashboard stats:", error);
      throw error;
    }
  };

// Invoice management for admin
export async function getAdminInvoices() {
  try {
    const { data: invoices, error } = await supabase
      .from("invoices")
      .select(
        `
        *,
        clients!client_id (
          id,
          business_name,
          contact_name,
          email
        ),
        invoice_items (
          id,
          description,
          quantity,
          unit_price,
          amount
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching invoices:", error);
      return [];
    }

    // Get user profiles for the invoices
    const userIds = [
      ...new Set(invoices?.map((invoice) => invoice.user_id) || []),
    ];
    const { data: userProfiles, error: userError } = await supabase
      .from("user_profiles")
      .select("id, first_name, last_name, email")
      .in("id", userIds);

    if (userError) {
      console.error("Error fetching user profiles:", userError);
      return [];
    }

    // Create a map of user_id to user profile
    const userMap = new Map(userProfiles?.map((user) => [user.id, user]) || []);

    return (
      invoices?.map((invoice) => ({
        ...invoice,
        status: invoice.status as
          | "draft"
          | "sent"
          | "viewed"
          | "paid"
          | "overdue"
          | "cancelled",
        client: invoice.clients,
        user: userMap.get(invoice.user_id),
        items: invoice.invoice_items,
      })) || []
    );
  } catch (e) {
    console.error("Error accessing invoices:", e);
    return [];
  }
}

// Quote management for admin
export async function getAdminQuotes() {
  try {
    const { data: quotes, error } = await supabase
      .from("quotes")
      .select(
        `
        *,
        clients!client_id (
          id,
          business_name,
          contact_name,
          email
        ),
        quote_items (
          id,
          description,
          quantity,
          unit_price,
          amount
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching quotes:", error);
      return [];
    }

    // Get user profiles for the quotes
    const userIds = [...new Set(quotes?.map((quote) => quote.user_id) || [])];
    const { data: userProfiles, error: userError } = await supabase
      .from("user_profiles")
      .select("id, first_name, last_name, email")
      .in("id", userIds);

    if (userError) {
      console.error("Error fetching user profiles:", userError);
      return [];
    }

    // Create a map of user_id to user profile
    const userMap = new Map(userProfiles?.map((user) => [user.id, user]) || []);

    return (
      quotes?.map((quote) => ({
        ...quote,
        status: quote.status as
          | "draft"
          | "sent"
          | "viewed"
          | "accepted"
          | "rejected"
          | "expired",
        client: quote.clients,
        user: userMap.get(quote.user_id),
        items: quote.quote_items,
      })) || []
    );
  } catch (e) {
    console.error("Error accessing quotes:", e);
    return [];
  }
}

// Receipt management for admin
export async function getAdminReceipts() {
  try {
    const { data: receipts, error } = await supabase
      .from("receipts")
      .select(
        `
        *,
        clients!client_id (
          id,
          business_name,
          contact_name,
          email
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching receipts:", error);
      return [];
    }

    // Get user profiles for the receipts
    const userIds = [
      ...new Set(receipts?.map((receipt) => receipt.user_id) || []),
    ];
    const { data: userProfiles, error: userError } = await supabase
      .from("user_profiles")
      .select("id, first_name, last_name, email")
      .in("id", userIds);

    if (userError) {
      console.error("Error fetching user profiles:", userError);
      return [];
    }

    // Create a map of user_id to user profile
    const userMap = new Map(userProfiles?.map((user) => [user.id, user]) || []);

    return (
      receipts?.map((receipt) => ({
        ...receipt,
        client: receipt.clients,
        user: userMap.get(receipt.user_id),
      })) || []
    );
  } catch (e) {
    console.error("Error accessing receipts:", e);
    return [];
  }
}

// Subscription management (mock data for now)
export async function getAdminSubscriptions() {
  try {
    // In a real app, you would fetch from a subscriptions table
    // This is a placeholder for mock data
    const { data: users } = await supabase
      .from("user_profiles")
      .select("*")
      .limit(20);

    if (!users) return [];

    // Generate mock subscription data based on real users
    return users.map((user, index) => ({
      id: `sub-${index + 1}`,
      user_id: user.user_id,
      username: user.display_name,
      email: user.email,
      plan:
        index % 3 === 0 ? "premium" : index % 3 === 1 ? "standard" : "basic",
      status:
        index % 4 === 0 ? "trial" : index % 10 === 0 ? "cancelled" : "active",
      started_at: user.created_at,
      renewal_date: new Date(
        new Date().setDate(new Date().getDate() + 30 * ((index % 6) + 1))
      ).toISOString(),
      amount: index % 3 === 0 ? 49.99 : index % 3 === 1 ? 24.99 : 9.99,
    }));
  } catch (e) {
    console.error("Error accessing subscriptions:", e);
    return [];
  }
}

// Create admin user
export async function createAdminUser(userData: Partial<AdminUser>) {
  try {
    const { data, error } = await supabase
      .from("admin_users")
      .insert({
        username: userData.username,
        email: userData.email,
        role: userData.role || "admin",
        is_active: true,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating admin user:", error);
      return null;
    }

    return data;
  } catch (e) {
    console.error("Error creating admin user:", e);
    return null;
  }
}

// Update user status
export async function updateUserStatus(
  userId: string,
  status: "active" | "inactive" | "suspended"
) {
  try {
    // Try admin users table first
    let { error } = await supabase
      .from("admin_users")
      .update({ is_active: status === "active" })
      .eq("id", userId);

    if (error) {
      // If that fails, try user_profiles
      ({ error } = await supabase
        .from("user_profiles")
        .update({ status })
        .eq("user_id", userId));
    }

    if (error) {
      console.error("Error updating user status:", error);
      return false;
    }

    return true;
  } catch (e) {
    console.error("Error updating user status:", e);
    return false;
  }
}

// Delete user
export async function deleteUser(userId: string) {
  try {
    // Try admin_users first
    let { error } = await supabase
      .from("admin_users")
      .delete()
      .eq("id", userId);

    if (error) {
      // Then try user_profiles
      ({ error } = await supabase
        .from("user_profiles")
        .delete()
        .eq("user_id", userId));
    }

    if (error) {
      console.error("Error deleting user:", error);
      return false;
    }

    return true;
  } catch (e) {
    console.error("Error deleting user:", e);
    return false;
  }
}
