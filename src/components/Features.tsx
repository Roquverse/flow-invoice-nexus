import React from "react";

const Features: React.FC = () => {
  return (
    <section className="features-section">
      <div className="container">
        <div className="section-title text-center">
          <h2>Powerful Features for Your Business</h2>
          <p>
            Everything you need to manage your invoicing and payments
            efficiently
          </p>
        </div>

        <div className="row features-grid">
          <div className="col-lg-4 col-md-6">
            <div className="feature-card">
              <div className="icon">
                <img src="/sass1/invoice.svg" alt="Custom Invoices" />
              </div>
              <h3>Custom Invoices</h3>
              <p>
                Create professional, branded invoices with customizable
                templates and your company logo.
              </p>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="feature-card">
              <div className="icon">
                <img
                  src="/sass1/email-automotion.svg"
                  alt="Automated Reminders"
                />
              </div>
              <h3>Smart Reminders</h3>
              <p>
                Set up automatic payment reminders to reduce late payments and
                improve cash flow.
              </p>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="feature-card">
              <div className="icon">
                <img src="/sass1/inventory.svg" alt="Inventory Management" />
              </div>
              <h3>Inventory Tracking</h3>
              <p>
                Keep track of your products and services with integrated
                inventory management.
              </p>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="feature-card">
              <div className="icon">
                <img src="/sass1/chatbot.svg" alt="Client Portal" />
              </div>
              <h3>Client Portal</h3>
              <p>
                Give your clients access to their invoices, payments, and
                documents in one place.
              </p>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="feature-card">
              <div className="icon">
                <img src="/sass1/seo.svg" alt="Reports" />
              </div>
              <h3>Financial Reports</h3>
              <p>
                Generate detailed reports and insights to track your business
                performance.
              </p>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="feature-card">
              <div className="icon">
                <img src="/sass1/campaign.svg" alt="Multi-Currency" />
              </div>
              <h3>Multi-Currency</h3>
              <p>
                Send invoices and accept payments in multiple currencies for
                global business.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
