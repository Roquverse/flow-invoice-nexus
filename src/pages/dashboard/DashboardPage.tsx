import React, { useMemo } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RecentInvoices } from "@/components/dashboard/RecentInvoices";
import { InvoiceStatusChart } from "@/components/dashboard/InvoiceStatusChart";
import { RecentQuotes } from "@/components/dashboard/RecentQuotes";
import { QuoteStatusChart } from "@/components/dashboard/QuoteStatusChart";
import { useInvoices } from "@/hooks/useInvoices";
import { useQuotes } from "@/hooks/useQuotes";
import { useReceipts } from "@/hooks/useReceipts";
import { formatCurrency } from "@/utils/formatters";
import "@/styles/dashboard.css";

export default function DashboardPage() {
  const { invoices, loading: invoicesLoading } = useInvoices();
  const { quotes, loading: quotesLoading } = useQuotes();
  const { receipts, loading: receiptsLoading } = useReceipts();

  // Calculate metrics
  const metrics = useMemo(() => {
    if (invoicesLoading || quotesLoading || receiptsLoading) {
      return {
        totalRevenue: "Loading...",
        invoiceCount: "Loading...",
        paidCount: "Loading...",
        outstandingAmount: "Loading...",
        quoteCount: "Loading...",
        acceptedQuoteCount: "Loading...",
        revenueChange: "0%",
        invoiceChange: "0",
        paidChange: "0",
        outstandingChange: "0%",
        quoteChange: "0",
        acceptedQuoteChange: "0",
      };
    }

    // Total revenue (from receipts)
    const totalRevenue = receipts.reduce(
      (sum, receipt) => sum + receipt.amount,
      0
    );

    // Current month receipts
    const currentDate = new Date();
    const currentMonthReceipts = receipts.filter((receipt) => {
      const receiptDate = new Date(receipt.date);
      return (
        receiptDate.getMonth() === currentDate.getMonth() &&
        receiptDate.getFullYear() === currentDate.getFullYear()
      );
    });

    // Previous month receipts
    const previousMonthDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1
    );
    const previousMonthReceipts = receipts.filter((receipt) => {
      const receiptDate = new Date(receipt.date);
      return (
        receiptDate.getMonth() === previousMonthDate.getMonth() &&
        receiptDate.getFullYear() === previousMonthDate.getFullYear()
      );
    });

    const currentMonthRevenue = currentMonthReceipts.reduce(
      (sum, receipt) => sum + receipt.amount,
      0
    );
    const previousMonthRevenue = previousMonthReceipts.reduce(
      (sum, receipt) => sum + receipt.amount,
      0
    );

    // Calculate revenue change percentage
    const revenueChange =
      previousMonthRevenue === 0
        ? "+100%"
        : `${(
            ((currentMonthRevenue - previousMonthRevenue) /
              previousMonthRevenue) *
            100
          ).toFixed(1)}%`;

    // Invoice counts
    const paidInvoices = invoices.filter(
      (invoice) => invoice.status === "paid"
    );
    const pendingInvoices = invoices.filter(
      (invoice) => invoice.status === "sent" || invoice.status === "viewed"
    );

    // Quote counts
    const acceptedQuotes = quotes.filter(
      (quote) => quote.status === "accepted"
    );

    // Calculate outstanding amount (from pending invoices)
    const outstandingAmount = pendingInvoices.reduce(
      (sum, invoice) => sum + invoice.total_amount,
      0
    );

    // Current month invoices
    const currentMonthInvoices = invoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.issue_date);
      return (
        invoiceDate.getMonth() === currentDate.getMonth() &&
        invoiceDate.getFullYear() === currentDate.getFullYear()
      );
    });

    // Previous month invoices
    const previousMonthInvoices = invoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.issue_date);
      return (
        invoiceDate.getMonth() === previousMonthDate.getMonth() &&
        invoiceDate.getFullYear() === previousMonthDate.getFullYear()
      );
    });

    // Current month quotes
    const currentMonthQuotes = quotes.filter((quote) => {
      const quoteDate = new Date(quote.issue_date);
      return (
        quoteDate.getMonth() === currentDate.getMonth() &&
        quoteDate.getFullYear() === currentDate.getFullYear()
      );
    });

    // Previous month quotes
    const previousMonthQuotes = quotes.filter((quote) => {
      const quoteDate = new Date(quote.issue_date);
      return (
        quoteDate.getMonth() === previousMonthDate.getMonth() &&
        quoteDate.getFullYear() === previousMonthDate.getFullYear()
      );
    });

    // Current month paid invoices
    const currentMonthPaidInvoices = invoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.issue_date);
      return (
        invoice.status === "paid" &&
        invoiceDate.getMonth() === currentDate.getMonth() &&
        invoiceDate.getFullYear() === currentDate.getFullYear()
      );
    });

    // Previous month paid invoices
    const previousMonthPaidInvoices = invoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.issue_date);
      return (
        invoice.status === "paid" &&
        invoiceDate.getMonth() === previousMonthDate.getMonth() &&
        invoiceDate.getFullYear() === previousMonthDate.getFullYear()
      );
    });

    // Current month accepted quotes
    const currentMonthAcceptedQuotes = quotes.filter((quote) => {
      const quoteDate = new Date(quote.issue_date);
      return (
        quote.status === "accepted" &&
        quoteDate.getMonth() === currentDate.getMonth() &&
        quoteDate.getFullYear() === currentDate.getFullYear()
      );
    });

    // Previous month accepted quotes
    const previousMonthAcceptedQuotes = quotes.filter((quote) => {
      const quoteDate = new Date(quote.issue_date);
      return (
        quote.status === "accepted" &&
        quoteDate.getMonth() === previousMonthDate.getMonth() &&
        quoteDate.getFullYear() === previousMonthDate.getFullYear()
      );
    });

    // Calculate changes
    const invoiceChange = `+${
      currentMonthInvoices.length - previousMonthInvoices.length
    }`;
    const paidChange = `+${
      currentMonthPaidInvoices.length - previousMonthPaidInvoices.length
    }`;
    const quoteChange = `+${
      currentMonthQuotes.length - previousMonthQuotes.length
    }`;
    const acceptedQuoteChange = `+${
      currentMonthAcceptedQuotes.length - previousMonthAcceptedQuotes.length
    }`;

    // Calculate outstanding changes
    const currentOutstanding = currentMonthInvoices
      .filter((invoice) => invoice.status !== "paid")
      .reduce((sum, invoice) => sum + invoice.total_amount, 0);

    const previousOutstanding = previousMonthInvoices
      .filter((invoice) => invoice.status !== "paid")
      .reduce((sum, invoice) => sum + invoice.total_amount, 0);

    const outstandingChange =
      previousOutstanding === 0
        ? "+0%"
        : `${(
            ((currentOutstanding - previousOutstanding) / previousOutstanding) *
            100
          ).toFixed(1)}%`;

    return {
      totalRevenue: formatCurrency(totalRevenue),
      invoiceCount: invoices.length.toString(),
      paidCount: paidInvoices.length.toString(),
      outstandingAmount: formatCurrency(outstandingAmount),
      quoteCount: quotes.length.toString(),
      acceptedQuoteCount: acceptedQuotes.length.toString(),
      revenueChange: revenueChange.startsWith("+")
        ? revenueChange
        : `+${revenueChange}`,
      invoiceChange,
      paidChange,
      outstandingChange,
      quoteChange,
      acceptedQuoteChange,
    };
  }, [
    invoices,
    quotes,
    receipts,
    invoicesLoading,
    quotesLoading,
    receiptsLoading,
  ]);

  const trendDirection = (value: string) => {
    if (value.includes("-")) return "down";
    return "up";
  };

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h2 className="page-title">Dashboard</h2>
        <p className="page-description">Overview of your business</p>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Revenue"
          value={metrics.totalRevenue}
          trend={metrics.revenueChange}
          trendDirection={trendDirection(metrics.revenueChange)}
          description="vs. last month"
        />
        <StatCard
          title="Invoices"
          value={metrics.invoiceCount}
          trend={metrics.invoiceChange}
          trendDirection={trendDirection(metrics.invoiceChange)}
          description="vs. last month"
        />
        <StatCard
          title="Quotes"
          value={metrics.quoteCount}
          trend={metrics.quoteChange}
          trendDirection={trendDirection(metrics.quoteChange)}
          description="vs. last month"
        />
        <StatCard
          title="Outstanding"
          value={metrics.outstandingAmount}
          trend={metrics.outstandingChange}
          trendDirection={trendDirection(metrics.outstandingChange)}
          description="vs. last month"
        />
      </div>

      <div className="charts-grid-full mb-6">
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Revenue</h3>
          </div>
          <div className="chart-container">
            <RevenueChart
              invoices={invoices}
              receipts={receipts}
              loading={invoicesLoading || receiptsLoading}
            />
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Invoice Status Distribution</h3>
          </div>
          <div className="chart-container">
            <InvoiceStatusChart invoices={invoices} loading={invoicesLoading} />
          </div>
        </div>
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Quote Status Distribution</h3>
          </div>
          <div className="chart-container">
            <QuoteStatusChart quotes={quotes} loading={quotesLoading} />
          </div>
        </div>
      </div>

      <div className="tables-grid grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="table-card">
          <div className="table-container">
            <RecentInvoices invoices={invoices} loading={invoicesLoading} />
          </div>
        </div>
        <div className="table-card">
          <div className="table-container">
            <RecentQuotes quotes={quotes} loading={quotesLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
