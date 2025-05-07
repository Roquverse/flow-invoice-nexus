
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import DashboardPage from "./pages/dashboard/DashboardPage";
import InvoicesPage from "./pages/dashboard/InvoicesPage";
import QuotesPage from "./pages/dashboard/QuotesPage";
import ReceiptsPage from "./pages/dashboard/ReceiptsPage";
import ModernInvoicePage from "./pages/dashboard/ModernInvoicePage";
import ModernInvoicePreviewPage from "./pages/dashboard/ModernInvoicePreviewPage";
import ModernReceiptPage from "./pages/dashboard/ModernReceiptPage";
import ReceiptPreviewPage from "./pages/dashboard/ReceiptPreviewPage";
import QuotePreviewPage from "./pages/dashboard/QuotePreviewPage";
import InvoicePreviewPage from "./pages/dashboard/InvoicePreviewPage";
import ClientsPage from "./pages/dashboard/ClientsPage";
import ClientDetailPage from "./pages/dashboard/ClientDetailPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import ProjectsPage from "./pages/dashboard/ProjectsPage";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminInvoicesPage from "./pages/admin/AdminInvoicesPage";
import AdminQuotesPage from "./pages/admin/AdminQuotesPage";
import AdminReceiptsPage from "./pages/admin/AdminReceiptsPage";
import AdminSubscriptionsPage from "./pages/admin/AdminSubscriptionsPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import AdminLogin from "./components/admin/AdminLogin";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";

import "./App.css";
import { Toaster } from "sonner";
import React from "react";

function App() {
  return (
    <Router>
      <AdminAuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/sign-in" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignupPage />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="invoices/:id" element={<InvoicePreviewPage />} />
            <Route path="modern-invoice" element={<ModernInvoicePage />} />
            <Route
              path="modern-invoice/:id"
              element={<ModernInvoicePreviewPage />}
            />
            <Route path="quotes" element={<QuotesPage />} />
            <Route path="quotes/:id" element={<QuotePreviewPage />} />
            <Route path="receipts" element={<ReceiptsPage />} />
            <Route path="receipts/:id" element={<ReceiptPreviewPage />} />
            <Route path="modern-receipt" element={<ModernReceiptPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="clients/:id" element={<ClientDetailPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="projects" element={<ProjectsPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="invoices" element={<AdminInvoicesPage />} />
            <Route path="quotes" element={<AdminQuotesPage />} />
            <Route path="receipts" element={<AdminReceiptsPage />} />
            <Route path="subscriptions" element={<AdminSubscriptionsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AdminAuthProvider>
      <Toaster richColors position="top-right" />
    </Router>
  );
}

export default App;
