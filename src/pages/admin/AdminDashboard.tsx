
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, ClipboardCheck, Receipt } from "lucide-react";

const AdminDashboard: React.FC = () => {
  // These would typically come from API calls to get actual counts
  const stats = [
    { title: "Total Users", value: 150, icon: Users, color: "bg-blue-500" },
    { title: "Total Invoices", value: 342, icon: FileText, color: "bg-green-500" },
    { title: "Total Quotes", value: 218, icon: ClipboardCheck, color: "bg-yellow-500" },
    { title: "Total Receipts", value: 289, icon: Receipt, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.color}`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* This would be a mapped list of recent users */}
              <p className="text-gray-500">Displaying mock data. Connect to API for real data.</p>
              <ul className="space-y-2">
                <li className="p-3 bg-gray-50 rounded-md">Jane Smith (jane@example.com)</li>
                <li className="p-3 bg-gray-50 rounded-md">John Doe (john@example.com)</li>
                <li className="p-3 bg-gray-50 rounded-md">Robert Johnson (robert@example.com)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-500">Displaying mock data. Connect to API for real data.</p>
              <ul className="space-y-2">
                <li className="p-3 bg-gray-50 rounded-md">INV-2025-001 ($1,200.00)</li>
                <li className="p-3 bg-gray-50 rounded-md">INV-2025-002 ($850.00)</li>
                <li className="p-3 bg-gray-50 rounded-md">INV-2025-003 ($3,450.00)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
