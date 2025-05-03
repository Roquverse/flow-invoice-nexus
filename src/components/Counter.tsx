import React, { useEffect } from "react";

const Counter: React.FC = () => {
  useEffect(() => {
    const counters = document.querySelectorAll(".counter");

    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute("data-target") || "0");
      const duration = 2000; // Animation duration in milliseconds
      const step = target / (duration / 16); // Update every 16ms (60fps)
      let current = 0;

      const updateCounter = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.ceil(current).toString();
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toString();
        }
      };

      updateCounter();
    });
  }, []);

  return (
    <div className="index2-statistics-section">
      <div className="container">
        <div className="index2-statistics-content">
          <div className="row">
            <div className="col-lg-5 col-md-4 md-mb-30">
              <div className="statistics-text">
                <h2 className="counter" data-target="50000">
                  0
                </h2>
                <p>Invoices Processed Monthly</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 md-mb-30">
              <div className="statistics-text">
                <h2>
                  <span className="counter" data-target="15000">
                    0
                  </span>
                  K
                </h2>
                <p>Active Businesses</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-4">
              <div className="statistics-text">
                <h2>
                  <span className="counter" data-target="98">
                    0
                  </span>
                  %
                </h2>
                <p>Payment Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Counter;
