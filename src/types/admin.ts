
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string | null;
  status?: string;
}

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  user?: AdminUser;
  message?: string;
  error?: Error;
}

export interface AdminUserCreateRequest {
  username: string;
  password: string;
  email: string;
  role?: string;
}

export interface AdminDashboardStats {
  userCount: number;
  invoiceCount: number;
  quoteCount: number;
  receiptCount: number;
  recentActivity: any[];
}
