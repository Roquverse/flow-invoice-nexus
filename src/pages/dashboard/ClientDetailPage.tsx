
import React from 'react';
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export default function ClientDetailPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Client Info Card */}
        <Card className="col-span-1 bg-[#171f38] text-white">
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div className="w-16 h-16 bg-gray-300 rounded-md"></div>
              <Button size="sm" variant="ghost" className="text-white">
                <Pencil size={16} className="mr-1" /> Éditer le client
              </Button>
            </div>

            <div className="mt-6">
              <h2 className="text-2xl font-bold">Apple, Inc.</h2>
              <div className="mt-4 space-y-2">
                <div className="flex items-start gap-2">
                  <div className="text-white/70 min-w-[20px] mt-1">📍</div>
                  <p>1 Infinite Loop, Cupertino, CA 95014, États-Unis</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm text-white/70 mb-2">Contacts</h3>
              <div className="flex gap-2">
                <Avatar className="h-8 w-8 bg-blue-500">
                  <AvatarFallback>TS</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8 bg-green-500">
                  <AvatarFallback>JI</AvatarFallback>
                </Avatar>
                <Button size="icon" variant="outline" className="h-8 w-8 rounded-full border-white/20 text-white">
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sales Card */}
        <Card className="col-span-1 bg-[#171f38] text-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-white/70">Ventes</h3>
              <Badge variant="outline" className="bg-green-600/30 text-green-400 border-0">+23.91%</Badge>
            </div>
            
            <div className="mt-4">
              <div className="text-3xl font-bold">24 931,53 €</div>
              <div className="text-sm text-white/70 mt-1">Mois dernier : 18 222 €</div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Part sur le CA Global</span>
                <span>25%</span>
              </div>
              <div className="relative">
                <Progress value={25} className="h-2 bg-white/10" indicatorClassName="bg-cyan-400" />
                <div className="absolute top-0 left-0 w-full">
                  <div className="w-1/4 flex justify-center">
                    <div className="h-8 w-px bg-cyan-400"></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Card */}
        <Card className="col-span-1 bg-[#171f38] text-white">
          <CardContent className="p-6">
            <div>
              <h3 className="text-sm font-medium text-white/70 mb-4">Relance</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-white/70">En attente de réglement</div>
                  <div className="text-xl font-bold mt-1">9 137,50 €</div>
                </div>
                <div>
                  <div className="text-sm text-white/70">Écho</div>
                  <div className="text-xl font-bold mt-1">9 137,50 €</div>
                </div>
                <div>
                  <div className="text-sm text-white/70">Non écho</div>
                  <div className="text-xl font-bold mt-1">0 €</div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-6 gap-1">
                <div className="border rounded p-2 text-center text-xs">
                  <div className="font-semibold">{'>'}90J</div>
                  <div>0,00€</div>
                </div>
                <div className="border rounded p-2 text-center text-xs">
                  <div className="font-semibold">90-61J</div>
                  <div>0,00€</div>
                </div>
                <div className="border rounded p-2 text-center text-xs">
                  <div className="font-semibold">60-31J</div>
                  <div>0,00€</div>
                </div>
                <div className="border rounded bg-blue-500/20 border-blue-500 p-2 text-center text-xs">
                  <div className="font-semibold">30-1J</div>
                  <div>9 137,50€</div>
                </div>
                <div className="border rounded p-2 text-center text-xs">
                  <div className="font-semibold">0-30J</div>
                  <div>0,00€</div>
                </div>
                <div className="border rounded p-2 text-center text-xs">
                  <div className="font-semibold">31-60J</div>
                  <div>0,00€</div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between">
                <div>
                  <div className="text-sm text-white/70">Gestionnaire de compte</div>
                  <div className="mt-1">Edouard Perrin</div>
                </div>
                <div>
                  <div className="text-sm text-white/70">Statut de la relance</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="bg-green-600/30 text-green-400 border-0 rounded-full">Actif</Badge>
                    <Button variant="ghost" size="sm" className="text-xs h-6 px-2 text-white/70">Modifier</Button>
                  </div>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="w-full mt-4 bg-indigo-600 text-white border-0">
              Relance Grands Comptes
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 flex justify-between items-center border-b">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 rounded-md text-amber-600">
              <FileText size={18} />
            </div>
            <h3 className="font-medium">Relances</h3>
            <Badge className="bg-gray-200 text-gray-700 ml-2">2</Badge>
          </div>
          <button className="text-blue-600">→</button>
        </div>

        <div className="p-4">
          <Tabs defaultValue="all">
            <div className="flex justify-between mb-4">
              <TabsList className="bg-gray-100">
                <TabsTrigger value="all">Détails</TabsTrigger>
                <TabsTrigger value="pending">Status</TabsTrigger>
                <TabsTrigger value="paid">Date d'échéance</TabsTrigger>
                <TabsTrigger value="overdue">Montant TTC</TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <Badge variant="outline" className="flex items-center gap-1" onClick={() => console.log('filter')}>
                  Type de Relance : Toutes
                  <X size={14} />
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1" onClick={() => console.log('filter')}>
                  Status : Tous
                  <X size={14} />
                </Badge>
              </div>
            </div>

            <TabsContent value="all" className="mt-0">
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="py-4">
                      <div>F-20240124_23</div>
                      <div className="text-sm text-gray-500">Ventes SEO / SEA</div>
                    </td>
                    <td className="py-4">
                      <Badge className="bg-red-100 text-red-600 rounded-md">14 jours de retard</Badge>
                    </td>
                    <td className="py-4">31 janv. 2024</td>
                    <td className="py-4 text-right">
                      <div className="font-semibold">2 123,50 €</div>
                      <div className="text-xs text-gray-500">Relance prévue aujourd'hui • Automatique • <span className="text-red-500">Modifier</span></div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4">
                      <div>F-20240124_23</div>
                      <div className="text-sm text-gray-500">Ventes SEO / SEA</div>
                    </td>
                    <td className="py-4">
                      <Badge className="bg-red-100 text-red-600 rounded-md">14 jours de retard</Badge>
                    </td>
                    <td className="py-4">31 janv. 2024</td>
                    <td className="py-4 text-right">
                      <div className="font-semibold">7014,00 €</div>
                      <div className="text-xs text-gray-500">Relance prévue aujourd'hui • Automatique • <span className="text-red-500">Modifier</span></div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FileText, X } from "lucide-react";
