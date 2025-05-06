
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle, Eye, FileText } from "lucide-react";

const AdminInvoicesPage: React.FC = () => {
  // Mock invoices data
  const invoices = [
    { id: "INV-2025-001", client: "Acme Corp", date: "2025-01-15", amount: 1200.00, status: "paid" },
    { id: "INV-2025-002", client: "Globex Inc", date: "2025-01-20", amount: 850.00, status: "pending" },
    { id: "INV-2025-003", client: "Stark Industries", date: "2025-01-25", amount: 3450.00, status: "overdue" },
    { id: "INV-2025-004", client: "Wayne Enterprises", date: "2025-02-01", amount: 1750.00, status: "draft" },
    { id: "INV-2025-005", client: "Oscorp", date: "2025-02-07", amount: 2100.00, status: "paid" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Invoice Management</h1>
        <Button className="bg-[#4caf50] hover:bg-[#388e3c]">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Invoice
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Invoices</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input placeholder="Search invoices..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-6 py-3 text-left">Invoice #</th>
                  <th className="px-6 py-3 text-left">Client</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{invoice.id}</td>
                    <td className="px-6 py-4">{invoice.client}</td>
                    <td className="px-6 py-4">{invoice.date}</td>
                    <td className="px-6 py-4 text-right">${invoice.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        invoice.status === "paid" ? "bg-green-100 text-green-800" :
                        invoice.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        invoice.status === "overdue" ? "bg-red-100 text-red-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
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

export default AdminInvoicesPage;
