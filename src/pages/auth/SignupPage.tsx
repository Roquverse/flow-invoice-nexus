
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name
          }
        }
      });
      
      if (error) {
        setError(error.message);
        return;
      }
      
      if (data?.user) {
        toast.success("Account created successfully!");
        setSuccess(true);
        // In production, you'll navigate right to dashboard if email verification is disabled
        // navigate("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="mt-3 text-2xl font-bold">Account created!</h1>
            <p className="mt-2 text-muted-foreground">
              Your account has been successfully created. You can now log in.
            </p>
            <div className="mt-6">
              <Link to="/login">
                <Button className="w-full">Continue to Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <h1 className="text-3xl font-bold">Create an account</h1>
              <p className="text-muted-foreground mt-1">
                Start your 14-day free trial, no credit card required
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
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters long
                </p>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                By creating an account, you agree to our{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </p>
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
              <Button variant="outline" className="w-full">Google</Button>
              <Button variant="outline" className="w-full">Apple</Button>
            </div>
            
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Right side - Benefits */}
      <div className="hidden sm:flex flex-1 bg-[#171f38] items-center justify-center p-8">
        <div className="max-w-md text-white">
          <h2 className="text-2xl font-bold mb-6">Everything you need to run your business</h2>
          
          <ul className="space-y-4">
            <li className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-orange-400" />
                </div>
              </div>
              <div>
                <p className="font-medium">Professional Invoices</p>
                <p className="text-white/70 text-sm">Create and send branded invoices in seconds</p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-orange-400" />
                </div>
              </div>
              <div>
                <p className="font-medium">Online Payments</p>
                <p className="text-white/70 text-sm">Get paid faster with credit cards and bank transfers</p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-orange-400" />
                </div>
              </div>
              <div>
                <p className="font-medium">Expense Tracking</p>
                <p className="text-white/70 text-sm">Keep track of all your business expenses in one place</p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-orange-400" />
                </div>
              </div>
              <div>
                <p className="font-medium">Detailed Reporting</p>
                <p className="text-white/70 text-sm">Get insights into your business with powerful reports</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
