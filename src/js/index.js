/**
 * Initialize custom scripts for the application
 */
export const initCustomScripts = async () => {
  // Initialize navbar mobile menu with a small delay to ensure DOM is ready
  setTimeout(initNavbarMobileMenu, 100);

  console.log("Custom scripts initialized");
  return true;
};

/**
 * Initialize the navbar mobile menu toggle functionality
 */
function initNavbarMobileMenu() {
  // Wait for DOM to be fully loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupNavbarHandlers);
  } else {
    setupNavbarHandlers();
  }
}

/**
 * Set up event handlers for the navbar mobile menu
 */
function setupNavbarHandlers() {
  const navExpander = document.getElementById("nav-expander");
  const mobileMenu = document.getElementById("mobile-navbar-menu");

  // If elements don't exist yet (like during hydration), wait and try again
  if (!navExpander || !mobileMenu) {
    console.log("Menu elements not found, retrying...");
    setTimeout(setupNavbarHandlers, 100);
    return;
  }

  console.log("Setting up navbar handlers");

  // Make sure initial state is correct
  const menuIcons = navExpander.querySelectorAll("img");
  if (menuIcons.length >= 2) {
    menuIcons[0].classList.add("visible");
    menuIcons[0].classList.remove("hidden");
    menuIcons[1].classList.add("hidden");
    menuIcons[1].classList.remove("visible");
  }

  // Handle nav expander click
  navExpander.addEventListener("click", function () {
    mobileMenu.classList.toggle("canvas-open");
    document.body.classList.toggle("canvas-open");

    // Toggle menu icons
    menuIcons.forEach((icon) => {
      icon.classList.toggle("visible");
      icon.classList.toggle("hidden");
    });
  });

  // Close mobile menu when clicking on menu links
  const mobileMenuLinks = mobileMenu.querySelectorAll("a");
  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", function () {
      mobileMenu.classList.remove("canvas-open");
      document.body.classList.remove("canvas-open");

      // Reset menu icons
      if (menuIcons.length >= 2) {
        menuIcons[0].classList.remove("hidden");
        menuIcons[0].classList.add("visible");
        menuIcons[1].classList.remove("visible");
        menuIcons[1].classList.add("hidden");
      }
    });
  });
}
