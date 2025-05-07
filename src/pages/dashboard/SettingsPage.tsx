import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Building, CreditCard, Bell, Shield, LogOut } from "lucide-react";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import { useCompanySettings } from "@/hooks/useCompanySettings";
import { useNotificationSettings } from "@/hooks/useNotificationSettings";
import { useSecuritySettings } from "@/hooks/useSecuritySettings";
import { useBillingSettings } from "@/hooks/useBillingSettings";
import {
  ProfileFormData,
  CompanyFormData,
  BillingFormData,
  NotificationFormData,
  SecurityFormData,
} from "@/types/settings";
import { toast } from "sonner";
import { uploadFile } from "@/services/storageService";

// Add a logo upload component
const LogoUploader = ({
  logoUrl,
  onLogoChange,
}: {
  logoUrl?: string;
  onLogoChange: (url: string) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image file size must be less than 2MB");
      return;
    }

    setLoading(true);
    try {
      const url = await uploadFile(file);
      if (url) {
        onLogoChange(url);
        toast.success("Logo uploaded successfully");
      } else {
        toast.error("Failed to upload logo");
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast.error("Failed to upload logo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="logo">Company Logo</Label>
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <div className="border rounded-md overflow-hidden w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center bg-gray-50 shrink-0">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Company Logo"
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <User className="h-10 w-10 text-gray-300" />
          )}
        </div>
        <div className="space-y-2 text-center sm:text-left">
          <input
            type="file"
            id="logo"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            size="sm"
            className="w-full sm:w-auto"
          >
            {loading ? "Uploading..." : "Upload Logo"}
          </Button>
          {logoUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700 w-full sm:w-auto"
              onClick={() => onLogoChange("")}
            >
              Remove Logo
            </Button>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Recommended: 200x200px. Max: 2MB.
          </p>
        </div>
      </div>
    </div>
  );
};

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const profile = useProfileSettings();
  const company = useCompanySettings();
  const notifications = useNotificationSettings();
  const security = useSecuritySettings();
  const billing = useBillingSettings();

  // Profile state
  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  // Company state
  const [companyForm, setCompanyForm] = useState<CompanyFormData>({
    company_name: "",
    industry: "",
    address: "",
    city: "",
    postal_code: "",
    country: "",
    tax_id: "",
    logo_url: "",
  });

  // Notification state
  const [notificationForm, setNotificationForm] =
    useState<NotificationFormData>({
      invoice_notifications: true,
      client_activity: true,
      project_updates: false,
      marketing_tips: false,
      email_frequency: "immediate",
    });

  // Security state
  const [securityForm, setSecurityForm] = useState<SecurityFormData>({
    two_factor_enabled: false,
  });

  // Password fields
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Billing state
  const [billingForm, setBillingForm] = useState<BillingFormData>({
    billing_name: "",
    billing_email: "",
  });

  // Effect to update forms when data is loaded
  React.useEffect(() => {
    if (profile.profile) {
      setProfileForm({
        first_name: profile.profile.first_name || "",
        last_name: profile.profile.last_name || "",
        email: profile.profile.email,
        phone: profile.profile.phone || "",
      });
    }

    if (company.companySettings) {
      setCompanyForm({
        company_name: company.companySettings.company_name || "",
        industry: company.companySettings.industry || "",
        address: company.companySettings.address || "",
        city: company.companySettings.city || "",
        postal_code: company.companySettings.postal_code || "",
        country: company.companySettings.country || "",
        tax_id: company.companySettings.tax_id || "",
        logo_url: company.companySettings.logo_url || "",
      });
    }

    if (notifications.notificationPreferences) {
      setNotificationForm({
        invoice_notifications:
          notifications.notificationPreferences.invoice_notifications,
        client_activity: notifications.notificationPreferences.client_activity,
        project_updates: notifications.notificationPreferences.project_updates,
        marketing_tips: notifications.notificationPreferences.marketing_tips,
        email_frequency: notifications.notificationPreferences.email_frequency,
      });
    }

    if (security.securitySettings) {
      setSecurityForm({
        two_factor_enabled: security.securitySettings.two_factor_enabled,
      });
    }

    if (billing.billingSettings) {
      setBillingForm({
        billing_name: billing.billingSettings.billing_name || "",
        billing_email: billing.billingSettings.billing_email || "",
      });
    }
  }, [
    profile.profile,
    company.companySettings,
    notifications.notificationPreferences,
    security.securitySettings,
    billing.billingSettings,
  ]);

  // Form handlers
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCompanyForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setBillingForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleNotificationToggle = (field: keyof NotificationFormData) => {
    if (typeof notificationForm[field] === "boolean") {
      setNotificationForm((prev) => ({
        ...prev,
        [field]: !prev[field],
      }));
    }
  };

  const handleFrequencyChange = (value: "immediate" | "daily" | "weekly") => {
    setNotificationForm((prev) => ({ ...prev, email_frequency: value }));
  };

  const handleSecurityToggle = () => {
    setSecurityForm((prev) => ({
      ...prev,
      two_factor_enabled: !prev.two_factor_enabled,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswordFields((prev) => ({ ...prev, [id]: value }));
  };

  // Add logo change handler
  const handleLogoChange = (url: string) => {
    setCompanyForm((prev) => ({ ...prev, logo_url: url }));
  };

  // Save handlers
  const saveProfile = async () => {
    try {
      const success = await profile.updateProfile(profileForm);
      if (success) {
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
  };

  const saveCompanySettings = async () => {
    try {
      const success = await company.updateCompanySettings(companyForm);
      if (success) {
        toast.success("Company settings updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update company settings");
      console.error(error);
    }
  };

  const saveBillingSettings = async () => {
    try {
      const success = await billing.updateBillingSettings(billingForm);
      if (success) {
        toast.success("Billing settings updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update billing settings");
      console.error(error);
    }
  };

  const saveNotificationSettings = async () => {
    try {
      const success = await notifications.updateNotificationPreferences(
        notificationForm
      );
      if (success) {
        toast.success("Notification preferences updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update notification preferences");
      console.error(error);
    }
  };

  const saveSecuritySettings = async () => {
    try {
      const success = await security.updateSecuritySettings(securityForm);
      if (success) {
        toast.success("Security settings updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update security settings");
      console.error(error);
    }
  };

  const updatePassword = async () => {
    if (passwordFields.newPassword !== passwordFields.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordFields.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const success = await security.changePassword(
        passwordFields.currentPassword,
        passwordFields.newPassword
      );
      if (success) {
        toast.success("Password updated successfully");
        setPasswordFields({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      toast.error("Failed to update password");
      console.error(error);
    }
  };

  if (
    profile.loading ||
    company.loading ||
    notifications.loading ||
    security.loading ||
    billing.loading
  ) {
    return <div className="p-4 text-center">Loading settings...</div>;
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Settings
        </h1>
        <p className="text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Tabs
          defaultValue="profile"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <div className="border-b overflow-x-auto">
            <TabsList className="flex h-auto p-0 min-w-max">
              <TabsTrigger
                value="profile"
                className="flex items-center px-3 py-2 border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:text-green-600 text-sm"
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="company"
                className="flex items-center px-3 py-2 border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:text-green-600 text-sm"
              >
                <Building className="mr-2 h-4 w-4" />
                Company
              </TabsTrigger>
              <TabsTrigger
                value="billing"
                className="flex items-center px-3 py-2 border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:text-green-600 text-sm"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="flex items-center px-3 py-2 border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:text-green-600 text-sm"
              >
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="flex items-center px-3 py-2 border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:text-green-600 text-sm"
              >
                <Shield className="mr-2 h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-4 sm:p-6">
            <TabsContent value="profile" className="mt-0">
              <div className="space-y-4 sm:space-y-6">
                <div className="border-b pb-4 sm:pb-6">
                  <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        value={profileForm.first_name}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        value={profileForm.last_name}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileForm.phone}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={saveProfile}
                    disabled={profile.loading}
                  >
                    {profile.loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="company" className="mt-0">
              <div className="space-y-4 sm:space-y-6">
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-medium">
                    Company Information
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    This information will appear on your invoices and quotes.
                  </p>

                  {/* Logo uploader */}
                  <LogoUploader
                    logoUrl={companyForm.logo_url}
                    onLogoChange={handleLogoChange}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="company_name">Company Name</Label>
                      <Input
                        id="company_name"
                        value={companyForm.company_name}
                        onChange={handleCompanyChange}
                      />
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Input
                        id="industry"
                        value={companyForm.industry}
                        onChange={handleCompanyChange}
                      />
                    </div>
                    <div className="space-y-1 sm:space-y-2 col-span-1 sm:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={companyForm.address}
                        onChange={handleCompanyChange}
                      />
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={companyForm.city}
                        onChange={handleCompanyChange}
                      />
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="postal_code">Postal Code</Label>
                      <Input
                        id="postal_code"
                        value={companyForm.postal_code}
                        onChange={handleCompanyChange}
                      />
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={companyForm.country}
                        onChange={handleCompanyChange}
                      />
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="tax_id">Tax ID / VAT Number</Label>
                      <Input
                        id="tax_id"
                        value={companyForm.tax_id}
                        onChange={handleCompanyChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={saveCompanySettings}
                    disabled={company.loading}
                  >
                    {company.loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="billing" className="mt-0">
              <div className="space-y-4 sm:space-y-6">
                <div className="border-b pb-4 sm:pb-6">
                  <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
                    Payment Methods
                  </h3>
                  {billing.paymentMethods.length > 0 ? (
                    billing.paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className="p-3 sm:p-4 border rounded-lg mb-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
                      >
                        <div className="flex items-center">
                          <div className="bg-blue-500 text-white p-1.5 sm:p-2 rounded mr-3 shrink-0">
                            <CreditCard className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">
                              {method.provider} ending in {method.last_four}
                            </div>
                            <div className="text-xs text-gray-500">
                              {method.expiry_date
                                ? `Expires ${new Date(
                                    method.expiry_date
                                  ).toLocaleDateString("en-US", {
                                    month: "2-digit",
                                    year: "numeric",
                                  })}`
                                : "No expiry date"}
                            </div>
                          </div>
                        </div>
                        <div className="space-x-2 flex ml-8 sm:ml-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 text-xs"
                            onClick={() =>
                              billing.deletePaymentMethod(method.id)
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 mb-3">
                      No payment methods added yet.
                    </div>
                  )}
                  <Button variant="outline" size="sm">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Add Payment Method
                  </Button>
                </div>

                <div className="border-b pb-4 sm:pb-6">
                  <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
                    Billing Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="billing_name">Name on Invoice</Label>
                      <Input
                        id="billing_name"
                        value={billingForm.billing_name}
                        onChange={handleBillingChange}
                      />
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="billing_email">Billing Email</Label>
                      <Input
                        id="billing_email"
                        value={billingForm.billing_email}
                        onChange={handleBillingChange}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
                    Subscription Plan
                  </h3>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-1">
                      <div className="font-semibold text-sm">
                        Current Plan:{" "}
                        {billing.billingSettings?.subscription_plan || "Free"}
                      </div>
                      <div className="text-green-600 font-medium text-sm">
                        {billing.billingSettings?.subscription_plan === "free"
                          ? "Free"
                          : "$29.99/month"}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mb-3">
                      {billing.billingSettings?.subscription_renewal_date
                        ? `Your plan renews on ${new Date(
                            billing.billingSettings.subscription_renewal_date
                          ).toLocaleDateString()}`
                        : "No renewal date set"}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        Change Plan
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        Cancel Subscription
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={saveBillingSettings}
                    disabled={billing.loading}
                  >
                    {billing.loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="mt-0">
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
                  Notification Preferences
                </h3>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 pr-4">
                      <div className="font-medium text-sm">
                        Invoice Notifications
                      </div>
                      <div className="text-xs text-gray-500">
                        Receive notifications for paid, overdue, or expired
                        invoices
                      </div>
                    </div>
                    <Switch
                      checked={notificationForm.invoice_notifications}
                      onCheckedChange={() =>
                        handleNotificationToggle("invoice_notifications")
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 pr-4">
                      <div className="font-medium text-sm">Client Activity</div>
                      <div className="text-xs text-gray-500">
                        Get notified when clients view your documents
                      </div>
                    </div>
                    <Switch
                      checked={notificationForm.client_activity}
                      onCheckedChange={() =>
                        handleNotificationToggle("client_activity")
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 pr-4">
                      <div className="font-medium text-sm">Project Updates</div>
                      <div className="text-xs text-gray-500">
                        Receive updates about project milestones
                      </div>
                    </div>
                    <Switch
                      checked={notificationForm.project_updates}
                      onCheckedChange={() =>
                        handleNotificationToggle("project_updates")
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 pr-4">
                      <div className="font-medium text-sm">
                        Marketing & Tips
                      </div>
                      <div className="text-xs text-gray-500">
                        Receive product updates and tips
                      </div>
                    </div>
                    <Switch
                      checked={notificationForm.marketing_tips}
                      onCheckedChange={() =>
                        handleNotificationToggle("marketing_tips")
                      }
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
                    Email Notification Frequency
                  </h3>

                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="immediate"
                        name="frequency"
                        checked={
                          notificationForm.email_frequency === "immediate"
                        }
                        onChange={() => handleFrequencyChange("immediate")}
                        className="text-green-600"
                      />
                      <Label htmlFor="immediate" className="text-sm">
                        Immediately
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="daily"
                        name="frequency"
                        checked={notificationForm.email_frequency === "daily"}
                        onChange={() => handleFrequencyChange("daily")}
                        className="text-green-600"
                      />
                      <Label htmlFor="daily" className="text-sm">
                        Daily digest
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="weekly"
                        name="frequency"
                        checked={notificationForm.email_frequency === "weekly"}
                        onChange={() => handleFrequencyChange("weekly")}
                        className="text-green-600"
                      />
                      <Label htmlFor="weekly" className="text-sm">
                        Weekly digest
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={saveNotificationSettings}
                    disabled={notifications.loading}
                  >
                    {notifications.loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="mt-0">
              <div className="space-y-4 sm:space-y-6">
                <div className="border-b pb-4 sm:pb-6">
                  <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
                    Two-Factor Authentication
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 pr-4">
                      <div className="font-medium text-sm">
                        Enable Two-Factor Authentication
                      </div>
                      <div className="text-xs text-gray-500">
                        Add an extra layer of security to your account
                      </div>
                    </div>
                    <Switch
                      checked={securityForm.two_factor_enabled}
                      onCheckedChange={handleSecurityToggle}
                    />
                  </div>
                </div>

                <div className="border-b pb-4 sm:pb-6">
                  <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
                    Change Password
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1 sm:space-y-2 col-span-1 sm:col-span-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordFields.currentPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordFields.newPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordFields.confirmPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-4">
                    <Button
                      size="sm"
                      onClick={updatePassword}
                      disabled={
                        !passwordFields.currentPassword ||
                        !passwordFields.newPassword ||
                        !passwordFields.confirmPassword ||
                        passwordFields.newPassword !==
                          passwordFields.confirmPassword
                      }
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Update Password
                    </Button>
                  </div>
                </div>

                <div className="border-b pb-4 sm:pb-6">
                  <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
                    Sessions
                  </h3>
                  <div className="space-y-3">
                    {security.sessionHistory.length > 0 ? (
                      security.sessionHistory.map((session, index) => (
                        <div
                          key={session.id}
                          className="p-3 border rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
                        >
                          <div>
                            <div className="font-medium text-sm">
                              {index === 0
                                ? "Current Session"
                                : "Previous Session"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {session.os || "Unknown OS"} •{" "}
                              {session.browser || "Unknown Browser"} •{" "}
                              {session.location || "Unknown Location"}
                            </div>
                          </div>
                          <div
                            className={`text-xs ${
                              index === 0
                                ? "text-green-600 font-medium"
                                : "text-gray-500"
                            }`}
                          >
                            {index === 0
                              ? "Active Now"
                              : new Date(session.login_at).toLocaleDateString()}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">
                        No session history available
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
                    Advanced
                  </h3>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out of All Devices
                  </Button>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={saveSecuritySettings}
                    disabled={security.loading}
                  >
                    {security.loading ? "Saving..." : "Save 2FA Settings"}
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
