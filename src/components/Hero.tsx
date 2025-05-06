import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const words = ["Business", "Clients", "Projects"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const slideLeftRef = useRef<HTMLUListElement>(null);
  const slideRightRef = useRef<HTMLUListElement>(null);

  // Word animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        setIsAnimating(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Simple carousel scrolling
  useEffect(() => {
    const slideLeft = slideLeftRef.current;
    const slideRight = slideRightRef.current;

    if (slideLeft && slideRight) {
      const animate = () => {
        if (
          slideLeft.scrollLeft >=
          slideLeft.scrollWidth - slideLeft.clientWidth
        ) {
          slideLeft.scrollLeft = 0;
        } else {
          slideLeft.scrollLeft += 1;
        }

        if (
          slideRight.scrollLeft >=
          slideRight.scrollWidth - slideRight.clientWidth
        ) {
          slideRight.scrollLeft = 0;
        } else {
          slideRight.scrollLeft += 1;
        }
      };

      const interval = setInterval(animate, 30);
      return () => clearInterval(interval);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      navigate(`/sign-up?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <section className="hero-section-index5" id="hero">
      <div className="container">
        <div className="index5-hero-content">
          <div className="v5welocme-section">
            <img src="/icons/hands.png" alt="icons" /> Welcome to Risitify
          </div>
          <div className="v5banner-text">
            <h1 className="banner-title text-center">
              <span className="brack-text">Smart Invoicing</span> for your{" "}
              <span className="word-animation-wrapper">
                <span
                  className={`animated-word ${
                    isAnimating ? "fade-out" : "fade-in"
                  }`}
                >
                  {words[currentWordIndex]}
                </span>
              </span>
            </h1>
            <p>
              Streamline your invoicing process with our powerful platform.
              Create, send, and track invoices effortlessly while managing your
              business finances with ease.
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="bg-blue-btn">
              <span className="btn-inner">
                <span className="btn-normal-text">Get Started</span>
                <span className="btn-hover-text">Get Started</span>
              </span>
            </button>
          </form>
        </div>
        <div className="index5-hero-img">
          <img src="/banner.png" alt="img" />
        </div>
      </div>
      <div
        className="index5-scroll-carousel-section"
        style={{ boxShadow: "none" }}
      >
        <ul
          className="slide-left"
          ref={slideLeftRef}
          style={{ boxShadow: "none" }}
        >
          <li style={{ boxShadow: "none" }}>
            <span>
              <img src="/sass1/team-managemnet.svg" alt="img" />
            </span>
            <strong>Invoice Creation</strong>
          </li>
          <li style={{ boxShadow: "none" }}>
            <span>
              <img src="/sass1/invoice.svg" alt="img" />
            </span>
            <strong>Payment Tracking</strong>
          </li>
          <li style={{ boxShadow: "none" }}>
            <span>
              <img src="/sass1/meeting.svg" alt="img" />
            </span>
            <strong>Client Management</strong>
          </li>
          <li style={{ boxShadow: "none" }}>
            <span>
              <img src="/sass1/chatbot.svg" alt="img" />
            </span>
            <strong>Automated Reminders</strong>
          </li>
          <li style={{ boxShadow: "none" }}>
            <span>
              <img src="/sass1/seo.svg" alt="img" />
            </span>
            <strong>Financial Reports</strong>
          </li>
          <li style={{ boxShadow: "none" }}>
            <span>
              <img src="/sass1/telehealth.svg" alt="img" />
            </span>
            <strong>Online Payments</strong>
          </li>
          <li style={{ boxShadow: "none" }}>
            <span>
              <img src="/sass1/invoice.svg" alt="img" />
            </span>
            <strong>Tax Management</strong>
          </li>
        </ul>
        <ul
          className="slide-right"
          ref={slideRightRef}
          style={{ boxShadow: "none" }}
        >
          <li style={{ boxShadow: "none" }}>
            <span>
              <img src="/sass1/team-managemnet.svg" alt="img" />
            </span>
            <strong>Multi-Currency</strong>
          </li>
          <li style={{ boxShadow: "none" }}>
            <span>
              <img src="/sass1/chat-inventory.svg" alt="img" />
            </span>
            <strong>Expense Tracking</strong>
          </li>
          <li style={{ boxShadow: "none" }}>
            <span>
              <img src="/sass1/inventory.svg" alt="img" />
            </span>
            <strong>Inventory Sync</strong>
          </li>
          <li style={{ boxShadow: "none" }}>
            <span>
              <img src="/sass1/email-automotion.svg" alt="img" />
            </span>
            <strong>Email Notifications</strong>
          </li>
          <li style={{ boxShadow: "none" }}>
            <span>
              <img src="/sass1/help-desk.svg" alt="img" />
            </span>
            <strong>Customer Support</strong>
          </li>
          <li style={{ boxShadow: "none" }}>
            <span>
              <img src="/sass1/campaign.svg" alt="img" />
            </span>
            <strong>Custom Templates</strong>
          </li>
          <li style={{ boxShadow: "none" }}>
            <span>
              <img src="/sass1/saas.svg" alt="img" />
            </span>
            <strong>Cloud Storage</strong>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Hero;
