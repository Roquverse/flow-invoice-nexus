import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Set up mobile menu toggle
  useEffect(() => {
    const mobileMenu = document.getElementById("mobile-menu");
    if (mobileMenu) {
      if (mobileMenuOpen) {
        mobileMenu.style.display = "block";
      } else {
        mobileMenu.style.display = "none";
      }
    }
  }, [mobileMenuOpen]);

  return (
    <header
      className="header-section"
      style={{
        backgroundColor: "transparent",
        position: "relative",
        padding: "15px 0",
        width: "100%",
        zIndex: 100,
      }}
    >
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <div style={{ flexShrink: 0 }}>
            <Link to="/">
              <img src="/logo.png" alt="Risitify" width="138" />
            </Link>
          </div>

          {/* Navigation Links - Using inline styles to ensure visibility */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "40px",
              flexGrow: 1,
            }}
            className="d-none d-lg-flex"
          >
            <nav>
              <ul
                style={{
                  display: "flex",
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                }}
              >
                <li style={{ margin: "0 15px" }}>
                  <Link
                    to="/"
                    style={{
                      color: "#000",
                      fontWeight: 600,
                      textDecoration: "none",
                      position: "relative",
                      padding: "8px 0",
                    }}
                    onClick={() => scrollToSection("hero")}
                  >
                    Home
                  </Link>
                </li>
                <li style={{ margin: "0 15px" }}>
                  <Link
                    to="/"
                    style={{
                      color: "#000",
                      fontWeight: 600,
                      textDecoration: "none",
                      position: "relative",
                      padding: "8px 0",
                    }}
                    onClick={() => scrollToSection("why-choose-us")}
                  >
                    About
                  </Link>
                </li>
                <li style={{ margin: "0 15px" }}>
                  <Link
                    to="/"
                    style={{
                      color: "#000",
                      fontWeight: 600,
                      textDecoration: "none",
                      position: "relative",
                      padding: "8px 0",
                    }}
                    onClick={() => scrollToSection("powerful-template")}
                  >
                    Services
                  </Link>
                </li>
                <li style={{ margin: "0 15px" }}>
                  <Link
                    to="/"
                    style={{
                      color: "#000",
                      fontWeight: 600,
                      textDecoration: "none",
                      position: "relative",
                      padding: "8px 0",
                    }}
                    onClick={() => scrollToSection("footer")}
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
            className="d-none d-lg-flex"
          >
            <Link
              to="/sign-in"
              style={{
                marginRight: "20px",
                color: "#000",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Sign in
            </Link>
            <Link to="/sign-up" className="bg-pink-btn">
              <span className="btn-inner">
                <span className="btn-normal-text">Sign Up</span>
                <span className="btn-hover-text">Sign Up</span>
              </span>
            </Link>
          </div>

          {/* Mobile Menu Toggler */}
          <button
            id="nav-expander"
            className="d-lg-none"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
            onClick={toggleMobileMenu}
          >
            {!mobileMenuOpen ? (
              <img src="/icons/menu.svg" alt="Menu" width="24" height="24" />
            ) : (
              <img
                src="/icons/menu-close.svg"
                alt="Close"
                width="24"
                height="24"
              />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Outside the container for full-width styling */}
      <div
        id="mobile-menu"
        className="d-lg-none"
        style={{
          display: "none",
          position: "absolute",
          width: "100%",
          backgroundColor: "white",
          zIndex: 1000,
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          left: 0,
          top: "100%",
        }}
      >
        <div className="container py-3">
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "15px",
            }}
          >
            <button
              onClick={closeMobileMenu}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "5px",
              }}
            >
              <img
                src="/icons/menu-close.svg"
                alt="Close"
                width="20"
                height="20"
              />
            </button>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{ margin: "10px 0" }}>
              <Link
                to="/"
                style={{
                  color: "#000",
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "block",
                }}
                onClick={() => {
                  scrollToSection("hero");
                  closeMobileMenu();
                }}
              >
                Home
              </Link>
            </li>
            <li style={{ margin: "10px 0" }}>
              <Link
                to="/"
                style={{
                  color: "#000",
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "block",
                }}
                onClick={() => {
                  scrollToSection("why-choose-us");
                  closeMobileMenu();
                }}
              >
                About
              </Link>
            </li>
            <li style={{ margin: "10px 0" }}>
              <Link
                to="/"
                style={{
                  color: "#000",
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "block",
                }}
                onClick={() => {
                  scrollToSection("powerful-template");
                  closeMobileMenu();
                }}
              >
                Services
              </Link>
            </li>
            <li style={{ margin: "10px 0" }}>
              <Link
                to="/"
                style={{
                  color: "#000",
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "block",
                }}
                onClick={() => {
                  scrollToSection("footer");
                  closeMobileMenu();
                }}
              >
                Contact
              </Link>
            </li>
            <li style={{ margin: "10px 0" }}>
              <Link
                to="/sign-in"
                style={{
                  color: "#000",
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "block",
                }}
              >
                Sign in
              </Link>
            </li>
            <li style={{ margin: "15px 0" }}>
              <Link
                to="/sign-up"
                className="bg-pink-btn"
                style={{ display: "inline-block" }}
              >
                <span className="btn-inner">
                  <span className="btn-normal-text">Sign Up</span>
                  <span className="btn-hover-text">Sign Up</span>
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
