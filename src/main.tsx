
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";

// Import Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

// Import Bootstrap JS
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Import other necessary CSS files
import "./styles/style.css";
import "./styles/responsive.css";
import "./styles/font-fixes.css";
import "./styles/pricing.css";
import "./styles/powerfulTemplate.css";
import "./styles/auth-pages.css";
import "./styles/hero-animations.css";
import "./index.css";
import "./styles/dashboard.css";

// Import custom scripts initialization
import { initCustomScripts } from "./js";

// Initialize all scripts
const initializeAll = async () => {
  try {
    // Initialize custom scripts
    await initCustomScripts();
  } catch (error) {
    console.error("Error initializing custom scripts:", error);
  }
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
