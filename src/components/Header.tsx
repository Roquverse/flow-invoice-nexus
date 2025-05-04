import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="Risitify-overly-bg"></div>
      {/* Header section start */}
      <header className="header-section v2 v5">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <nav className="navbar navbar-expand-lg">
                <div className="container header-navbar-container">
                  <Link className="navbar-brand header-logo" to="/">
                    <img src="/logo.png" alt="header-logo" width="138" />
                  </Link>

                  <button id="nav-expander" className="nav-expander bar">
                    <img src="/icons/menu.svg" alt="menu" />
                    <img src="/icons/menu-close.svg" alt="menu" />
                  </button>

                  <div
                    className="collapse navbar-collapse header-navbar-content"
                    id="navbarSupportedContent"
                  >
                    <ul className="navbar-nav main-menu">
                      <li className="nav-item home-nav">
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
                      <li>
                        <Link to="/sign-in">Sign in</Link>
                      </li>
                      <li>
                        <Link to="/sign-up" className="bg-pink-btn">
                          <span className="btn-inner">
                            <span className="btn-normal-text">Sign Up</span>
                            <span className="btn-hover-text">Sign Up</span>
                          </span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>
      {/* <!-- Header section end -->

    <!-- Canvas Mobile Menu start --> */}
      <nav
        className="right_menu_togle mobile-navbar-menu header-3-canva"
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
          <li>
            <Link
              to="/"
              onClick={() => scrollToSection("footer")}
              className="bg-blue-btn"
            >
              <span className="btn-inner">
                <span className="btn-normal-text">Let's talk</span>
                <span className="btn-hover-text">Let's talk</span>
              </span>
            </Link>
          </li>

          <li>
            <Link to="/sign-in" className="bg-blue-btn sign-in-btn">
              <span className="btn-inner">
                <span className="btn-normal-text">Sign in</span>
                <span className="btn-hover-text">Sign in</span>
              </span>
            </Link>
          </li>
        </ul>
      </nav>
      {/* Canvas Menu end */}
    </>
  );
};

export default Header;
