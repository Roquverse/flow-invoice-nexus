
import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  // Mock client data
  const clients = [
    {
      id: 1,
      name: "Apple, Inc.",
      address: "1 Infinite Loop, Cupertino, CA 95014",
      country: "États-Unis",
      overdue: "9 137,50 €",
      sales: "24 931,53 €",
      salesPercentage: 25
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 gap-6">
        {clients.map(client => (
          <Link key={client.id} to={`/dashboard/clients/${client.id}`}>
            <Card className="bg-[#171f38] text-white hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-3">
                  {/* Client Info */}
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-300 rounded-md"></div>
                      <div>
                        <h3 className="font-bold text-xl">{client.name}</h3>
                        <p className="text-white/70 text-sm mt-1">
                          {client.address}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Sales Info */}
                  <div className="p-6 border-l border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white/70 text-sm">Ventes</h4>
                      <Badge variant="outline" className="bg-green-600/30 text-green-400 border-0">+23.91%</Badge>
                    </div>
                    <div className="text-2xl font-bold">{client.sales}</div>
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-white/70">Part sur le CA Global</span>
                        <span className="text-sm">{client.salesPercentage}%</span>
                      </div>
                      <Progress value={client.salesPercentage} className="h-1.5 bg-white/10" indicatorClassName="bg-cyan-400" />
                    </div>
                  </div>
                  
                  {/* Payment Status */}
                  <div className="p-6 border-l border-white/10 flex flex-col">
                    <div>
                      <h4 className="text-white/70 text-sm mb-1">En attente de réglement</h4>
                      <div className="text-2xl font-bold">{client.overdue}</div>
                    </div>
                    <div className="mt-auto flex justify-between items-center">
                      <div>
                        <div className="text-sm text-white/70">Statut</div>
                        <Badge variant="outline" className="bg-green-600/30 text-green-400 border-0 mt-1">Actif</Badge>
                      </div>
                      <Button variant="ghost" className="text-white">
                        <ChevronRight size={20} />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      {/* Outstanding Invoices */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Factures en attente</h2>
        <div className="overflow-hidden border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Facture
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'échéance
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-gray-900 font-medium">F-20240124_23</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Apple, Inc.</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">31 janv. 2024</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className="bg-red-100 text-red-600">14 jours de retard</Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  2 123,50 €
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-gray-900 font-medium">F-20240124_24</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Apple, Inc.</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">31 janv. 2024</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className="bg-red-100 text-red-600">14 jours de retard</Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  7 014,00 €
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
