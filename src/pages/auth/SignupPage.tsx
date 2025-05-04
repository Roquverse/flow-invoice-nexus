import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/Logo";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  Eye,
  EyeOff,
  Mail,
  Check,
  UserRound,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import "../../styles/auth-pages.css";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToTerms) {
      setError("You must agree to the terms and conditions");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Using Supabase for signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data?.user) {
        toast.success(
          "Account created successfully! Please check your email to verify your account."
        );
        navigate("/sign-in");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left side - Form */}
      <div className="auth-form-side">
        <div className="auth-form-container">
          <div className="auth-logo">
            <Logo size="lg" />
          </div>

          <div className="auth-heading">
            <h1>Create an account</h1>
            <p>Enter your information to get started</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <Button
              variant="outline"
              className="w-full bg-white flex items-center justify-center border border-gray-200 hover:bg-gray-50 h-[45px]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 24 24"
                fill="#4285F4"
              >
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign up with Google
            </Button>

            <div className="auth-separator my-4">
              <span>Or sign up with email</span>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <Label
                  htmlFor="fullName"
                  className="text-gray-700 text-sm font-medium"
                >
                  Full Name
                </Label>
                <div className="input-with-icon">
                  <UserRound className="input-icon" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Smith"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="input-field"
                  />
                </div>
              </div>

              <div className="form-group">
                <Label
                  htmlFor="email"
                  className="text-gray-700 text-sm font-medium"
                >
                  Email
                </Label>
                <div className="input-with-icon">
                  <Mail className="input-icon" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input-field"
                  />
                </div>
              </div>

              <div className="form-group">
                <Label
                  htmlFor="password"
                  className="text-gray-700 text-sm font-medium"
                >
                  Password
                </Label>
                <div className="input-with-icon">
                  <Lock className="input-icon" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-field"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 8 characters long
                </p>
              </div>

              <div className="form-checkbox">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) =>
                    setAgreedToTerms(checked as boolean)
                  }
                  className="text-[#4CAF50] border-gray-300"
                />
                <Label
                  htmlFor="terms"
                  className="text-xs font-normal ml-2 text-gray-600"
                >
                  I agree to the{" "}
                  <Link to="/terms" className="text-[#4CAF50] hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-[#4CAF50] hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full btn-auth-risitify"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </div>

          <div className="auth-footer">
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className="text-[#4CAF50] hover:underline font-medium"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Content */}
      <div className="auth-content-side">
        <div className="testimonial-container">
          <div className="testimonial-badge">FEATURES</div>
          <h2 className="testimonial-heading">
            Everything you need to manage your business
          </h2>

          <div className="features-list">
            <ul>
              <li>
                <div className="feature-icon">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span>Professional invoice creation and management</span>
              </li>
              <li>
                <div className="feature-icon">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span>Client portal for easier communication</span>
              </li>
              <li>
                <div className="feature-icon">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span>Financial analytics and reporting tools</span>
              </li>
              <li>
                <div className="feature-icon">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span>Secure payment processing integration</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
