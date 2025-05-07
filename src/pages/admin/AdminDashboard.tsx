import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAdminDashboardStats } from "@/services/adminService";
import { AdminDashboardStats } from "@/types/admin";
import { Loader2, CreditCard, User, FileText, Receipt } from "lucide-react";

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        const dashboardStats = await getAdminDashboardStats();
        setStats(dashboardStats);
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500">Overview of your RisitiFy admin panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>Number of registered users</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <User className="h-6 w-6 text-gray-500" />
            <span className="text-3xl font-bold">{stats?.userCount || 0}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Invoices</CardTitle>
            <CardDescription>Number of invoices generated</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <FileText className="h-6 w-6 text-gray-500" />
            <span className="text-3xl font-bold">{stats?.invoiceCount || 0}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Quotes</CardTitle>
            <CardDescription>Number of quotes created</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <CreditCard className="h-6 w-6 text-gray-500" />
            <span className="text-3xl font-bold">{stats?.quoteCount || 0}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Receipts</CardTitle>
            <CardDescription>Number of receipts issued</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <Receipt className="h-6 w-6 text-gray-500" />
            <span className="text-3xl font-bold">{stats?.receiptCount || 0}</span>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="recent" className="w-full">
          <TabsList>
            <TabsTrigger value="recent">Recent Activity</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest activities in the system</CardDescription>
              </CardHeader>
              <CardContent>
                {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                  <ul>
                    {stats.recentActivity.map((activity, index) => (
                      <li key={index} className="py-2 border-b">
                        {activity.message}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No recent activity found.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>System usage analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Analytics data will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
