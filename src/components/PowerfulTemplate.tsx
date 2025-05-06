import React, { useEffect, useRef, useState } from "react";
import "../styles/powerfulTemplate.css";

const PowerfulTemplate: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Store active state for each row
  const [activeRows, setActiveRows] = useState<boolean[]>([
    false,
    false,
    false,
  ]);

  useEffect(() => {
    // Set refs for the rows
    rowRefs.current = rowRefs.current.slice(0, 3);

    const handleScroll = () => {
      if (sectionRef.current) {
        const section = sectionRef.current;
        const sectionRect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Update active state for each row
        const newActiveRows = [...activeRows];
        rowRefs.current.forEach((row, index) => {
          if (row) {
            const rect = row.getBoundingClientRect();
            // Activate earlier for a smoother experience
            const isInView = rect.top < viewportHeight * 0.85;
            newActiveRows[index] = isInView;
          }
        });

        if (JSON.stringify(newActiveRows) !== JSON.stringify(activeRows)) {
          setActiveRows(newActiveRows);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Run once to set initial state
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeRows]);

  return (
    <div
      className="powerfull-template-section"
      id="powerful-template"
      ref={sectionRef}
    >
      <div className="container">
        <div className="section-title md-mb-0 text-center">
          <h2>Streamline Your Invoicing Process</h2>
          <h6 className="mb-0">
            Join thousands of businesses that trust our platform for their
            invoicing needs
          </h6>
        </div>
        <div className="powerfull-template-content">
          <div
            className={`powerfull-template-row ${
              activeRows[0] ? "active" : ""
            }`}
            ref={(el) => (rowRefs.current[0] = el)}
          >
            <div className="row">
              <div className="col-lg-6 order-lg-1 order-md-2 order-2">
                <div className="powerfull-template-img powerfull-template-img-left">
                  <img
                    src="/sass1/template-img1.png"
                    alt="Create Professional Invoices"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="col-lg-6 order-lg-2 order-md-1 order-1">
                <div className="powerfull-template-text powerfull-template-text-right">
                  <h4>Create Professional Invoices</h4>
                  <p>
                    Design beautiful, professional invoices in minutes with our
                    intuitive interface. Choose from customizable templates, add
                    your branding, and include all necessary details with just a
                    few clicks.
                  </p>
                  <ul>
                    <li>
                      <span>
                        <img src="/icons/check-green.svg" alt="check" />
                      </span>
                      Customizable templates
                    </li>
                    <li>
                      <span>
                        <img src="/icons/check-green.svg" alt="check" />
                      </span>
                      Brand customization
                    </li>
                    <li>
                      <span>
                        <img src="/icons/check-green.svg" alt="check" />
                      </span>
                      Multi-currency support
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`powerfull-template-row ${
              activeRows[1] ? "active" : ""
            }`}
            ref={(el) => (rowRefs.current[1] = el)}
          >
            <div className="row">
              <div className="col-lg-6 order-lg-2 order-md-2 order-2">
                <div className="powerfull-template-img powerfull-template-img-right">
                  <img
                    src="/sass1/template-img2.png"
                    alt="Automate Your Workflow"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="col-lg-6 order-lg-1 order-md-1 order-1">
                <div className="powerfull-template-text powerfull-template-text-left">
                  <h4>Automate Your Workflow</h4>
                  <h6>
                    Save time and reduce errors with automated invoicing
                    processes
                  </h6>
                  <p>
                    Set up recurring invoices, automatic payment reminders, and
                    late fee calculations. Our system handles the routine tasks
                    so you can focus on growing your business.
                  </p>
                  <ol>
                    <li>
                      <span>
                        <img src="/icons/monitor_icon.svg" alt="icon" />
                      </span>
                      Recurring invoices
                    </li>
                    <li>
                      <span>
                        <img src="/icons/message_icon.svg" alt="icon" />
                      </span>
                      Payment reminders
                    </li>
                    <li>
                      <span>
                        <img src="/icons/document_icon.svg" alt="icon" />
                      </span>
                      Late fee automation
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`powerfull-template-row ${
              activeRows[2] ? "active" : ""
            }`}
            ref={(el) => (rowRefs.current[2] = el)}
          >
            <div className="row">
              <div className="col-lg-6 order-lg-1 order-md-2 order-2">
                <div className="powerfull-template-img powerfull-template-img-left">
                  <img
                    src="/sass1/template-img3.png"
                    alt="Track and Analyze"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="col-lg-6 order-lg-2 order-md-1 order-1">
                <div className="powerfull-template-text powerfull-template-text-right">
                  <h4>Track and Analyze</h4>
                  <p>
                    Get real-time insights into your business finances. Monitor
                    payment status, track revenue, and generate comprehensive
                    reports to make informed decisions.
                  </p>
                  <ul>
                    <li>
                      <span>
                        <img src="/icons/check-green.svg" alt="check" />
                      </span>
                      Real-time payment tracking
                    </li>
                    <li>
                      <span>
                        <img src="/icons/check-green.svg" alt="check" />
                      </span>
                      Financial analytics
                    </li>
                    <li>
                      <span>
                        <img src="/icons/check-green.svg" alt="check" />
                      </span>
                      Custom reports
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PowerfulTemplate;
