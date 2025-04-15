
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Link } from "react-router-dom";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto flex justify-between items-center h-16 px-4">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/features" className="text-foreground/80 hover:text-foreground transition">Features</Link>
          <Link to="/pricing" className="text-foreground/80 hover:text-foreground transition">Pricing</Link>
          <Link to="/about" className="text-foreground/80 hover:text-foreground transition">About</Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link to="/signup">
            <Button>Sign Up Free</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link to="/features" className="px-4 py-2 hover:bg-muted rounded-md" onClick={() => setIsMenuOpen(false)}>Features</Link>
            <Link to="/pricing" className="px-4 py-2 hover:bg-muted rounded-md" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
            <Link to="/about" className="px-4 py-2 hover:bg-muted rounded-md" onClick={() => setIsMenuOpen(false)}>About</Link>
            <hr className="my-2" />
            <div className="flex flex-col space-y-2">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full">Login</Button>
              </Link>
              <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full">Sign Up Free</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
