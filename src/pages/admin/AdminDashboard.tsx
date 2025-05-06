
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, ClipboardCheck, Receipt, TrendingUp, AlertCircle } from "lucide-react";

const AdminDashboard: React.FC = () => {
  // These would typically come from API calls to get actual counts
  const stats = [
    { title: "Total Users", value: 150, icon: Users, color: "bg-blue-500", trend: "+12% from last month" },
    { title: "Total Invoices", value: 342, icon: FileText, color: "bg-green-500", trend: "+5% from last month" },
    { title: "Total Quotes", value: 218, icon: ClipboardCheck, color: "bg-yellow-500", trend: "+8% from last month" },
    { title: "Total Receipts", value: 289, icon: Receipt, color: "bg-purple-500", trend: "+15% from last month" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500">View and manage your system data</p>
        </div>
        <div className="bg-blue-50 text-blue-700 py-1.5 px-3 rounded-md text-sm flex items-center">
          <TrendingUp size={16} className="mr-1.5" />
          System status: Operational
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
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
              <p className="text-xs text-green-600 mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold">Recent Users</CardTitle>
              <Button variant="ghost" size="sm" className="text-sm text-blue-600">View All</Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-md">
                <div className="flex items-center text-yellow-700">
                  <AlertCircle size={16} className="mr-2" />
                  <p className="text-sm">Displaying mock data. Connect to API for real data.</p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-xs font-medium">JS</div>
                    <div>
                      <p className="font-medium">Jane Smith</p>
                      <p className="text-sm text-gray-500">jane@example.com</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                </li>
                <li className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 text-xs font-medium">JD</div>
                    <div>
                      <p className="font-medium">John Doe</p>
                      <p className="text-sm text-gray-500">john@example.com</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                </li>
                <li className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3 text-xs font-medium">RJ</div>
                    <div>
                      <p className="font-medium">Robert Johnson</p>
                      <p className="text-sm text-gray-500">robert@example.com</p>
                    </div>
                  </div>
                  <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Inactive</Badge>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold">Recent Invoices</CardTitle>
              <Button variant="ghost" size="sm" className="text-sm text-blue-600">View All</Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-md">
                <div className="flex items-center text-yellow-700">
                  <AlertCircle size={16} className="mr-2" />
                  <p className="text-sm">Displaying mock data. Connect to API for real data.</p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
                  <div>
                    <p className="font-medium">INV-2025-001</p>
                    <p className="text-sm text-gray-500">Jane Smith</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$1,200.00</p>
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Pending</Badge>
                  </div>
                </li>
                <li className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
                  <div>
                    <p className="font-medium">INV-2025-002</p>
                    <p className="text-sm text-gray-500">John Doe</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$850.00</p>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Paid</Badge>
                  </div>
                </li>
                <li className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
                  <div>
                    <p className="font-medium">INV-2025-003</p>
                    <p className="text-sm text-gray-500">Robert Johnson</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$3,450.00</p>
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Overdue</Badge>
                  </div>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
