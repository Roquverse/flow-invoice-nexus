import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import { useCompanySettings } from "@/hooks/useCompanySettings";
import { useBillingSettings } from "@/hooks/useBillingSettings";
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";
import { useSecuritySettings } from "@/hooks/useSecuritySettings";
import { toast } from "sonner";
import { CreditCard, PlusCircle, Trash2, Calendar, RefreshCcw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import currencies from "@/data/currencies";
import countryList from "@/data/countries";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useSettings } from '@/hooks/useSettings';

// Define type for tabs
type TabType = "profile" | "company" | "billing" | "notifications" | "security";

const SettingsPage: React.FC = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  
  // Hooks for settings
  const {
    profile,
    updateProfile,
    loading: profileLoading,
    error: profileError
  } = useProfileSettings();
  
  const {
    companySettings,
    updateCompanySettings,
    loading: companyLoading,
    error: companyError
  } = useCompanySettings();
  
  const { 
    billingSettings, 
    loading: billingLoading,
    updateBillingSettings,
    error: billingError
  } = useBillingSettings();

  const {
    securitySettings,
    loading: securityLoading,
    error: securityError,
    updateSecuritySettings
  } = useSecuritySettings();
  
  const {
    notificationPreferences,
    loading: notifLoading,
    error: notifError,
    updatePreferences: updateNotificationPreferences
  } = useNotificationPreferences();

  const {
    sessionHistory,
    paymentMethods,
    changePassword,
    addPaymentMethod,
    deletePaymentMethod
  } = useSettings();

  // Form state
  const [profileFormData, setProfileFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    avatar_url: ""
  });
  
  const [companyFormData, setCompanyFormData] = useState({
    company_name: "",
    logo_url: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    phone: "",
    email: "",
    website: "",
    tax_id: "",
    vat_number: "",
    registration_number: "",
    default_currency: "USD",
    default_tax_rate: 0,
    payment_terms: 30,
    payment_instructions: "",
    invoice_prefix: "INV-",
    quote_prefix: "QUO-",
    receipt_prefix: "REC-",
    invoice_notes: "",
    quote_notes: ""
  });

  // Payment method dialog state
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    payment_type: "credit_card",
    provider: "visa",
    last_four: "",
    expiry_date: "",
    is_default: false
  });

  // Password change dialog state
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Security settings state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Notification settings state
  const [invoiceNotifs, setInvoiceNotifs] = useState(true);
  const [clientActivity, setClientActivity] = useState(true);
  const [projectUpdates, setProjectUpdates] = useState(false);
  const [marketingTips, setMarketingTips] = useState(false);
  const [emailFrequency, setEmailFrequency] = useState<"immediate" | "daily" | "weekly">("immediate");

  // Initialize form data when settings are loaded
  useEffect(() => {
    if (profile) {
      setProfileFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        avatar_url: profile.avatar_url || ""
      });
    }
  }, [profile]);

  useEffect(() => {
    if (companySettings) {
      setCompanyFormData({
        company_name: companySettings.company_name || "",
        logo_url: companySettings.logo_url || "",
        address: companySettings.address || "",
        city: companySettings.city || "",
        state: companySettings.state || "",
        postal_code: companySettings.postal_code || "",
        country: companySettings.country || "",
        phone: companySettings.phone || "",
        email: companySettings.email || "",
        website: companySettings.website || "",
        tax_id: companySettings.tax_id || "",
        vat_number: companySettings.vat_number || "",
        registration_number: companySettings.registration_number || "",
        default_currency: companySettings.default_currency || "USD",
        default_tax_rate: companySettings.default_tax_rate || 0,
        payment_terms: companySettings.payment_terms || 30,
        payment_instructions: companySettings.payment_instructions || "",
        invoice_prefix: companySettings.invoice_prefix || "INV-",
        quote_prefix: companySettings.quote_prefix || "QUO-",
        receipt_prefix: companySettings.receipt_prefix || "REC-",
        invoice_notes: companySettings.invoice_notes || "",
        quote_notes: companySettings.quote_notes || ""
      });
    }
  }, [companySettings]);

  useEffect(() => {
    if (notificationPreferences) {
      setInvoiceNotifs(notificationPreferences.invoice_notifications || false);
      setClientActivity(notificationPreferences.client_activity || false);
      setProjectUpdates(notificationPreferences.project_updates || false);
      setMarketingTips(notificationPreferences.marketing_tips || false);
      setEmailFrequency(notificationPreferences.email_frequency || "immediate");
    }
  }, [notificationPreferences]);

  useEffect(() => {
    if (securitySettings) {
      setTwoFactorEnabled(securitySettings.two_factor_enabled || false);
    }
  }, [securitySettings]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(profileFormData);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error);
    }
  };

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCompanySettings({
        ...companyFormData
      });
      toast.success("Company settings updated successfully");
    } catch (error) {
      toast.error("Failed to update company settings");
      console.error("Error updating company settings:", error);
    }
  };

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await updateNotificationPreferences({
        invoice_notifications: invoiceNotifs,
        client_activity: clientActivity,
        project_updates: projectUpdates,
        marketing_tips: marketingTips,
        email_frequency: emailFrequency
      });
      
      if (result) {
        toast.success("Notification preferences updated successfully");
      } else {
        toast.error("Failed to update notification preferences");
      }
    } catch (error) {
      toast.error("Failed to update notification preferences");
      console.error("Error updating notification preferences:", error);
    }
  };

  const handleAddPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await addPaymentMethod(newPaymentMethod);
      if (result) {
        toast.success("Payment method added successfully");
        setPaymentDialogOpen(false);
        setNewPaymentMethod({
          payment_type: "credit_card",
          provider: "visa",
          last_four: "",
          expiry_date: "",
          is_default: false
        });
      } else {
        toast.error("Failed to add payment method");
      }
    } catch (error) {
      toast.error("Failed to add payment method");
      console.error("Error adding payment method:", error);
    }
  };

  const handleDeletePaymentMethod = async (id: string) => {
    try {
      const result = await deletePaymentMethod(id);
      if (result) {
        toast.success("Payment method deleted successfully");
      } else {
        toast.error("Failed to delete payment method");
      }
    } catch (error) {
      toast.error("Failed to delete payment method");
      console.error("Error deleting payment method:", error);
    }
  };

  const handleSaveSecuritySettings = async () => {
    try {
      await updateSecuritySettings({
        two_factor_enabled: twoFactorEnabled
      });
      toast.success("Security settings updated successfully");
    } catch (error) {
      toast.error("Failed to update security settings");
      console.error("Error updating security settings:", error);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }
    
    try {
      const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
      if (result) {
        toast.success("Password changed successfully");
        setPasswordDialogOpen(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      } else {
        toast.error("Failed to change password");
      }
    } catch (error) {
      toast.error("Failed to change password");
      console.error("Error changing password:", error);
    }
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value as TabType);
  };

  return (
    <div className="settings-container">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="profile" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit}>
                <div className="flex items-center mb-8">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profileFormData.avatar_url} alt="Profile" />
                    <AvatarFallback>
                      {`${profileFormData.first_name?.charAt(0) || ''}${profileFormData.last_name?.charAt(0) || ''}`}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <Input
                      id="avatar_url"
                      type="text"
                      placeholder="Avatar URL"
                      value={profileFormData.avatar_url}
                      onChange={(e) => setProfileFormData({ ...profileFormData, avatar_url: e.target.value })}
                      className="mb-2"
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter a URL for your profile image
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={profileFormData.first_name}
                      onChange={(e) => setProfileFormData({ ...profileFormData, first_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={profileFormData.last_name}
                      onChange={(e) => setProfileFormData({ ...profileFormData, last_name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileFormData.email}
                      onChange={(e) => setProfileFormData({ ...profileFormData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profileFormData.phone}
                      onChange={(e) => setProfileFormData({ ...profileFormData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <Button type="submit" disabled={profileLoading}>
                  {profileLoading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Company Settings */}
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Settings</CardTitle>
              <CardDescription>
                Manage your company information and defaults
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCompanySubmit}>
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Company Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company_name">Company Name</Label>
                      <Input
                        id="company_name"
                        value={companyFormData.company_name}
                        onChange={(e) => setCompanyFormData({ ...companyFormData, company_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="logo_url">Logo URL</Label>
                      <Input
                        id="logo_url"
                        value={companyFormData.logo_url}
                        onChange={(e) => setCompanyFormData({ ...companyFormData, logo_url: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Address Information</h3>
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <div>
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        value={companyFormData.address}
                        onChange={(e) => setCompanyFormData({ ...companyFormData, address: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={companyFormData.city}
                        onChange={(e) => setCompanyFormData({ ...companyFormData, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        value={companyFormData.state}
                        onChange={(e) => setCompanyFormData({ ...companyFormData, state: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="postal_code">Postal Code</Label>
                      <Input
                        id="postal_code"
                        value={companyFormData.postal_code}
                        onChange={(e) => setCompanyFormData({ ...companyFormData, postal_code: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="country">Country</Label>
                    <Select 
                      value={companyFormData.country}
                      onValueChange={(value) => setCompanyFormData({ ...companyFormData, country: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countryList.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="company_phone">Phone</Label>
                      <Input
                        id="company_phone"
                        value={companyFormData.phone}
                        onChange={(e) => setCompanyFormData({ ...companyFormData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="company_email">Email</Label>
                      <Input
                        id="company_email"
                        value={companyFormData.email}
                        onChange={(e) => setCompanyFormData({ ...companyFormData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={companyFormData.website}
                        onChange={(e) => setCompanyFormData({ ...companyFormData, website: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Registration Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="tax_id">Tax ID</Label>
                      <Input
                        id="tax_id"
                        value={companyFormData.tax_id}
                        onChange={(e) => setCompanyFormData({ ...companyFormData, tax_id: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="vat_number">VAT Number</Label>
                      <Input
                        id="vat_number"
                        value={companyFormData.vat_number}
                        onChange={(e) => setCompanyFormData({ ...companyFormData, vat_number: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="registration_number">Registration Number</Label>
                      <Input
                        id="registration_number"
                        value={companyFormData.registration_number}
                        onChange={(e) => setCompanyFormData({ ...companyFormData, registration_number: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Default Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label htmlFor="default_currency">Currency</Label>
                      <Select 
                        value={companyFormData.default_currency}
                        onValueChange={(value) => setCompanyFormData({ ...companyFormData, default_currency: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              {currency.code} - {currency.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="default_tax_rate">Default Tax Rate (%)</Label>
                      <Input
                        id="default_tax_rate"
                        type="number"
                        step="0.01"
                        value={companyFormData.default_tax_rate}
                        onChange={(e) => setCompanyFormData({ ...companyFormData, default_tax_rate: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="payment_terms">Payment Terms (Days)</Label>
                      <Input
                        id="payment_terms"
                        type="number"
                        value={companyFormData.payment_terms}
                        onChange={(e) => setCompanyFormData({ ...companyFormData, payment_terms: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="payment_instructions">Payment Instructions</Label>
                    <Input
                      id="payment_instructions"
                      value={companyFormData.payment_instructions}
                      onChange={(e) => setCompanyFormData({ ...companyFormData, payment_instructions: e.target.value })}
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Document Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label htmlFor="invoice_prefix">Invoice Prefix</Label>
                      <Input
                        id="invoice_prefix"
                        value={companyFormData.invoice_prefix}
                        onChange={(e) => setCompanyFormData({ ...companyFormData, invoice_prefix: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="quote_prefix">Quote Prefix</Label>
                      <Input
                        id="quote_prefix"
                        value={companyFormData.quote_prefix}
                        onChange={(e) => setCompanyFormData({ ...companyFormData, quote_prefix: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="receipt_prefix">Receipt Prefix</Label>
                      <Input
                        id="receipt_prefix"
                        value={companyFormData.receipt_prefix}
                        onChange={(e) => setCompanyFormData({ ...companyFormData, receipt_prefix: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="invoice_notes">Default Invoice Notes</Label>
                      <Input
                        id="invoice_notes"
                        value={companyFormData.invoice_notes}
                        onChange={(e) => setCompanyFormData({ ...companyFormData, invoice_notes: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="quote_notes">Default Quote Notes</Label>
                      <Input
                        id="quote_notes"
                        value={companyFormData.quote_notes}
                        onChange={(e) => setCompanyFormData({ ...companyFormData, quote_notes: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={companyLoading}>
                  {companyLoading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Billing Settings */}
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing Settings</CardTitle>
              <CardDescription>
                Manage your payment methods and subscription
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
                {paymentMethods && paymentMethods.length > 0 ? (
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center justify-between p-4 border rounded-md">
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 mr-2" />
                          <div>
                            <p className="font-medium capitalize">{method.provider}</p>
                            <p className="text-sm text-muted-foreground">
                              {method.payment_type} •••• {method.last_four} 
                              {method.expiry_date ? ` • Expires ${method.expiry_date}` : ''}
                              {method.is_default ? ' • Default' : ''}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePaymentMethod(method.id!)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground mb-4">No payment methods added yet.</p>
                )}
                
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setPaymentDialogOpen(true)}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>
              
              <Separator className="my-6" />
              
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-4">Subscription Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Current Plan</Label>
                    <p className="text-lg font-medium mt-1">
                      {billingSettings?.subscription_plan || "Free Plan"}
                    </p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <p className="text-lg font-medium mt-1">
                      {billingSettings?.subscription_status || "Active"}
                    </p>
                  </div>
                  <div>
                    <Label>Next Payment</Label>
                    <p className="text-lg font-medium mt-1">
                      {billingSettings?.subscription_renewal_date ? 
                        new Date(billingSettings.subscription_renewal_date).toLocaleDateString() : 
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label>Billing Name</Label>
                    <p className="text-lg font-medium mt-1">
                      {billingSettings?.billing_name || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <Button variant="outline">
                    Manage Subscription
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Dialog */}
          <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddPaymentMethod}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="payment_type" className="text-right">
                      Type
                    </Label>
                    <Select 
                      value={newPaymentMethod.payment_type}
                      onValueChange={(value) => setNewPaymentMethod({ ...newPaymentMethod, payment_type: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit_card">Credit Card</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="provider" className="text-right">
                      Provider
                    </Label>
                    <Select 
                      value={newPaymentMethod.provider}
                      onValueChange={(value) => setNewPaymentMethod({ ...newPaymentMethod, provider: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visa">Visa</SelectItem>
                        <SelectItem value="mastercard">Mastercard</SelectItem>
                        <SelectItem value="amex">American Express</SelectItem>
                        <SelectItem value="discover">Discover</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {newPaymentMethod.payment_type === "credit_card" && (
                    <>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="last_four" className="text-right">
                          Last 4 Digits
                        </Label>
                        <Input
                          id="last_four"
                          value={newPaymentMethod.last_four}
                          onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, last_four: e.target.value })}
                          className="col-span-3"
                          maxLength={4}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="expiry_date" className="text-right">
                          Expiry (MM/YY)
                        </Label>
                        <Input
                          id="expiry_date"
                          value={newPaymentMethod.expiry_date}
                          onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, expiry_date: e.target.value })}
                          className="col-span-3"
                          placeholder="MM/YY"
                        />
                      </div>
                    </>
                  )}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="is_default" className="text-right">
                      Default
                    </Label>
                    <div className="flex items-center space-x-2 col-span-3">
                      <Switch
                        id="is_default"
                        checked={newPaymentMethod.is_default}
                        onCheckedChange={(value) => setNewPaymentMethod({ ...newPaymentMethod, is_default: value })}
                      />
                      <Label htmlFor="is_default">Set as default payment method</Label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Add Payment Method</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        {/* Notification Preferences */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNotificationSubmit}>
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="invoice_notifications" className="text-base font-medium">
                          Invoice Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about invoice updates and payments
                        </p>
                      </div>
                      <Switch
                        id="invoice_notifications"
                        checked={invoiceNotifs}
                        onCheckedChange={setInvoiceNotifs}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="client_activity" className="text-base font-medium">
                          Client Activity
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Get notifications when clients view or pay invoices
                        </p>
                      </div>
                      <Switch
                        id="client_activity"
                        checked={clientActivity}
                        onCheckedChange={setClientActivity}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="project_updates" className="text-base font-medium">
                          Project Updates
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about project milestones and updates
                        </p>
                      </div>
                      <Switch
                        id="project_updates"
                        checked={projectUpdates}
                        onCheckedChange={setProjectUpdates}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="marketing_tips" className="text-base font-medium">
                          Marketing & Tips
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive tips, updates, and marketing communications
                        </p>
                      </div>
                      <Switch
                        id="marketing_tips"
                        checked={marketingTips}
                        onCheckedChange={setMarketingTips}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Email Digest Frequency</h3>
                  <div className="grid gap-4">
                    <div className="flex flex-col">
                      <Label htmlFor="email_frequency" className="mb-2">
                        Frequency
                      </Label>
                      <Select 
                        value={emailFrequency}
                        onValueChange={(value: "immediate" | "daily" | "weekly") => setEmailFrequency(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Immediate</SelectItem>
                          <SelectItem value="daily">Daily Digest</SelectItem>
                          <SelectItem value="weekly">Weekly Digest</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground mt-2">
                        {emailFrequency === "immediate" && "Receive individual emails immediately as events happen"}
                        {emailFrequency === "daily" && "Receive a daily summary of all notifications"}
                        {emailFrequency === "weekly" && "Receive a weekly summary of all notifications"}
                      </p>
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={notifLoading}>
                  {notifLoading ? "Saving..." : "Save Preferences"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security Settings */}
        <TabsContent value="security">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    id="two_factor"
                    checked={twoFactorEnabled}
                    onCheckedChange={(value) => setTwoFactorEnabled(value)}
                  />
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-base font-medium mb-2">Password</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Last changed: {securitySettings?.last_password_change ? 
                          new Date(securitySettings.last_password_change).toLocaleDateString() : 
                          "Never"}
                      </p>
                    </div>
                    <Button 
                      variant="outline"
                      onClick={() => setPasswordDialogOpen(true)}
                    >
                      <RefreshCcw className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveSecuritySettings} disabled={securityLoading}>
                    {securityLoading ? "Saving..." : "Save Security Settings"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Session History</CardTitle>
              <CardDescription>
                View your recent login activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Browser</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>IP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessionHistory?.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>{new Date(session.login_at).toLocaleString()}</TableCell>
                        <TableCell>{session.browser || 'Unknown'}</TableCell>
                        <TableCell>{session.device || 'Unknown'}</TableCell>
                        <TableCell>{session.ip_address || 'Unknown'}</TableCell>
                      </TableRow>
                    ))}
                    {sessionHistory?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4}>No session history found</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          {/* Password Change Dialog */}
          <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleChangePassword}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Change Password</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
