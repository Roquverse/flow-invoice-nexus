
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Camera, Check, Loader2, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import { useCompanySettings } from "@/hooks/useCompanySettings";
import { useBillingSettings } from "@/hooks/useBillingSettings";
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NotificationPreferences } from "@/types/settings";

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { profile, updateProfile, loading: profileLoading } = useProfileSettings();
  const { companySettings, updateCompanySettings, loading: companyLoading } = useCompanySettings();
  const { billingSettings, updateBillingSettings, paymentMethods, addPaymentMethod, deletePaymentMethod, loading: billingLoading } = useBillingSettings();
  const { notificationPreferences, updateNotificationPreferences, loading: notificationLoading } = useNotificationPreferences();

  const [profileForm, setProfileForm] = useState({
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
  });

  const [companyForm, setCompanyForm] = useState({
    company_name: companySettings?.company_name || "",
    industry: companySettings?.industry || "",
    address: companySettings?.address || "",
    city: companySettings?.city || "",
    postal_code: companySettings?.postal_code || "",
    country: companySettings?.country || "",
    tax_id: companySettings?.tax_id || "",
    logo_url: companySettings?.logo_url || "",
  });

  const [billingForm, setBillingForm] = useState({
    billing_name: billingSettings?.billing_name || "",
    billing_email: billingSettings?.billing_email || "",
  });

  const [newPaymentMethod, setNewPaymentMethod] = useState({
    payment_type: "credit_card",
    provider: "visa",
    last_four: "",
  });

  // Ensure notificationForm.email_frequency is always a valid type
  // Fix the 'string' to '"immediate" | "daily" | "weekly"' error
  type EmailFrequency = "immediate" | "daily" | "weekly";
  
  const [notificationForm, setNotificationForm] = useState({
    invoice_notifications: notificationPreferences?.invoice_notifications || false,
    client_activity: notificationPreferences?.client_activity || false,
    project_updates: notificationPreferences?.project_updates || false,
    marketing_tips: notificationPreferences?.marketing_tips || false,
    email_frequency: (notificationPreferences?.email_frequency || "immediate") as EmailFrequency,
  });

  const [uploading, setUploading] = useState(false);

  // Update states when data loads
  React.useEffect(() => {
    if (profile) {
      setProfileForm({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  React.useEffect(() => {
    if (companySettings) {
      setCompanyForm({
        company_name: companySettings.company_name || "",
        industry: companySettings.industry || "",
        address: companySettings.address || "",
        city: companySettings.city || "",
        postal_code: companySettings.postal_code || "",
        country: companySettings.country || "",
        tax_id: companySettings.tax_id || "",
        logo_url: companySettings.logo_url || "",
      });
    }
  }, [companySettings]);

  React.useEffect(() => {
    if (billingSettings) {
      setBillingForm({
        billing_name: billingSettings.billing_name || "",
        billing_email: billingSettings.billing_email || "",
      });
    }
  }, [billingSettings]);

  React.useEffect(() => {
    if (notificationPreferences) {
      setNotificationForm({
        invoice_notifications: notificationPreferences.invoice_notifications || false,
        client_activity: notificationPreferences.client_activity || false,
        project_updates: notificationPreferences.project_updates || false,
        marketing_tips: notificationPreferences.marketing_tips || false,
        // Make sure to cast to the exact type
        email_frequency: (notificationPreferences.email_frequency || "immediate") as EmailFrequency,
      });
    }
  }, [notificationPreferences]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(profileForm);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Error updating profile");
      console.error(error);
    }
  };

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCompanySettings(companyForm);
      toast.success("Company settings updated successfully");
    } catch (error) {
      toast.error("Error updating company settings");
      console.error(error);
    }
  };

  const handleBillingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateBillingSettings(billingForm);
      toast.success("Billing information updated successfully");
    } catch (error) {
      toast.error("Error updating billing information");
      console.error(error);
    }
  };

  const handleAddPaymentMethod = async () => {
    try {
      const success = await addPaymentMethod(newPaymentMethod);
      if (success) {
        toast.success("Payment method added successfully");
        setNewPaymentMethod({
          payment_type: "credit_card",
          provider: "visa",
          last_four: "",
        });
      } else {
        toast.error("Error adding payment method");
      }
    } catch (error) {
      toast.error("Error adding payment method");
      console.error(error);
    }
  };

  const handleDeletePaymentMethod = async (id: string) => {
    try {
      const success = await deletePaymentMethod(id);
      if (success) {
        toast.success("Payment method removed successfully");
      } else {
        toast.error("Error removing payment method");
      }
    } catch (error) {
      toast.error("Error removing payment method");
      console.error(error);
    }
  };

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateNotificationPreferences(notificationForm as Partial<NotificationPreferences>);
      toast.success("Notification preferences updated successfully");
    } catch (error) {
      toast.error("Error updating notification preferences");
      console.error(error);
    }
  };

  const handleLogoUpload = () => {
    // This is a placeholder for an upload functionality
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setCompanyForm({
        ...companyForm,
        logo_url: "https://via.placeholder.com/150",
      });
      toast.success("Logo uploaded successfully");
    }, 1500);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const isLoading = profileLoading || companyLoading || billingLoading || notificationLoading;

  return (
    <div className="container max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="sr-only">Loading...</span>
          </div>
        )}

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit}>
                <div className="flex flex-col md:flex-row gap-8 mb-6">
                  <div className="flex justify-center">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile?.avatar_url || ""} />
                      <AvatarFallback>
                        {getInitials(profileForm.first_name, profileForm.last_name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="space-y-4 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input
                          id="first-name"
                          value={profileForm.first_name}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, first_name: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input
                          id="last-name"
                          value={profileForm.last_name}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, last_name: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          disabled
                          value={profileForm.email}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={profileForm.phone}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, phone: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={profileLoading}>
                    {profileLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Update your company details for invoices and communications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCompanySubmit}>
                <div className="grid gap-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-4">
                      <div className="flex flex-col md:flex-row gap-6 items-start">
                        {companyForm.logo_url ? (
                          <div className="relative">
                            <img
                              src={companyForm.logo_url}
                              alt="Company Logo"
                              className="h-24 w-auto rounded border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                              onClick={() =>
                                setCompanyForm({ ...companyForm, logo_url: "" })
                              }
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            className="w-32 h-24 flex flex-col gap-1"
                            onClick={handleLogoUpload}
                            disabled={uploading}
                          >
                            {uploading ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <Camera className="h-5 w-5" />
                            )}
                            <span>Upload Logo</span>
                          </Button>
                        )}
                        <div className="space-y-4 flex-1">
                          <div className="space-y-2">
                            <Label htmlFor="company-name">Company Name</Label>
                            <Input
                              id="company-name"
                              value={companyForm.company_name}
                              onChange={(e) =>
                                setCompanyForm({
                                  ...companyForm,
                                  company_name: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="industry">Industry</Label>
                            <Input
                              id="industry"
                              value={companyForm.industry}
                              onChange={(e) =>
                                setCompanyForm({
                                  ...companyForm,
                                  industry: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={companyForm.address}
                        onChange={(e) =>
                          setCompanyForm({ ...companyForm, address: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={companyForm.city}
                        onChange={(e) =>
                          setCompanyForm({ ...companyForm, city: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postal-code">Postal Code</Label>
                      <Input
                        id="postal-code"
                        value={companyForm.postal_code}
                        onChange={(e) =>
                          setCompanyForm({
                            ...companyForm,
                            postal_code: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={companyForm.country}
                        onChange={(e) =>
                          setCompanyForm({ ...companyForm, country: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="tax-id">Tax ID / VAT Number</Label>
                      <Input
                        id="tax-id"
                        value={companyForm.tax_id}
                        onChange={(e) =>
                          setCompanyForm({ ...companyForm, tax_id: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <Button type="submit" disabled={companyLoading}>
                    {companyLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    Save Company Details
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>
                Update your billing details and payment information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBillingSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="billing-name">Billing Name</Label>
                    <Input
                      id="billing-name"
                      value={billingForm.billing_name}
                      onChange={(e) =>
                        setBillingForm({
                          ...billingForm,
                          billing_name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billing-email">Billing Email</Label>
                    <Input
                      id="billing-email"
                      type="email"
                      value={billingForm.billing_email}
                      onChange={(e) =>
                        setBillingForm({
                          ...billingForm,
                          billing_email: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={billingLoading}>
                    {billingLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    Save Billing Information
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Add or remove payment methods for your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Your Payment Methods</h3>
                  {paymentMethods.length === 0 ? (
                    <Alert>
                      <AlertDescription>
                        You don't have any payment methods added yet.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-4">
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className="flex items-center justify-between p-4 border rounded-md"
                        >
                          <div>
                            <div className="font-medium">
                              {method.provider} •••• {method.last_four}
                            </div>
                            <div className="text-sm text-gray-500">
                              {method.payment_type}
                              {method.expiry_date &&
                                ` • Expires ${new Date(
                                  method.expiry_date
                                ).toLocaleDateString("en-US", {
                                  month: "2-digit",
                                  year: "2-digit",
                                })}`}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeletePaymentMethod(method.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Add New Payment Method</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="payment-type">Payment Type</Label>
                      <Select
                        value={newPaymentMethod.payment_type}
                        onValueChange={(value) =>
                          setNewPaymentMethod({
                            ...newPaymentMethod,
                            payment_type: value,
                          })
                        }
                      >
                        <SelectTrigger id="payment-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="credit_card">Credit Card</SelectItem>
                          <SelectItem value="bank_account">Bank Account</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="provider">Provider</Label>
                      <Select
                        value={newPaymentMethod.provider}
                        onValueChange={(value) =>
                          setNewPaymentMethod({
                            ...newPaymentMethod,
                            provider: value,
                          })
                        }
                      >
                        <SelectTrigger id="provider">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="visa">Visa</SelectItem>
                          <SelectItem value="mastercard">Mastercard</SelectItem>
                          <SelectItem value="amex">American Express</SelectItem>
                          <SelectItem value="discover">Discover</SelectItem>
                          <SelectItem value="bank">Bank Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-four">Last 4 Digits</Label>
                      <Input
                        id="last-four"
                        value={newPaymentMethod.last_four}
                        onChange={(e) =>
                          setNewPaymentMethod({
                            ...newPaymentMethod,
                            last_four: e.target.value,
                          })
                        }
                        maxLength={4}
                        placeholder="1234"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button type="button" onClick={handleAddPaymentMethod}>
                      Add Payment Method
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNotificationSubmit}>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="invoice-notifications" className="font-medium">
                          Invoice Notifications
                        </Label>
                        <p className="text-sm text-gray-500">
                          Get notified when invoices are created, paid, or overdue
                        </p>
                      </div>
                      <Switch
                        id="invoice-notifications"
                        checked={notificationForm.invoice_notifications}
                        onCheckedChange={(checked) =>
                          setNotificationForm({
                            ...notificationForm,
                            invoice_notifications: checked,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="client-activity" className="font-medium">
                          Client Activity
                        </Label>
                        <p className="text-sm text-gray-500">
                          Receive updates when clients view or interact with your quotes or
                          invoices
                        </p>
                      </div>
                      <Switch
                        id="client-activity"
                        checked={notificationForm.client_activity}
                        onCheckedChange={(checked) =>
                          setNotificationForm({
                            ...notificationForm,
                            client_activity: checked,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="project-updates" className="font-medium">
                          Project Updates
                        </Label>
                        <p className="text-sm text-gray-500">
                          Get notified about project milestones and deadlines
                        </p>
                      </div>
                      <Switch
                        id="project-updates"
                        checked={notificationForm.project_updates}
                        onCheckedChange={(checked) =>
                          setNotificationForm({
                            ...notificationForm,
                            project_updates: checked,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="marketing-tips" className="font-medium">
                          Marketing Tips & Product Updates
                        </Label>
                        <p className="text-sm text-gray-500">
                          Receive helpful marketing tips and product update announcements
                        </p>
                      </div>
                      <Switch
                        id="marketing-tips"
                        checked={notificationForm.marketing_tips}
                        onCheckedChange={(checked) =>
                          setNotificationForm({
                            ...notificationForm,
                            marketing_tips: checked,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-frequency" className="font-medium">
                      Email Frequency
                    </Label>
                    <Select
                      value={notificationForm.email_frequency}
                      onValueChange={(value: EmailFrequency) =>
                        setNotificationForm({
                          ...notificationForm,
                          email_frequency: value,
                        })
                      }
                    >
                      <SelectTrigger id="email-frequency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="daily">Daily Digest</SelectItem>
                        <SelectItem value="weekly">Weekly Digest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <Button type="submit" disabled={notificationLoading}>
                    {notificationLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    Save Notification Preferences
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
