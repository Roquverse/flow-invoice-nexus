
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, FileText, Clock, BarChart3, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#010217]">
      {/* Header/Navbar */}
      <header className="py-6 px-4 md:px-8">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-orange-500 p-1.5 rounded mr-2">
              <FileText className="text-white" size={24} />
            </div>
            <span className="font-bold text-2xl text-white">Invoicing</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="#features" className="text-white/80 hover:text-white transition">Features</Link>
            <Link to="#pricing" className="text-white/80 hover:text-white transition">Pricing</Link>
            <Link to="#company" className="text-white/80 hover:text-white transition">Company</Link>
            <Link to="#resources" className="text-white/80 hover:text-white transition">Resources</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" className="text-white">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">Sign up for free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center">
          <div className="flex-1 mb-12 md:mb-0 md:pr-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Solving all<br />
              your <span className="text-orange-500">Invoicing</span><br />
              problems here
            </h1>
            <p className="text-white/80 text-lg mb-8 max-w-lg">
              A simple payment process helps you get paid on time.
              Provide multiple payment options that your customers can
              choose from to make their payments securely.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 h-auto text-lg">
                  Sign up for free
                </Button>
              </Link>
              <Button variant="outline" className="text-white border-white/20 px-8 py-6 h-auto text-lg">
                Watch the video
              </Button>
            </div>
            
            <p className="text-white/60 mt-6 text-sm">No credit card required • All premium features for free 14 days</p>
          </div>
          
          {/* Invoice Preview */}
          <div className="flex-1">
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto rotate-2 transform">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-semibold">Invoice from figma</h3>
                  <div className="text-3xl font-bold text-orange-500 mt-1">$189.89</div>
                  <p className="text-sm text-gray-500 mt-1">Due on Feb 23, 2023</p>
                </div>
                <div className="text-gray-400">
                  <FileText size={40} />
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="h-3 bg-gray-200 rounded-full w-full"></div>
                <div className="h-3 bg-gray-200 rounded-full w-4/5"></div>
                <div className="h-3 bg-gray-200 rounded-full w-11/12"></div>
              </div>
              
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600">Pay Now</Button>
              
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-3">Payment Methods</p>
                <div className="flex gap-4">
                  <div className="p-2 border rounded">PayPal</div>
                  <div className="p-2 border rounded">Visa</div>
                  <div className="p-2 border rounded">Card</div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white">
                  <ArrowRight size={16} />
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-white">
                  <FileText size={16} />
                </div>
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white">
                  <CreditCard size={16} />
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                  <CheckCircle size={16} />
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white">
                  <BarChart3 size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Track Time & Expenses Section */}
      <section className="py-16 px-4 bg-[#faf7f0]">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Track your time & calculate the expenses
              </h2>
              <p className="text-gray-600 mb-8">
                Enjoy a fully-featured suite customizable business reports and dashboards so you always know where business stands.
              </p>
              <Link to="/signup">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  Get started for free
                </Button>
              </Link>
            </div>
            <div>
              <img 
                src="/lovable-uploads/ced2da82-0b52-41bd-8b72-4c15b66b7f64.png"
                alt="Dashboard Analytics"
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* All-in-one Platform */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">All-in-one invoice platform</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track your entire project from start to finish with beautiful views that make
            project planning a breeze manage your resources.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <Card className="border border-gray-200">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="bg-indigo-100 p-3 rounded-lg mb-4">
                <FileText className="text-indigo-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Beautiful Invoices</h3>
              <p className="text-gray-500 text-sm">Customize and send professional invoices in seconds</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="bg-orange-100 p-3 rounded-lg mb-4">
                <CreditCard className="text-orange-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Get Paid Faster</h3>
              <p className="text-gray-500 text-sm">Accept online payments and automate reminders</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="bg-emerald-100 p-3 rounded-lg mb-4">
                <Clock className="text-emerald-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Time Tracking</h3>
              <p className="text-gray-500 text-sm">Track time and automatically bill your clients</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-lg mb-4">
                <BarChart3 className="text-blue-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Powerful Reports</h3>
              <p className="text-gray-500 text-sm">Get insights on your business performance</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Link to="/features">
            <Button variant="outline" className="border-gray-300">
              View All Features <ArrowRight className="ml-2" size={16} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-[#faf7f0]">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold mb-12 text-center">What our clients say</h2>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400" alt="Client" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Yannick Jollet</h4>
                <p className="text-gray-500 text-sm">Co-founder</p>
                <div className="mt-4">
                  <p className="text-gray-700">
                    "As a freelancer, I really love this platform. We used to be extremely disorganized with our Financing, it's now perfect. I have always been looking for something similar, and this is just what I needed. Would definitely recommend it!"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="py-16 px-4 bg-white border-t">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap justify-center gap-12 md:gap-16">
            <div className="opacity-70 hover:opacity-100 transition">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Coinbase_logo_2018.svg/2560px-Coinbase_logo_2018.svg.png" alt="Coinbase" className="h-8" />
            </div>
            <div className="opacity-70 hover:opacity-100 transition">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Slack_Technologies_Logo.svg/2560px-Slack_Technologies_Logo.svg.png" alt="Slack" className="h-8" />
            </div>
            <div className="opacity-70 hover:opacity-100 transition">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Dropbox_Icon.svg/2202px-Dropbox_Icon.svg.png" alt="Dropbox" className="h-8" />
            </div>
            <div className="opacity-70 hover:opacity-100 transition">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Webflow_logo.svg/2560px-Webflow_logo.svg.png" alt="Webflow" className="h-8" />
            </div>
            <div className="opacity-70 hover:opacity-100 transition">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Zoom_Logo_2022.svg/2560px-Zoom_Logo_2022.svg.png" alt="Zoom" className="h-8" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#010217] text-white py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-orange-500 p-1 rounded mr-2">
                  <FileText className="text-white" size={20} />
                </div>
                <span className="font-bold text-xl">Invoicing</span>
              </div>
              <p className="text-sm text-white/60 mb-4">
                With an invoicing website, users can easily generate professional invoicing invoices, track payments, and send reminders to keep on top of your clients.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-white/60 hover:text-white text-sm">About Us</Link></li>
                <li><Link to="/careers" className="text-white/60 hover:text-white text-sm">Careers</Link></li>
                <li><Link to="/blog" className="text-white/60 hover:text-white text-sm">Blog</Link></li>
                <li><Link to="/press" className="text-white/60 hover:text-white text-sm">Press</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link to="/features" className="text-white/60 hover:text-white text-sm">Features</Link></li>
                <li><Link to="/pricing" className="text-white/60 hover:text-white text-sm">Pricing</Link></li>
                <li><Link to="/security" className="text-white/60 hover:text-white text-sm">Security</Link></li>
                <li><Link to="/enterprise" className="text-white/60 hover:text-white text-sm">Enterprise</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link to="/help" className="text-white/60 hover:text-white text-sm">Help Center</Link></li>
                <li><Link to="/api" className="text-white/60 hover:text-white text-sm">API Documentation</Link></li>
                <li><Link to="/community" className="text-white/60 hover:text-white text-sm">Community</Link></li>
                <li><Link to="/contact" className="text-white/60 hover:text-white text-sm">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-white/60">
              &copy; {new Date().getFullYear()} Invoicing. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/terms" className="text-sm text-white/60 hover:text-white">Terms</Link>
              <Link to="/privacy" className="text-sm text-white/60 hover:text-white">Privacy</Link>
              <Link to="/cookies" className="text-sm text-white/60 hover:text-white">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
