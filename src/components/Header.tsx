
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { Menu, X } from "lucide-react";

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
      className={`header-section ${
        isScrolled ? "header-sticky" : ""
      } py-4 bg-white shadow-sm fixed top-0 left-0 w-full z-40`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="logo">
            <Link to="/">
              <img src="/logo.png" alt="Risitify" className="h-10" />
            </Link>
          </div>

          {/* Navigation for desktop */}
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li>
                <Link to="/" className="nav-link text-gray-700 hover:text-[#4CAF50]">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/features" className="nav-link text-gray-700 hover:text-[#4CAF50]">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="nav-link text-gray-700 hover:text-[#4CAF50]">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/contact" className="nav-link text-gray-700 hover:text-[#4CAF50]">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="nav-link text-gray-700 hover:text-[#4CAF50]">
                  Admin
                </Link>
              </li>
            </ul>
          </nav>

          {/* Auth buttons for desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <>
                <Link
                  to="/dashboard"
                  className="dashboard-link px-3 py-2 text-[#4CAF50] hover:text-[#388E3C]"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="sign-out-button px-3 py-2 bg-[#4CAF50] hover:bg-[#388E3C] text-white rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/sign-in"
                  className="sign-in-link px-3 py-2 text-[#4CAF50] hover:text-[#388E3C]"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="sign-up-button px-3 py-2 bg-[#4CAF50] hover:bg-[#388E3C] text-white rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="p-2 focus:outline-none">
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="nav-link text-gray-700 hover:text-[#4CAF50]"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/features"
                className="nav-link text-gray-700 hover:text-[#4CAF50]"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                to="/pricing"
                className="nav-link text-gray-700 hover:text-[#4CAF50]"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to="/contact"
                className="nav-link text-gray-700 hover:text-[#4CAF50]"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="/admin/login"
                className="nav-link text-gray-700 hover:text-[#4CAF50]"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>

              {currentUser ? (
                <>
                  <Link
                    to="/dashboard"
                    className="py-2 text-[#4CAF50] hover:text-[#388E3C]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="py-2 px-4 bg-[#4CAF50] hover:bg-[#388E3C] text-white rounded-lg transition-colors w-full text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/sign-in"
                    className="py-2 text-[#4CAF50] hover:text-[#388E3C]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/sign-up"
                    className="py-2 px-4 bg-[#4CAF50] hover:bg-[#388E3C] text-white rounded-lg transition-colors block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
