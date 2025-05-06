
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle, Edit, Trash2 } from "lucide-react";

const AdminSubscriptionsPage: React.FC = () => {
  // Mock subscriptions data
  const subscriptions = [
    { id: 1, user: "Jane Smith", plan: "premium", start_date: "2025-01-01", renewal_date: "2026-01-01", status: "active", amount: 199.99 },
    { id: 2, user: "John Doe", plan: "basic", start_date: "2025-01-15", renewal_date: "2026-01-15", status: "active", amount: 99.99 },
    { id: 3, user: "Robert Johnson", plan: "premium", start_date: "2025-01-10", renewal_date: "2026-01-10", status: "cancelled", amount: 199.99 },
    { id: 4, user: "Anna Williams", plan: "enterprise", start_date: "2025-02-01", renewal_date: "2026-02-01", status: "active", amount: 499.99 },
    { id: 5, user: "Michael Brown", plan: "basic", start_date: "2025-01-20", renewal_date: "2026-01-20", status: "pending", amount: 99.99 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Subscription Management</h1>
        <Button className="bg-[#4caf50] hover:bg-[#388e3c]">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Subscription
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Subscriptions</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input placeholder="Search subscriptions..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-6 py-3 text-left">User</th>
                  <th className="px-6 py-3 text-left">Plan</th>
                  <th className="px-6 py-3 text-left">Start Date</th>
                  <th className="px-6 py-3 text-left">Renewal Date</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((subscription) => (
                  <tr key={subscription.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{subscription.user}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        subscription.plan === "basic" ? "bg-blue-100 text-blue-800" :
                        subscription.plan === "premium" ? "bg-purple-100 text-purple-800" :
                        "bg-amber-100 text-amber-800"
                      }`}>
                        {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">{subscription.start_date}</td>
                    <td className="px-6 py-4">{subscription.renewal_date}</td>
                    <td className="px-6 py-4 text-right">${subscription.amount.toFixed(2)}/year</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        subscription.status === "active" ? "bg-green-100 text-green-800" :
                        subscription.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSubscriptionsPage;
