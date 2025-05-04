import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Building, CreditCard, Bell, Shield, LogOut } from "lucide-react";

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Tabs
          defaultValue="profile"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <div className="border-b">
            <TabsList className="flex h-auto p-0">
              <TabsTrigger
                value="profile"
                className={`flex items-center px-4 py-3 border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:text-green-600`}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="company"
                className={`flex items-center px-4 py-3 border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:text-green-600`}
              >
                <Building className="mr-2 h-4 w-4" />
                Company
              </TabsTrigger>
              <TabsTrigger
                value="billing"
                className={`flex items-center px-4 py-3 border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:text-green-600`}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className={`flex items-center px-4 py-3 border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:text-green-600`}
              >
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className={`flex items-center px-4 py-3 border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:text-green-600`}
              >
                <Shield className="mr-2 h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="profile" className="mt-0">
              <div className="space-y-6">
                <div className="border-b pb-6">
                  <h3 className="text-lg font-medium mb-4">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue="john.doe@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" defaultValue="+1 (555) 123-4567" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div></div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    Save Changes
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="company" className="mt-0">
              <div className="space-y-6">
                <div className="border-b pb-6">
                  <h3 className="text-lg font-medium mb-4">
                    Company Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input id="companyName" defaultValue="Acme Inc." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Input id="industry" defaultValue="Technology" />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" defaultValue="123 Business Street" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" defaultValue="San Francisco" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input id="postalCode" defaultValue="94103" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" defaultValue="United States" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxId">Tax ID / VAT Number</Label>
                      <Input id="taxId" defaultValue="US123456789" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    Save Changes
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="billing" className="mt-0">
              <div className="space-y-6">
                <div className="border-b pb-6">
                  <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
                  <div className="p-4 border rounded-lg mb-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="bg-blue-500 text-white p-2 rounded mr-3">
                        <CreditCard className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-medium">Visa ending in 4242</div>
                        <div className="text-sm text-gray-500">
                          Expires 12/2025
                        </div>
                      </div>
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                  <Button variant="outline">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Add Payment Method
                  </Button>
                </div>

                <div className="border-b pb-6">
                  <h3 className="text-lg font-medium mb-4">
                    Billing Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="billingName">Name on Invoice</Label>
                      <Input id="billingName" defaultValue="Acme Inc." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billingEmail">Billing Email</Label>
                      <Input
                        id="billingEmail"
                        defaultValue="billing@acme.com"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Subscription Plan
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-semibold">Current Plan: Pro</div>
                      <div className="text-green-600 font-medium">
                        $29.99/month
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                      Your plan renews on November 15, 2023
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">
                        Change Plan
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                      >
                        Cancel Subscription
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    Save Changes
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="mt-0">
              <div className="space-y-6">
                <h3 className="text-lg font-medium mb-4">
                  Notification Preferences
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Invoice Notifications</div>
                      <div className="text-sm text-gray-500">
                        Receive notifications when invoices are paid, overdue,
                        or expire
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Client Activity</div>
                      <div className="text-sm text-gray-500">
                        Get notified when clients view or interact with your
                        documents
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Project Updates</div>
                      <div className="text-sm text-gray-500">
                        Receive notifications about project milestones and
                        deadlines
                      </div>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Marketing & Tips</div>
                      <div className="text-sm text-gray-500">
                        Receive product updates, tips, and marketing
                        communications
                      </div>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <h3 className="text-lg font-medium mb-4">
                    Email Notification Frequency
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="immediate"
                        name="frequency"
                        defaultChecked
                      />
                      <Label htmlFor="immediate">Immediately</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="daily" name="frequency" />
                      <Label htmlFor="daily">Daily digest</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="weekly" name="frequency" />
                      <Label htmlFor="weekly">Weekly digest</Label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    Save Changes
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="mt-0">
              <div className="space-y-6">
                <div className="border-b pb-6">
                  <h3 className="text-lg font-medium mb-4">
                    Two-Factor Authentication
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">
                        Enable Two-Factor Authentication
                      </div>
                      <div className="text-sm text-gray-500">
                        Add an extra layer of security to your account
                      </div>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="border-b pb-6">
                  <h3 className="text-lg font-medium mb-4">Sessions</h3>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg flex justify-between items-center">
                      <div>
                        <div className="font-medium">Current Session</div>
                        <div className="text-sm text-gray-500">
                          Mac OS • Chrome • San Francisco, CA
                        </div>
                      </div>
                      <div className="text-green-600 text-sm font-medium">
                        Active Now
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg flex justify-between items-center">
                      <div>
                        <div className="font-medium">Previous Session</div>
                        <div className="text-sm text-gray-500">
                          Windows • Firefox • San Francisco, CA
                        </div>
                      </div>
                      <div className="text-gray-500 text-sm">3 days ago</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Advanced</h3>
                  <Button
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out of All Devices
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;
