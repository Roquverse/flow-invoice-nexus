import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

// Import Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

// Import other necessary CSS files
import "./styles/style.css";
import "./styles/responsive.css";
import "./styles/font-fixes.css";
import "./styles/pricing.css";
import "./styles/powerfulTemplate.css";

// Import jQuery and Bootstrap types
import $ from "jquery";
import { Tooltip, Popover } from "bootstrap";

// Import custom scripts initialization
import { initCustomScripts } from "./js";

declare global {
  interface Window {
    jQuery: typeof $;
    $: typeof $;
  }
}

window.jQuery = window.$ = $;

// Initialize all scripts
const initializeAll = async () => {
  // Initialize custom scripts first
  await initCustomScripts();

  // Initialize Bootstrap components after custom scripts are loaded
  $(document).ready(function () {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    const tooltipList = [...tooltipTriggerList].map(
      (tooltipTriggerEl) => new Tooltip(tooltipTriggerEl)
    );

    // Initialize Bootstrap popovers
    const popoverTriggerList = document.querySelectorAll(
      '[data-bs-toggle="popover"]'
    );
    const popoverList = [...popoverTriggerList].map(
      (popoverTriggerEl) => new Popover(popoverTriggerEl)
    );
  });
};

// Start initialization
initializeAll().catch(console.error);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
