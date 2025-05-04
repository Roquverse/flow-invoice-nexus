import React from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RecentInvoices } from "@/components/dashboard/RecentInvoices";
import { InvoiceStatusChart } from "@/components/dashboard/InvoiceStatusChart";
import "@/styles/dashboard.css";

export default function DashboardPage() {
  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h2 className="page-title">Dashboard</h2>
        <p className="page-description">Overview of your business</p>
      </div>

      <div className="stats-grid">
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

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Revenue</h3>
          </div>
          <div className="chart-container">
            <RevenueChart />
          </div>
        </div>
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Invoice Status</h3>
          </div>
          <div className="chart-container">
            <InvoiceStatusChart />
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-header">
          <h3 className="table-title">Recent Invoices</h3>
        </div>
        <div className="table-container">
          <RecentInvoices />
        </div>
      </div>
    </div>
  );
}
