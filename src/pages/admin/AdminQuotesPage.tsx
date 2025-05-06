
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle, Eye, FileText } from "lucide-react";

const AdminQuotesPage: React.FC = () => {
  // Mock quotes data
  const quotes = [
    { id: "QT-2025-001", client: "Acme Corp", date: "2025-01-10", amount: 1500.00, status: "accepted" },
    { id: "QT-2025-002", client: "Globex Inc", date: "2025-01-15", amount: 950.00, status: "pending" },
    { id: "QT-2025-003", client: "Stark Industries", date: "2025-01-20", amount: 3750.00, status: "expired" },
    { id: "QT-2025-004", client: "Wayne Enterprises", date: "2025-01-27", amount: 1950.00, status: "draft" },
    { id: "QT-2025-005", client: "Oscorp", date: "2025-02-03", amount: 2300.00, status: "sent" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quote Management</h1>
        <Button className="bg-[#4caf50] hover:bg-[#388e3c]">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Quote
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Quotes</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input placeholder="Search quotes..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-6 py-3 text-left">Quote #</th>
                  <th className="px-6 py-3 text-left">Client</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((quote) => (
                  <tr key={quote.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{quote.id}</td>
                    <td className="px-6 py-4">{quote.client}</td>
                    <td className="px-6 py-4">{quote.date}</td>
                    <td className="px-6 py-4 text-right">${quote.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        quote.status === "accepted" ? "bg-green-100 text-green-800" :
                        quote.status === "pending" || quote.status === "sent" ? "bg-blue-100 text-blue-800" :
                        quote.status === "expired" ? "bg-red-100 text-red-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
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

export default AdminQuotesPage;
