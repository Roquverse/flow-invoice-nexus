
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle, Eye, FileText } from "lucide-react";

const AdminReceiptsPage: React.FC = () => {
  // Mock receipts data
  const receipts = [
    { id: "RCT-2025-001", client: "Acme Corp", date: "2025-01-15", amount: 1200.00, payment_method: "bank_transfer" },
    { id: "RCT-2025-002", client: "Globex Inc", date: "2025-01-21", amount: 850.00, payment_method: "credit_card" },
    { id: "RCT-2025-003", client: "Stark Industries", date: "2025-01-26", amount: 3450.00, payment_method: "paypal" },
    { id: "RCT-2025-004", client: "Wayne Enterprises", date: "2025-02-02", amount: 1750.00, payment_method: "bank_transfer" },
    { id: "RCT-2025-005", client: "Oscorp", date: "2025-02-08", amount: 2100.00, payment_method: "cash" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Receipt Management</h1>
        <Button className="bg-[#4caf50] hover:bg-[#388e3c]">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Receipt
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Receipts</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input placeholder="Search receipts..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-6 py-3 text-left">Receipt #</th>
                  <th className="px-6 py-3 text-left">Client</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                  <th className="px-6 py-3 text-left">Payment Method</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((receipt) => (
                  <tr key={receipt.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{receipt.id}</td>
                    <td className="px-6 py-4">{receipt.client}</td>
                    <td className="px-6 py-4">{receipt.date}</td>
                    <td className="px-6 py-4 text-right">${receipt.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        receipt.payment_method === "credit_card" ? "bg-blue-100 text-blue-800" :
                        receipt.payment_method === "paypal" ? "bg-purple-100 text-purple-800" :
                        receipt.payment_method === "bank_transfer" ? "bg-green-100 text-green-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {receipt.payment_method.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <FileText className="h-4 w-4" />
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

export default AdminReceiptsPage;
