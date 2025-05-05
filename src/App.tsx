
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import SignIn from "./pages/auth/LoginPage";
import SignUp from "./pages/auth/SignupPage";
import Header from "./components/Header";
import Hero from "./components/Hero";
import WhyChooseUs from "./components/WhyChooseUs";
import Counter from "./components/Counter";
import PowerfulTemplate from "./components/PowerfulTemplate";
import Footer from "./components/Footer";
import { Toaster } from "sonner";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ClientsPage from "./pages/dashboard/ClientsPage";
import ProjectsPage from "./pages/dashboard/ProjectsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import InvoicesPage from "./pages/dashboard/InvoicesPage";
import QuotesPage from "./pages/dashboard/QuotesPage";
import ReceiptsPage from "./pages/dashboard/ReceiptsPage";
import InvoiceForm from "./components/invoice/InvoiceForm";
import QuoteForm from "./components/quote/QuoteForm";
import ReceiptForm from "./components/receipt/ReceiptForm";
import InvoicePreviewPage from "./pages/dashboard/InvoicePreviewPage";
import QuotePreviewPage from "./pages/dashboard/QuotePreviewPage";
import ReceiptPreviewPage from "./pages/dashboard/ReceiptPreviewPage";

// Import styles
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/variables.css";
import "./styles/icons.css";
import "./styles/auth.css";
import "./styles/global.css";
import "./styles/app.min.css";
import "./styles/vendor.min.css";
import "./styles/style.css";
import "./styles/risitify.css";
import "./styles/why-choose-us.css";
import "./styles/footer.css";
import "./styles/powerfulTemplate.css";
import "./styles/responsive.css";
import "./styles/animate.css";
import "./styles/slick.css";
import "./styles/slick-theme.css";
import "./styles/header.css";
import "./styles/custom.css";

const HomePage: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <WhyChooseUs />
        <Counter />
        <PowerfulTemplate />
      </main>
      <Footer />
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div>
        <Toaster position="top-right" richColors />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route
              index
              element={<Navigate to="/dashboard/overview" replace />}
            />
            <Route path="overview" element={<DashboardPage />} />

            {/* Invoice Routes */}
            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="invoices/new" element={<InvoiceForm />} />
            <Route path="invoices/:id" element={<InvoicesPage />} />
            <Route
              path="invoices/:id/edit"
              element={<InvoiceForm isEditing />}
            />
            <Route
              path="invoices/preview/:id"
              element={<InvoicePreviewPage />}
            />

            {/* Quote Routes */}
            <Route path="quotes" element={<QuotesPage />} />
            <Route path="quotes/new" element={<QuoteForm />} />
            <Route path="quotes/:id" element={<QuotesPage />} />
            <Route path="quotes/:id/edit" element={<QuoteForm isEditing />} />
            <Route path="quotes/preview/:id" element={<QuotePreviewPage />} />

            {/* Receipt Routes */}
            <Route path="receipts" element={<ReceiptsPage />} />
            <Route path="receipts/new" element={<ReceiptForm />} />
            <Route path="receipts/:id" element={<ReceiptsPage />} />
            <Route
              path="receipts/:id/edit"
              element={<ReceiptForm isEditing />}
            />
            <Route
              path="receipts/preview/:id"
              element={<ReceiptPreviewPage />}
            />

            <Route path="clients" element={<ClientsPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;
