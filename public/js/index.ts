import $ from "jquery";

// Load scripts in the correct order
const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
};

// Check if a jQuery plugin exists
const hasPlugin = (pluginName: string): boolean => {
  return typeof ($.fn as any)[pluginName] === "function";
};

// Initialize custom functionality
export const initCustomScripts = async () => {
  try {
    // Load scripts in sequence
    await loadScript("/assets/js/jquery-3.6.1.min.js");
    await loadScript("/assets/js/popper.min.js");
    await loadScript("/assets/js/bootstrap.min.js");
    await loadScript("/assets/js/modernizr.js");
    await loadScript("/assets/js/slick.min.js");
    await loadScript("/assets/js/swiper.min.js");
    await loadScript("/assets/js/masonry.pkgd.min.js");
    await loadScript("/assets/js/iconify.min.js");
    await loadScript("/assets/js/jquery-asPieProgress.js");
    await loadScript("/assets/js/venobox.min.js");
    await loadScript("/assets/js/splitting.js");
    await loadScript("/assets/js/splitting-out.js");
    await loadScript("/assets/js/jquery.rollNumber.js");
    await loadScript("/assets/js/ScrollTrigger.min.js");
    await loadScript("/assets/js/headline.js");
    await loadScript("/assets/js/lightbox.js");
    await loadScript("/assets/js/sticky-sidebar.js");
    await loadScript("/assets/js/imagesloaded.pkgd.min.js");
    await loadScript("/assets/js/isotope.pkgd.min.js");
    await loadScript("/assets/js/parallax.min.js");
    await loadScript("/assets/js/main.js");

    // Initialize components after all scripts are loaded
    $(document).ready(() => {
      try {
        // Initialize Slick Slider
        if (hasPlugin("slick")) {
          $(".slick-slider").slick();
        }

        // Initialize Swiper
        if (typeof window.Swiper === "function") {
          new window.Swiper(".swiper-container", {
            direction: "horizontal",
            loop: true,
            pagination: {
              el: ".swiper-pagination",
            },
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
          });
        }

        // Initialize VenoBox
        if (hasPlugin("venoBox")) {
          $(".venobox").venoBox();
        }

        // Initialize Masonry
        if (hasPlugin("masonry")) {
          $(".grid").masonry({
            itemSelector: ".grid-item",
            columnWidth: ".grid-sizer",
            percentPosition: true,
          });
        }

        // Initialize Isotope
        if (hasPlugin("isotope")) {
          $(".isotope-grid").isotope({
            itemSelector: ".isotope-item",
            layoutMode: "fitRows",
          });
        }

        // Initialize ScrollTrigger
        if (
          typeof window.ScrollTrigger === "object" &&
          typeof window.ScrollTrigger.init === "function"
        ) {
          window.ScrollTrigger.init();
        }

        // Initialize Splitting
        if (typeof window.Splitting === "function") {
          window.Splitting();
        }

        // Initialize asPieProgress
        if (hasPlugin("asPieProgress")) {
          $(".pie_progress").asPieProgress({
            namespace: "pie_progress",
          });
        }

        // Initialize Sticky Sidebar
        if (hasPlugin("stickySidebar")) {
          $(".sticky-sidebar").stickySidebar({
            topSpacing: 20,
            bottomSpacing: 20,
          });
        }

        // Initialize Lightbox
        if (
          typeof window.lightbox === "object" &&
          typeof window.lightbox.option === "function"
        ) {
          window.lightbox.option({
            resizeDuration: 200,
            wrapAround: true,
          });
        }

        // Initialize Parallax
        if (hasPlugin("parallax")) {
          $(".parallax-window").parallax();
        }

        // Dark Mode Toggle
        const darkModeToggle = document.querySelector(".dark-mode-toggle");
        if (darkModeToggle) {
          darkModeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
          });
        }
      } catch (error) {
        console.error("Error initializing components:", error);
      }
    });
  } catch (error) {
    console.error("Error loading scripts:", error);
  }
};

// Export function to reinitialize scripts
export const reinitializeScripts = () => {
  initCustomScripts();
};
