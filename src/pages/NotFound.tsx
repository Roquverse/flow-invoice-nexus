
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold gradient-text">404</h1>
        <h2 className="text-3xl font-bold mt-4">Page not found</h2>
        <p className="mt-4 text-muted-foreground max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <div className="mt-8">
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
