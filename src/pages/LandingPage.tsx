
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, CreditCard, Globe, BarChart3, Clock, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="gradient-text">Simplify invoicing,</span><br />
              get paid faster.
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
              The modern invoicing platform for freelancers, small businesses, and agencies. 
              Create professional invoices in minutes.
            </p>
            <div className="flex gap-4 mt-10">
              <Link to="/signup">
                <Button size="lg" className="h-12 px-6">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/features">
                <Button size="lg" variant="outline" className="h-12 px-6">
                  See Features
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="mt-16 rounded-lg shadow-xl overflow-hidden border">
            <img 
              src={`https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200`}
              alt="FlowInvoice Dashboard"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to manage your finances</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features to help you create, send, and track invoices with ease.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={CreditCard}
              title="Get Paid Online"
              description="Accept payments directly from your invoices with Stripe, PayPal, and more."
            />
            <FeatureCard 
              icon={Globe}
              title="Multi-Currency Support"
              description="Create invoices in any currency and manage international clients with ease."
            />
            <FeatureCard 
              icon={Clock}
              title="Automated Reminders"
              description="Send automatic payment reminders to clients for overdue invoices."
            />
            <FeatureCard 
              icon={BarChart3}
              title="Detailed Reporting"
              description="Gain insights with comprehensive reports on revenue, expenses, and taxes."
            />
            <FeatureCard 
              icon={CalendarClock}
              title="Scheduled Invoices"
              description="Schedule recurring invoices for regular clients and get paid automatically."
            />
            <FeatureCard 
              icon={CheckCircle}
              title="Client Portal"
              description="Give clients access to their invoices, quotes, and payment history."
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 gradient-bg">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to streamline your invoicing?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join thousands of businesses that trust FlowInvoice for their invoicing needs.
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="h-12 px-6">
              Sign Up for Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { 
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
          <Icon className="text-primary h-6 w-6" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
