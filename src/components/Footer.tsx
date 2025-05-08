import React from "react";
import "../styles/footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer-section" id="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <a href="/" className="footer-logo">
                <img src="/logo.png" alt="footer-logo" width={100} />
              </a>
              <p>
                Risitify is the dedicated platform for performance management
                that helps to grow your startup quickly
              </p>
              <div className="footer-follow">
                <p>Follow:</p>
                <ul className="social-link">
                  <li>
                    <a href="#">
                      <img src="/icons/facebook.svg" alt="social-icon" />
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <img src="/icons/twitter.svg" alt="social-icon" />
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <img src="/icons/instagram.svg" alt="social-icon" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h6>Products</h6>
                <ul>
                  <li>
                    <a href="https://avatecinteractives.ng">HR Management</a>
                  </li>
                  <li>
                    <a href="https://avatecinteractives.ng">Invoice System</a>
                  </li>
                  <li>
                    <a href="https://avatecinteractives.ng">Email Marketing</a>
                  </li>
                  <li>
                    <a href="https://avatecinteractives.ng">
                      Digital Marketing
                    </a>
                  </li>
                </ul>
              </div>
              <div className="footer-column">
                <h6>Why choose</h6>
                <ul>
                  <li>
                    <a href="#">Customers</a>
                  </li>
                  <li>
                    <a href="#">Why Risitify ?</a>
                  </li>
                  <li>
                    <a href="https://avatecinteractives.ng">Book a demo</a>
                  </li>
                </ul>
              </div>
              <div className="footer-column">
                <h6>Resources</h6>
                <ul>
                  <li>
                    <a href="#">Latest Blog</a>
                  </li>
                  <li>
                    <a href="#">Supports</a>
                  </li>
                  <li>
                    <a href="#">Knowledgebase</a>
                  </li>
                  <li>
                    <a href="#">FAQs</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              <p>{new Date().getFullYear()} Risitify. All rights reserved.</p>
            </div>
            <ul className="privacy-menu">
              <li>
                <a href="/terms">Terms and conditions</a>
              </li>
              <li>
                <a href="#">Cookies</a>
              </li>
              <li>
                <a href="/privacy">Privacy policy</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
