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
      className="h-16 flex items-center fixed top-0 left-0 w-full z-50"
      style={{ backgroundColor: "transparent", boxShadow: "none" }}
    >
      <div className="max-w-6xl mx-auto w-full flex justify-between items-center px-4">
        {/* Logo */}
        <div className="logo flex items-center h-12">
          <Link to="/">
            <img src="/logo.png" alt="Risitify" className="h-10 w-auto" />
          </Link>
        </div>
        {/* Navigation for desktop */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6 text-lg font-medium">
            <li>
              <Link
                to="/"
                className="nav-link text-gray-700 hover:text-[#4CAF50]"
                style={{ fontSize: "14px" }}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/features"
                className="nav-link text-gray-700 hover:text-[#4CAF50]"
                style={{ fontSize: "14px" }}
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                to="/pricing"
                className="nav-link text-gray-700 hover:text-[#4CAF50]"
                style={{ fontSize: "14px" }}
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="nav-link text-gray-700 hover:text-[#4CAF50]"
                style={{ fontSize: "14px" }}
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        {/* Auth buttons for desktop */}
        <div className="flex items-center space-x-4">
          <Link to="/sign-in">
            <button className="text-gray-700 hover:text-[#4CAF50] text-lg font-medium">
              Sign In
            </button>
          </Link>
          <Link to="/sign-up">
            <button className="bg-[#4CAF50] hover:bg-[#388e3c] text-white rounded px-5 py-2 text-lg font-medium transition">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
