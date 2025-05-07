
import { supabase } from "@/integrations/supabase/client";
import bcrypt from 'bcryptjs';

// Admin types - should be moved to types/admin.ts in a refactor
interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string | null;
}

interface AdminLoginRequest {
  username: string;
  password: string;
}

interface AdminLoginResponse {
  success: boolean;
  user?: AdminUser;
  message?: string;
  error?: Error;
}

interface AdminUserCreateRequest {
  username: string;
  password: string;
  email: string;
  role?: string;
}

// Helper function to hash passwords
const hashPassword = async (password: string): Promise<{ hash: string, salt: string }> => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return { hash, salt };
};

// Verify password
const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

// Admin login
export const adminLogin = async (credentials: AdminLoginRequest): Promise<AdminLoginResponse> => {
  try {
    // Get admin user by username
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', credentials.username)
      .maybeSingle();

    if (error) {
      return { success: false, message: error.message, error };
    }

    if (!adminUser) {
      return { success: false, message: "Invalid username or password" };
    }

    // Verify password
    const isPasswordValid = await verifyPassword(credentials.password, adminUser.password_hash);

    if (!isPasswordValid) {
      return { success: false, message: "Invalid username or password" };
    }

    if (!adminUser.is_active) {
      return { success: false, message: "User account is inactive" };
    }

    // Update last login timestamp
    await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', adminUser.id);

    // Return cleaned user object (without password hash and salt)
    const { password_hash, salt, ...safeUserData } = adminUser;

    return {
      success: true,
      user: safeUserData as AdminUser
    };
  } catch (error) {
    console.error("Error during admin login:", error);
    return { 
      success: false, 
      message: "An error occurred during login",
      error: error instanceof Error ? error : new Error("Unknown error")
    };
  }
};

// Create admin user
export const createAdminUser = async (userData: AdminUserCreateRequest): Promise<{ success: boolean, message: string, user?: AdminUser }> => {
  try {
    // Check if username already exists
    const { data: existingUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('username', userData.username)
      .maybeSingle();

    if (existingUser) {
      return { success: false, message: "Username already exists" };
    }

    // Check if email already exists
    const { data: existingEmail } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', userData.email)
      .maybeSingle();

    if (existingEmail) {
      return { success: false, message: "Email already exists" };
    }

    // Hash password
    const { hash, salt } = await hashPassword(userData.password);

    // Insert new user with proper field structure
    const { data, error } = await supabase
      .from('admin_users')
      .insert({
        username: userData.username,
        email: userData.email,
        password_hash: hash,
        salt: salt,
        role: userData.role || 'admin',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating admin user:", error);
      return { success: false, message: error.message };
    }

    // Return cleaned user object
    const { password_hash: _, salt: __, ...safeUserData } = data;

    return {
      success: true,
      message: "Admin user created successfully",
      user: safeUserData as AdminUser
    };
  } catch (error) {
    console.error("Error creating admin user:", error);
    return { 
      success: false, 
      message: "An error occurred while creating the user"
    };
  }
};

// Get all users with formatted data
export const getAdminUsers = async (): Promise<AdminUser[]> => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Clean user data before returning (remove password hashes)
    return data.map(user => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash, salt, ...safeUser } = user;
      return safeUser as AdminUser;
    });
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return [];
  }
};

// Get admin user by ID
export const getAdminUserById = async (id: string): Promise<AdminUser | null> => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    // Clean user data before returning
    if (data) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash, salt, ...safeUser } = data;
      return safeUser as AdminUser;
    }

    return null;
  } catch (error) {
    console.error("Error fetching admin user:", error);
    return null;
  }
};

// Update admin user
export const updateAdminUser = async (id: string, userData: Partial<AdminUser>): Promise<{ success: boolean, message: string }> => {
  try {
    // Don't allow updating password through this function
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, salt, ...updateData } = userData;

    const { error } = await supabase
      .from('admin_users')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: "User updated successfully" };
  } catch (error) {
    console.error("Error updating admin user:", error);
    return { success: false, message: "An error occurred while updating the user" };
  }
};

// Change admin user password
export const changeAdminPassword = async (id: string, currentPassword: string, newPassword: string): Promise<{ success: boolean, message: string }> => {
  try {
    // Get current user data
    const { data: user, error: fetchError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !user) {
      return { success: false, message: "User not found" };
    }

    // Verify current password
    const isPasswordValid = await verifyPassword(currentPassword, user.password_hash);
    
    if (!isPasswordValid) {
      return { success: false, message: "Current password is incorrect" };
    }

    // Hash new password
    const { hash, salt } = await hashPassword(newPassword);

    // Update password
    const { error } = await supabase
      .from('admin_users')
      .update({
        password_hash: hash,
        salt: salt,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: "Password changed successfully" };
  } catch (error) {
    console.error("Error changing admin password:", error);
    return { success: false, message: "An error occurred while changing the password" };
  }
};

// Delete admin user
export const deleteAdminUser = async (id: string): Promise<{ success: boolean, message: string }> => {
  try {
    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    console.error("Error deleting admin user:", error);
    return { success: false, message: "An error occurred while deleting the user" };
  }
};

// Functions for admin dashboard
export const getAdminDashboardStats = async () => {
  // This would be replaced with actual stats collection
  return {
    userCount: 0,
    invoiceCount: 0,
    quoteCount: 0,
    receiptCount: 0,
    recentActivity: []
  };
};

// Get all users (client app users, not admin users)
export const getAppUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Format user data for display
    return data.map(user => ({
      id: user.id,
      name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown',
      email: user.email,
      created_at: user.created_at,
      avatar_url: user.avatar_url || null,
    }));
  } catch (error) {
    console.error("Error fetching app users:", error);
    return [];
  }
};

// Get all invoices for admin
export const getAdminInvoices = async () => {
  try {
    // Join invoices with clients to get client data
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        clients(business_name, contact_name, email)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching admin invoices:", error);
    return [];
  }
};

// Get all quotes for admin
export const getAdminQuotes = async () => {
  try {
    // Join quotes with clients to get client data
    const { data, error } = await supabase
      .from('quotes')
      .select(`
        *,
        clients(business_name, contact_name, email)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching admin quotes:", error);
    return [];
  }
};

// Get all receipts for admin
export const getAdminReceipts = async () => {
  try {
    // Join receipts with clients to get client data
    const { data, error } = await supabase
      .from('receipts')
      .select(`
        *,
        clients(business_name, contact_name, email)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching admin receipts:", error);
    return [];
  }
};

export default {
  adminLogin,
  createAdminUser,
  getAdminUsers,
  getAdminUserById,
  updateAdminUser,
  changeAdminPassword,
  deleteAdminUser,
  getAdminDashboardStats,
  getAppUsers,
  getAdminInvoices,
  getAdminQuotes,
  getAdminReceipts
};
