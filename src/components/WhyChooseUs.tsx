import React from "react";
import "../styles/why-choose-us.css";

const WhyChooseUs: React.FC = () => {
  return (
    <div className="why-chose-us-section" id="why-choose-us">
      <div className="container">
        <div className="section-title md-mb-0 text-center">
          <span className="sub-title">Why Choose us</span>
          <h2 className="title">Features that make invoicing easier</h2>
        </div>
        <div className="why-chose-us-content">
          <div className="why-chose-us-cards">
            <div className="why-chose-us-card">
              <h5>Quick Invoice Creation</h5>
              <p>
                Create professional invoices in minutes with our intuitive
                interface. Save time with customizable templates and automated
                calculations.
              </p>
              <div className="why-chose-us-img">
                <img src="/sass1/chose-us-img1.png" alt="img" />
              </div>
            </div>
            <div className="why-chose-us-card active">
              <h5>Automated Payments</h5>
              <p>
                Accept payments online and track them automatically. Get
                notified when payments are received and send automated reminders
                for overdue invoices.
              </p>
              <div className="why-chose-us-img">
                <img src="/sass1/chose-us-img2.png" alt="img" />
              </div>
            </div>
            <div className="why-chose-us-card">
              <h5>Financial Insights</h5>
              <p>
                Get detailed reports and analytics to understand your business
                performance. Track revenue, monitor cash flow, and make informed
                decisions.
              </p>
              <div className="why-chose-us-img">
                <img src="/sass1/chose-us-img3.png" alt="img" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
