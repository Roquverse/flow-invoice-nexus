
import React from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { RecentInvoices } from '@/components/dashboard/RecentInvoices';
import { InvoiceStatusChart } from '@/components/dashboard/InvoiceStatusChart';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your business</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Revenue" 
          value="$15,231.89" 
          trend="+20.1%" 
          trendDirection="up" 
          description="vs. last month" 
        />
        <StatCard 
          title="Invoices" 
          value="34" 
          trend="+8" 
          trendDirection="up" 
          description="vs. last month" 
        />
        <StatCard 
          title="Paid" 
          value="24" 
          trend="+5" 
          trendDirection="up" 
          description="vs. last month" 
        />
        <StatCard 
          title="Outstanding" 
          value="$4,320.80" 
          trend="-4.5%" 
          trendDirection="down" 
          description="vs. last month" 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6 flex flex-col space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Revenue</h3>
              </div>
              <div className="h-[300px]">
                <RevenueChart />
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-3">
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6 flex flex-col space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Invoice Status</h3>
              </div>
              <div className="h-[300px] flex items-center justify-center">
                <InvoiceStatusChart />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Invoices</h3>
            <RecentInvoices />
          </div>
        </div>
      </div>
    </div>
  );
}
