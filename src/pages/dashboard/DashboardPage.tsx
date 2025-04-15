
import { ArrowUpRight, BadgeDollarSign, FileText, Landmark, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { InvoiceStatusChart } from "@/components/dashboard/InvoiceStatusChart";
import { RecentInvoices } from "@/components/dashboard/RecentInvoices";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, here's an overview of your business.</p>
        </div>
        
        <div className="flex gap-3">
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value="$24,931.53" 
          percentageChange={12.5} 
          icon={BadgeDollarSign}
          iconColor="bg-emerald-500"
        />
        <StatCard 
          title="Outstanding" 
          value="$9,137.50" 
          percentageChange={-8.3} 
          icon={Landmark}
          iconColor="bg-amber-500"
        />
        <StatCard 
          title="Invoices" 
          value="53" 
          percentageChange={5.2} 
          icon={FileText}
          iconColor="bg-sky-500"
        />
        <StatCard 
          title="Active Clients" 
          value="28" 
          percentageChange={2.1} 
          icon={Users}
          iconColor="bg-violet-500"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <InvoiceStatusChart />
        <RecentInvoices />
      </div>
    </div>
  );
}
