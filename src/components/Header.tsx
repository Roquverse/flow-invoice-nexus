import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { Menu, X } from "lucide-react";
import "@/styles/header.css";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Successfully logged out!");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle scroll event to change header style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`header-section ${isScrolled ? "header-sticky" : ""}`}
      style={{ padding: "0 30px" }}
    >
      <div className="header-navbar-container">
        {/* Logo - always visible */}
        <div className="header-logo">
          <Link to="/">
            <img src="/logo.png" alt="Risitify" />
          </Link>
        </div>
        {/* Mobile menu button - always visible on mobile */}
        <div className="nav-expander bar" onClick={toggleMenu}>
          {isMenuOpen ? (
            <X size={24} color="#004e25" />
          ) : (
            <Menu size={24} color="#004e25" />
          )}
        </div>
        <div className="header-navbar-content">
          {/* Navigation for desktop */}
          <nav className="navbar-nav">
            <ul className="nav-menu">
              <li>
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/features" className="nav-link">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="nav-link">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/contact" className="nav-link">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* Auth buttons */}
          <div className="header-buttons">
            {currentUser ? (
              <>
                <Link to="/dashboard" className="dashboard-link">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="sign-in-link">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/sign-in" className="sign-in-link">
                  Sign In
                </Link>
                <Link to="/sign-up" className="bg-pink-btn">
                  <span className="btn-inner">
                    <span className="btn-normal-text">Sign Up</span>
                    <span className="btn-hover-text">Get Started</span>
                  </span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`mobile-navbar-menu ${isMenuOpen ? "canvas-open" : ""}`}>
        {/* Close button for mobile menu */}
        <button
          className="mobile-menu-close"
          onClick={toggleMenu}
          aria-label="Close menu"
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            background: "none",
            border: "none",
            zIndex: 10001,
          }}
        >
          <X size={28} color="#004e25" />
        </button>
        <nav className="nav-menu">
          <ul>
            <li>
              <Link to="/" onClick={toggleMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/features" onClick={toggleMenu}>
                Features
              </Link>
            </li>
            <li>
              <Link to="/pricing" onClick={toggleMenu}>
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={toggleMenu}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        <div className="nav-buttons">
          {currentUser ? (
            <>
              <Link
                to="/dashboard"
                onClick={toggleMenu}
                className="mobile-nav-link"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="mobile-nav-link"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/sign-in"
                onClick={toggleMenu}
                className="mobile-nav-link"
              >
                Sign In
              </Link>
              <Link
                to="/sign-up"
                onClick={toggleMenu}
                className="mobile-nav-link sign-up"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
