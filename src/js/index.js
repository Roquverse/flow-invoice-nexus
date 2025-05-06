
/**
 * Initialize custom scripts for the application
 */
export const initCustomScripts = async () => {
  // Basic initialization for simple animation effects
  const initSimpleAnimations = () => {
    console.log("Simple animations initialized");
  };

  // Initialize animations when DOM is loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSimpleAnimations);
  } else {
    initSimpleAnimations();
  }

  // Fix for the RTL support - Adding null check to prevent the error
  try {
    const appStyleElement = document.getElementById("app-style");
    if (appStyleElement && appStyleElement.href) {
      // Only proceed if the element exists and has an href attribute
      if (appStyleElement.href.includes("rtl.min.css")) {
        const htmlElement = document.getElementsByTagName("html")[0];
        if (htmlElement) {
          htmlElement.dir = "rtl";
        }
      }
    }
  } catch (error) {
    console.error("Error handling RTL support:", error);
  }

  console.log("Custom scripts initialized");
  return true;
};
