import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Users,
  FileText,
  ClipboardCheck,
  Receipt,
  ArrowRight,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  UserPlus,
  CheckCircle,
  Clock,
  XCircle,
  LineChart,
} from "lucide-react";
import {
  getAdminDashboardStats,
  AdminDashboardStats,
} from "@/services/adminService";
import { Skeleton } from "@/components/ui/skeleton";

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminDashboardStats();
        setStats(data);
      } catch (err) {
        setError("Failed to load dashboard statistics");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Get currency formatter
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="overflow-hidden border-none shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of system performance and user activity
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* User Stats Card */}
        <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
          <div className="absolute top-0 h-1 w-full bg-blue-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-600">
              Users
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-3">
              <div className="text-3xl font-bold">{stats.totalUsers}</div>
              <div className="flex items-center text-xs font-medium text-green-600">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                <span>+{stats.newUsers} new</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="grid gap-1">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-400"></div>
                  <div className="text-xs text-gray-500">
                    {Math.round((stats.activeUsers / stats.totalUsers) * 100)}%
                    Active
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                  <div className="text-xs text-gray-500">
                    {Math.round(
                      ((stats.totalUsers - stats.activeUsers) /
                        stats.totalUsers) *
                        100
                    )}
                    % Inactive
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-blue-600 hover:text-blue-700"
                asChild
              >
                <Link to="/admin/users">
                  View all
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Stats Card */}
        <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
          <div className="absolute top-0 h-1 w-full bg-emerald-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-600">
              Subscriptions
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-3">
              <div className="text-3xl font-bold">
                {stats.totalSubscriptions}
              </div>
              <div className="flex items-center text-xs font-medium text-emerald-600">
                <TrendingUp className="mr-1 h-3 w-3" />
                <span>
                  {Math.round(
                    (stats.activeSubscriptions / stats.totalSubscriptions) * 100
                  )}
                  % Active
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="grid gap-1">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                  <div className="text-xs text-gray-500">
                    {stats.activeSubscriptions} Active
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                  <div className="text-xs text-gray-500">
                    {stats.trialSubscriptions} Trial
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-emerald-600 hover:text-emerald-700"
                asChild
              >
                <Link to="/admin/subscriptions">
                  View all
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Stats Card */}
        <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
          <div className="absolute top-0 h-1 w-full bg-purple-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-600">
              Invoices
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              <FileText className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-3">
              <div className="text-3xl font-bold">{stats.totalInvoices}</div>
              <div className="flex items-center text-xs font-medium text-purple-600">
                <TrendingUp className="mr-1 h-3 w-3" />
                <span>
                  {Math.round((stats.paidInvoices / stats.totalInvoices) * 100)}
                  % Paid
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="grid gap-1">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-400"></div>
                  <div className="text-xs text-gray-500">
                    {stats.paidInvoices} Paid
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-red-400"></div>
                  <div className="text-xs text-gray-500">
                    {stats.overdueInvoices} Overdue
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-purple-600 hover:text-purple-700"
                asChild
              >
                <Link to="/admin/invoices">
                  View all
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quote Stats Card */}
        <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
          <div className="absolute top-0 h-1 w-full bg-amber-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-600">
              Quotes
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
              <ClipboardCheck className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-3">
              <div className="text-3xl font-bold">{stats.totalQuotes}</div>
              <div className="flex items-center text-xs font-medium text-amber-600">
                <TrendingUp className="mr-1 h-3 w-3" />
                <span>
                  {Math.round((stats.acceptedQuotes / stats.totalQuotes) * 100)}
                  % Accepted
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="grid gap-1">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-400"></div>
                  <div className="text-xs text-gray-500">
                    {stats.acceptedQuotes} Accepted
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                  <div className="text-xs text-gray-500">
                    {stats.pendingQuotes} Pending
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-amber-600 hover:text-amber-700"
                asChild
              >
                <Link to="/admin/quotes">
                  View all
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Users</CardTitle>
            <CardDescription>
              New user registrations in the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.newUsers > 0 ? (
                <div className="text-center py-8">
                  <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900">
                    {stats.newUsers} new users
                  </p>
                  <p className="text-sm text-gray-500">
                    joined in the last 30 days
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">No new users</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Subscription Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Subscription Overview</CardTitle>
            <CardDescription>
              Current subscription status distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {stats.activeSubscriptions}
                  </div>
                  <div className="text-sm text-gray-500">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">
                    {stats.trialSubscriptions}
                  </div>
                  <div className="text-sm text-gray-500">Trial</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {stats.cancelledSubscriptions}
                  </div>
                  <div className="text-sm text-gray-500">Cancelled</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
