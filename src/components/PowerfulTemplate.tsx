import React, { useEffect, useRef } from "react";

const PowerfulTemplate: React.FC = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (timelineRef.current && progressRef.current && sectionRef.current) {
        const section = sectionRef.current;
        const sectionRect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Calculate how far into the section we've scrolled
        const sectionTop = sectionRect.top;
        const sectionHeight = sectionRect.height;
        const scrollPosition = window.scrollY;
        const sectionOffset = scrollPosition + sectionTop;
        const sectionScrollable = sectionHeight - viewportHeight;

        // Calculate progress percentage
        let progress = 0;
        if (sectionTop <= 0) {
          // We're inside or have scrolled past the section
          const scrolled = Math.abs(sectionTop);
          progress = Math.min((scrolled / sectionScrollable) * 100, 100);
        } else if (sectionTop < viewportHeight) {
          // We're approaching the section
          progress = Math.min(
            ((viewportHeight - sectionTop) / sectionHeight) * 100,
            100
          );
        }

        // Ensure we reach 100% when near the bottom of the section
        if (sectionTop + sectionHeight <= viewportHeight + 100) {
          progress = 100;
        }

        progressRef.current.style.height = `${progress}%`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Run once to set initial state
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          <div className="timeline-innerline" ref={timelineRef}>
            <div className="timeline-progress" ref={progressRef}></div>
          </div>

          <div className="powerfull-template-row">
            <div className="powerfull-template-number">1</div>
            <div className="row">
              <div className="col-md-6">
                <div className="powerfull-template-img powerfull-template-img-left">
                  <img
                    src="/sass1/template-img1.png"
                    alt="Create Professional Invoices"
                  />
                </div>
              </div>
              <div className="col-md-6">
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
                      <span className="iconify" data-icon="bi:check-lg"></span>
                      Customizable templates
                    </li>
                    <li>
                      <span className="iconify" data-icon="bi:check-lg"></span>
                      Brand customization
                    </li>
                    <li>
                      <span className="iconify" data-icon="bi:check-lg"></span>
                      Multi-currency support
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="powerfull-template-row">
            <div className="powerfull-template-number">2</div>
            <div className="row flex-row-reverse">
              <div className="col-md-6">
                <div className="powerfull-template-img powerfull-template-img-right">
                  <img
                    src="/sass1/template-img2.png"
                    alt="Automate Your Workflow"
                  />
                </div>
              </div>
              <div className="col-md-6">
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

          <div className="powerfull-template-row">
            <div className="powerfull-template-number">3</div>
            <div className="row">
              <div className="col-md-6">
                <div className="powerfull-template-img powerfull-template-img-left">
                  <img src="/sass1/template-img3.png" alt="Track and Analyze" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="powerfull-template-text powerfull-template-text-right">
                  <h4>Track and Analyze</h4>
                  <p>
                    Get real-time insights into your business finances. Monitor
                    payment status, track revenue, and generate comprehensive
                    reports to make informed decisions.
                  </p>
                  <ul>
                    <li>
                      <span className="iconify" data-icon="bi:check-lg"></span>
                      Real-time payment tracking
                    </li>
                    <li>
                      <span className="iconify" data-icon="bi:check-lg"></span>
                      Financial analytics
                    </li>
                    <li>
                      <span className="iconify" data-icon="bi:check-lg"></span>
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
