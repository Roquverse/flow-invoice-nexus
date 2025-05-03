import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollActive, setScrollActive] = useState(false);

  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    document.body.classList.toggle("canvas-open");
  };

  // Close mobile menu when clicking on a link
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.classList.remove("canvas-open");
  };

  const scrollToSection = (sectionId: string) => {
    closeMobileMenu();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Add scroll event listener to change header background on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrollActive(true);
      } else {
        setScrollActive(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 991 && mobileMenuOpen) {
        closeMobileMenu();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuOpen]);

  // Add event listener for when the mobile menu expander is clicked
  useEffect(() => {
    const navExpander = document.getElementById("nav-expander");

    if (navExpander) {
      navExpander.addEventListener("click", toggleMobileMenu);
    }

    return () => {
      if (navExpander) {
        navExpander.removeEventListener("click", toggleMobileMenu);
      }
    };
  }, []);

  return (
    <>
      <header
        className={`header-section ${scrollActive ? "header-sticky" : ""}`}
      >
        <div className="container">
          <nav className="navbar navbar-expand-lg">
            <div className="header-navbar-container">
              <Link className="navbar-brand header-logo" to="/">
                <img src="/logo.png" alt="Risitify" width="138" />
              </Link>

              <button
                id="nav-expander"
                className={`nav-expander bar ${mobileMenuOpen ? "active" : ""}`}
                aria-label="Toggle navigation"
              >
                <img
                  src="/icons/menu.svg"
                  alt="menu"
                  className={!mobileMenuOpen ? "visible" : "hidden"}
                />
                <img
                  src="/icons/menu-close.svg"
                  alt="close menu"
                  className={mobileMenuOpen ? "visible" : "hidden"}
                />
              </button>

              <div
                className="collapse navbar-collapse header-navbar-content"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav main-menu">
                  <li className="nav-item">
                    <Link className="nav-link" to="/">
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/"
                      onClick={() => scrollToSection("why-choose-us")}
                    >
                      About
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/"
                      onClick={() => scrollToSection("powerful-template")}
                    >
                      Services
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/pricing">
                      Pricing
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/"
                      onClick={() => scrollToSection("footer")}
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
                <div className="header-buttons">
                  <Link to="/sign-in" className="sign-in-link">
                    Sign in
                  </Link>
                  <Link to="/contact" className="lets-talk-btn">
                    Let's Talk
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* <!-- Canvas Mobile Menu start --> */}
      <nav
        className={`right_menu_togle mobile-navbar-menu header-3-canva ${
          mobileMenuOpen ? "canvas-open" : ""
        }`}
        id="mobile-navbar-menu"
      >
        <ul className="nav-menu">
          <li className="current-menu-item">
            <Link to="/" onClick={closeMobileMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/" onClick={() => scrollToSection("why-choose-us")}>
              About
            </Link>
          </li>
          <li>
            <Link to="/" onClick={() => scrollToSection("powerful-template")}>
              Services
            </Link>
          </li>
          <li>
            <Link to="/pricing" onClick={closeMobileMenu}>
              Pricing
            </Link>
          </li>
          <li>
            <Link to="/" onClick={() => scrollToSection("footer")}>
              Contact
            </Link>
          </li>
        </ul>
        <div className="mobile-button-group">
          <Link
            to="/sign-in"
            className="mobile-button"
            onClick={closeMobileMenu}
          >
            Sign in
          </Link>
          <Link
            to="/contact"
            className="mobile-button primary"
            onClick={closeMobileMenu}
          >
            Let's Talk
          </Link>
        </div>
      </nav>
      {/* Canvas Menu end */}
    </>
  );
};

export default Header;
