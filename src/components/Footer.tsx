
import { Logo } from "@/components/Logo";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground">
              Simplifying invoicing for freelancers, small businesses and agencies.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/features" className="text-sm text-muted-foreground hover:text-foreground">Features</Link></li>
              <li><Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link></li>
              <li><Link to="/testimonials" className="text-sm text-muted-foreground hover:text-foreground">Testimonials</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-sm text-muted-foreground hover:text-foreground">Help Center</Link></li>
              <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground">Blog</Link></li>
              <li><Link to="/guides" className="text-sm text-muted-foreground hover:text-foreground">Guides</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">About Us</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link></li>
              <li><Link to="/legal" className="text-sm text-muted-foreground hover:text-foreground">Legal</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} FlowInvoice. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
