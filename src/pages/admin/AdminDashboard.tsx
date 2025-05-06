
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; 
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Users, 
  FileText, 
  ClipboardCheck, 
  PieChart,
  ArrowRight,
  ArrowUpRight,
  TrendingUp,
  TrendingDown
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 845,
    activeUsers: 685,
    newUsers: 34,
    totalInvoices: 563,
    paidInvoices: 423,
    overdueInvoices: 48,
    totalQuotes: 289,
    acceptedQuotes: 178,
    pendingQuotes: 45,
    rejectedQuotes: 66,
    averageInvoiceAmount: 2430,
    totalRevenue: 1025639,
    totalSubscriptions: 239,
    activeSubscriptions: 187,
    trialSubscriptions: 32,
    cancelledSubscriptions: 20,
  });

  // Get currency formatter
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* User Stats Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <div className="flex items-center justify-between mt-4">
                <div className="text-xs text-muted-foreground">
                  <Badge variant="success" className="mr-1">{stats.activeUsers} active</Badge>
                  <Badge variant="info" className="mr-1">{stats.newUsers} new</Badge>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin/users" className="flex items-center text-xs">
                    View users <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Stats Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalInvoices}</div>
              <div className="flex items-center justify-between mt-4">
                <div className="text-xs text-muted-foreground">
                  <Badge variant="success" className="mr-1">{stats.paidInvoices} paid</Badge>
                  <Badge variant="warning" className="mr-1">{stats.overdueInvoices} overdue</Badge>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin/invoices" className="flex items-center text-xs">
                    View invoices <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quote Stats Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalQuotes}</div>
              <div className="flex items-center justify-between mt-4">
                <div className="text-xs text-muted-foreground">
                  <Badge variant="success" className="mr-1">{stats.acceptedQuotes} accepted</Badge>
                  <Badge variant="warning" className="mr-1">{stats.pendingQuotes} pending</Badge>
                  <Badge variant="destructive">{stats.rejectedQuotes} rejected</Badge>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin/quotes" className="flex items-center text-xs">
                    View quotes <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Stats Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatter.format(stats.totalRevenue)}</div>
              <div className="flex items-center justify-between mt-4">
                <div className="text-xs text-muted-foreground flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  <span className="text-green-500 font-medium">+12.5%</span>&nbsp;from last month
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin/reports" className="flex items-center text-xs">
                    View reports <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Subscription Stats Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-base">Subscription Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Subscriptions</span>
                  <span className="font-semibold">{stats.totalSubscriptions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Badge variant="success" className="mr-2">Active</Badge>
                    <span className="text-sm">{stats.activeSubscriptions} subscriptions</span>
                  </div>
                  <span className="text-sm font-semibold">{Math.round(stats.activeSubscriptions / stats.totalSubscriptions * 100)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Badge variant="warning" className="mr-2">Trial</Badge>
                    <span className="text-sm">{stats.trialSubscriptions} subscriptions</span>
                  </div>
                  <span className="text-sm font-semibold">{Math.round(stats.trialSubscriptions / stats.totalSubscriptions * 100)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Badge variant="destructive" className="mr-2">Cancelled</Badge>
                    <span className="text-sm">{stats.cancelledSubscriptions} subscriptions</span>
                  </div>
                  <span className="text-sm font-semibold">{Math.round(stats.cancelledSubscriptions / stats.totalSubscriptions * 100)}%</span>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                  <Link to="/admin/subscriptions" className="flex items-center justify-center">
                    View subscription details <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity placeholder - would be replaced with actual data */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4 py-1">
                  <p className="text-sm">New user <span className="font-semibold">John Doe</span> registered</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4 py-1">
                  <p className="text-sm">Invoice <span className="font-semibold">#INV-2023-056</span> was paid</p>
                  <p className="text-xs text-gray-500">5 hours ago</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4 py-1">
                  <p className="text-sm">Quote <span className="font-semibold">#QT-2023-089</span> was accepted</p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4 py-1">
                  <p className="text-sm">User <span className="font-semibold">Sarah Smith</span> upgraded to premium</p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4 py-1">
                  <p className="text-sm">Subscription <span className="font-semibold">#SUB-2023-034</span> was cancelled</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
