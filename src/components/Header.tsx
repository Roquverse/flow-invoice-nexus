
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Header: React.FC = () => {
  const { user } = useAuth();
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      closeMobileMenu();
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.classList.remove("canvas-open");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.classList.toggle("canvas-open");
    
    // Toggle menu icons visibility
    const menuIcons = document.querySelectorAll(".nav-expander.bar img");
    if (menuIcons.length >= 2) {
      menuIcons.forEach((icon) => {
        icon.classList.toggle("visible");
        icon.classList.toggle("hidden");
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="Risitify-overly-bg"></div>
      <header className={`header-section v2 v5 ${isSticky ? "header-sticky" : ""}`}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <nav className="navbar navbar-expand-lg">
                <div className="container header-navbar-container">
                  <Link className="navbar-brand header-logo" to="/">
                    <img src="/logo.png" alt="Risitify Logo" width="138" />
                  </Link>

                  <button 
                    id="nav-expander" 
                    className="nav-expander bar"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle mobile menu"
                  >
                    <img src="/icons/menu.svg" alt="menu" className={isMobileMenuOpen ? "hidden" : "visible"} />
                    <img src="/icons/menu-close.svg" alt="close menu" className={isMobileMenuOpen ? "visible" : "hidden"} />
                  </button>

                  <div className="header-navbar-content" id="navbarSupportedContent">
                    <ul className="navbar-nav main-menu">
                      <li className="nav-item">
                        <Link
                          className="nav-link"
                          to="/"
                          onClick={() => scrollToSection("hero")}
                        >
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
                        <Link
                          className="nav-link"
                          to="/"
                          onClick={() => scrollToSection("footer")}
                        >
                          Contact
                        </Link>
                      </li>
                    </ul>
                    <ul className="header-extra">
                      {user ? (
                        <li>
                          <Link to="/dashboard" className="dashboard-link">
                            Dashboard
                          </Link>
                        </li>
                      ) : (
                        <>
                          <li>
                            <Link to="/sign-in" className="sign-in-link">
                              Sign In
                            </Link>
                          </li>
                          <li>
                            <Link to="/sign-up" className="bg-pink-btn">
                              <span className="btn-inner">
                                <span className="btn-normal-text">Sign Up</span>
                                <span className="btn-hover-text">Sign Up</span>
                              </span>
                            </Link>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <nav
        className={`right_menu_togle mobile-navbar-menu header-3-canva ${isMobileMenuOpen ? "canvas-open" : ""}`}
        id="mobile-navbar-menu"
      >
        <ul className="nav-menu">
          <li className="current-menu-item">
            <Link to="/" onClick={() => scrollToSection("hero")}>
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
            <Link to="/" onClick={() => scrollToSection("footer")}>
              Contact
            </Link>
          </li>
        </ul>
        <ul className="nav-buttons">
          {user ? (
            <li>
              <Link
                to="/dashboard"
                className="bg-blue-btn"
                onClick={closeMobileMenu}
              >
                <span className="btn-inner">
                  <span className="btn-normal-text">Dashboard</span>
                  <span className="btn-hover-text">Dashboard</span>
                </span>
              </Link>
            </li>
          ) : (
            <>
              <li>
                <Link to="/sign-in" className="bg-blue-btn sign-in-btn" onClick={closeMobileMenu}>
                  <span className="btn-inner">
                    <span className="btn-normal-text">Sign in</span>
                    <span className="btn-hover-text">Sign in</span>
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/sign-up" className="bg-pink-btn" onClick={closeMobileMenu}>
                  <span className="btn-inner">
                    <span className="btn-normal-text">Sign up</span>
                    <span className="btn-hover-text">Sign up</span>
                  </span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </>
  );
};

export default Header;
