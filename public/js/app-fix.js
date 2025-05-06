// Override the initComponents method to fix the null reference error
document.addEventListener("DOMContentLoaded", function () {
  // Wait for main app.js to load
  setTimeout(() => {
    if (typeof App !== "undefined") {
      console.log(
        "Patching App.initComponents to prevent null reference errors"
      );

      // Override the initComponents method
      App.prototype.initComponents = function () {
        // Initialize lucide icons if available
        if (typeof lucide !== "undefined" && lucide.createIcons) {
          lucide.createIcons();
        }

        // Preloader fade out
        $(window).on("load", function () {
          $("#status").fadeOut();
          $("#preloader").delay(350).fadeOut("slow");
        });

        // Initialize Bootstrap components
        try {
          // Popovers
          if (typeof bootstrap !== "undefined") {
            const popoverTriggerList = document.querySelectorAll(
              '[data-bs-toggle="popover"]'
            );
            if (popoverTriggerList.length) {
              [...popoverTriggerList].map((el) => new bootstrap.Popover(el));
            }

            // Tooltips
            const tooltipTriggerList = document.querySelectorAll(
              '[data-bs-toggle="tooltip"]'
            );
            if (tooltipTriggerList.length) {
              [...tooltipTriggerList].map((el) => new bootstrap.Tooltip(el));
            }

            // Offcanvas
            const offcanvasList = document.querySelectorAll(".offcanvas");
            if (offcanvasList.length) {
              [...offcanvasList].map((el) => new bootstrap.Offcanvas(el));
            }
          }
        } catch (err) {
          console.error("Error initializing Bootstrap components:", err);
        }

        // Toast placement
        const toastPlacement = document.getElementById("toastPlacement");
        const selectToastPlacement = document.getElementById(
          "selectToastPlacement"
        );

        if (toastPlacement && selectToastPlacement) {
          selectToastPlacement.addEventListener("change", function () {
            if (!toastPlacement.dataset.originalClass) {
              toastPlacement.dataset.originalClass = toastPlacement.className;
            }
            toastPlacement.className =
              toastPlacement.dataset.originalClass + " " + this.value;
          });
        }

        // Initialize toasts
        try {
          const toastElList = document.querySelectorAll(".toast");
          if (toastElList.length) {
            [].slice.call(toastElList).map(function (el) {
              return new bootstrap.Toast(el);
            });
          }
        } catch (err) {
          console.error("Error initializing toasts:", err);
        }

        // Live alert
        const alertPlaceholder = document.getElementById(
          "liveAlertPlaceholder"
        );
        const alertTrigger = document.getElementById("liveAlertBtn");

        if (alertTrigger && alertPlaceholder) {
          alertTrigger.addEventListener("click", () => {
            const message = "Nice, you triggered this alert message!";
            const type = "success";
            const alertEl = document.createElement("div");
            alertEl.innerHTML = [
              `<div class="alert alert-${type} alert-dismissible" role="alert">`,
              `   <div>${message}</div>`,
              '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
              "</div>",
            ].join("");
            alertPlaceholder.append(alertEl);
          });
        }

        // RTL support - The main fix for the null reference error
        try {
          console.log("Checking for RTL support");
          const appStyle = document.getElementById("app-style");
          // Add explicit null/undefined checks
          if (appStyle && typeof appStyle === "object" && appStyle !== null) {
            if (
              appStyle.hasAttribute("href") &&
              appStyle.getAttribute("href") &&
              appStyle.getAttribute("href").includes("rtl.min.css")
            ) {
              const htmlElement = document.getElementsByTagName("html")[0];
              if (htmlElement) {
                htmlElement.dir = "rtl";
              }
            }
          } else {
            console.log("app-style element not found or invalid");
          }
        } catch (err) {
          console.error("Error handling RTL support:", err);
        }
      };

      // Apply the patch immediately as well
      try {
        console.log("Running initComponents immediately");
        if (typeof App.main === "object" && App.main !== null) {
          App.main.initComponents();
        }
      } catch (err) {
        console.error("Error applying immediate initComponents patch:", err);
      }

      console.log(
        "App.initComponents has been patched to fix null reference error"
      );
    } else {
      console.warn("App is undefined, patch not applied");
    }
  }, 500);
});
