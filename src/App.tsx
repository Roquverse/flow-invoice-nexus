
import React, { useEffect } from "react";
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
  useEffect(() => {
    // Load JavaScript files from public
    const vendorScript = document.createElement("script");
    vendorScript.src = "/js/vendor.min.js";
    vendorScript.async = true;

    const appScript = document.createElement("script");
    appScript.src = "/js/app.js";
    appScript.async = true;

    // Ensure vendor.min.js loads before app.js
    document.body.appendChild(vendorScript);
    vendorScript.onload = () => {
      document.body.appendChild(appScript);
    };

    return () => {
      // Clean up scripts when component unmounts
      if (document.body.contains(vendorScript)) {
        document.body.removeChild(vendorScript);
      }
      if (document.body.contains(appScript)) {
        document.body.removeChild(appScript);
      }
    };
  }, []);

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
            <Route index element={<Navigate to="/dashboard/overview" replace />} />
            <Route path="overview" element={<DashboardPage />} />
            <Route path="invoices" element={<div className="p-6">Invoices Content</div>} />
            <Route path="clients" element={<div className="p-6">Clients Content</div>} />
            <Route path="reports" element={<div className="p-6">Reports Content</div>} />
            <Route path="settings" element={<div className="p-6">Settings Content</div>} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;
