
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/Logo";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Using Supabase for login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        setError(error.message);
        return;
      }
      
      if (data?.user) {
        toast.success("Successfully logged in!");
        navigate("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center p-6 sm:p-12">
        <div className="mx-auto w-full max-w-md">
          <div className="flex flex-col space-y-6">
            <Link to="/" className="flex items-center justify-center sm:justify-start mb-6">
              <Logo size="lg" />
            </Link>
            
            <div>
              <h1 className="text-3xl font-bold">Welcome back</h1>
              <p className="text-muted-foreground mt-1">
                Sign in to your account to continue
              </p>
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link 
                    to="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Remember me for 30 days
                </Label>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                <span className="ti ti-brand-google-filled mr-2"></span>
                Google
              </Button>
              <Button variant="outline" className="w-full">
                <span className="ti ti-brand-apple mr-2"></span>
                Apple
              </Button>
            </div>
            
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/sign-up" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Right side - Image */}
      <div className="hidden sm:block flex-1 bg-[#171f38]">
        <div className="h-full flex items-center justify-center p-8">
          <div className="max-w-md text-white">
            <div className="text-center sm:text-left mb-4">
              <div className="inline-block bg-orange-500/20 py-1 px-3 rounded-full text-orange-400 text-sm font-medium mb-2">TESTIMONIAL</div>
              <h2 className="text-2xl font-bold">Streamlined my entire invoicing process</h2>
            </div>
            <blockquote className="text-lg italic mb-4">
              "Risitify has completely transformed how I manage my freelance business. Creating invoices is now quick and painless, and I get paid faster than ever before."
            </blockquote>
            <div className="flex items-center">
              <div className="mr-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <span className="font-medium text-orange-400">JS</span>
                </div>
              </div>
              <div>
                <p className="font-medium">Jamie Smith</p>
                <p className="text-sm text-white/60">Freelance Designer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
