import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";

// Import Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

// Import other necessary CSS files
import "./styles/style.css";
import "./styles/responsive.css";
import "./styles/font-fixes.css";
import "./styles/pricing.css";
import "./styles/powerfulTemplate.css";
import "./styles/auth-pages.css";
import "./index.css";
import "./styles/dashboard.css";

// Import custom scripts initialization
import { initCustomScripts } from "./js";

// Import Bootstrap components (using standard approach)
import * as bootstrap from "bootstrap";

// Initialize all scripts
const initializeAll = async () => {
  // Initialize custom scripts first
  await initCustomScripts();

  // Initialize Bootstrap components after custom scripts are loaded
  document.addEventListener("DOMContentLoaded", function () {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    [...tooltipTriggerList].map(
      (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
    );

    // Initialize Bootstrap popovers
    const popoverTriggerList = document.querySelectorAll(
      '[data-bs-toggle="popover"]'
    );
    [...popoverTriggerList].map(
      (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
    );
  });
};

// Start initialization
initializeAll().catch(console.error);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
