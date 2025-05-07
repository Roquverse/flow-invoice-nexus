import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Check, CreditCard, ExternalLink, Loader2, Plus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import { useCompanySettings } from "@/hooks/useCompanySettings";
import { useBillingSettings } from "@/hooks/useBillingSettings";
import { useSecuritySettings } from "@/hooks/useSecuritySettings";
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type TabType = "profile" | "company" | "billing" | "notifications" | "security";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [openAddPaymentDialog, setOpenAddPaymentDialog] = useState(false);
  const [newPaymentType, setNewPaymentType] = useState<string>("credit_card");
  const [newPaymentProvider, setNewPaymentProvider] = useState<string>("");
  const [newPaymentLastFour, setNewPaymentLastFour] = useState<string>("");
  const [newPaymentExpiryDate, setNewPaymentExpiryDate] = useState<string>("");
  const [addingPayment, setAddingPayment] = useState(false);

  // User profile settings state and hooks
  const { profileSettings, loading: profileLoading, error: profileError, updateProfile } = useProfileSettings();
  const [firstName, setFirstName] = useState(profileSettings?.first_name || "");
  const [lastName, setLastName] = useState(profileSettings?.last_name || "");
  const [email, setEmail] = useState(profileSettings?.email || "");
  const [phone, setPhone] = useState(profileSettings?.phone || "");
  const [savingProfile, setSavingProfile] = useState(false);

  // Company settings state and hooks
  const { companySettings, loading: companyLoading, error: companyError, updateCompanySettings } = useCompanySettings();
  const [companyName, setCompanyName] = useState(companySettings?.company_name || "");
  const [industry, setIndustry] = useState(companySettings?.industry || "");
  const [companyAddress, setCompanyAddress] = useState(companySettings?.address || "");
  const [companyCity, setCompanyCity] = useState(companySettings?.city || "");
  const [companyPostalCode, setCompanyPostalCode] = useState(companySettings?.postal_code || "");
  const [companyCountry, setCompanyCountry] = useState(companySettings?.country || "");
  const [companyTaxId, setCompanyTaxId] = useState(companySettings?.tax_id || "");
  const [savingCompany, setSavingCompany] = useState(false);

  // Billing settings state and hooks
  const { billingSettings, paymentMethods, loading: billingLoading, error: billingError, addPaymentMethod, deletePaymentMethod, updateBillingSettings } = useBillingSettings();
  const [billingName, setBillingName] = useState(billingSettings?.billing_name || "");
  const [billingEmail, setBillingEmail] = useState(billingSettings?.billing_email || "");
  const [savingBilling, setSavingBilling] = useState(false);

  // Security settings state and hooks
  const { securitySettings, sessionHistory, loading: securityLoading, error: securityError, fetchSessionHistory, updateSecuritySettings, changePassword } = useSecuritySettings();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(securitySettings?.two_factor_enabled || false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Notification preferences state and hooks
  const { notificationPreferences, loading: notificationLoading, error: notificationError, updatePreferences } = useNotificationPreferences();
  const [invoiceNotifications, setInvoiceNotifications] = useState(notificationPreferences?.invoice_notifications || true);
  const [clientActivity, setClientActivity] = useState(notificationPreferences?.client_activity || true);
  const [projectUpdates, setProjectUpdates] = useState(notificationPreferences?.project_updates || false);
  const [marketingTips, setMarketingTips] = useState(notificationPreferences?.marketing_tips || false);
  const [emailFrequency, setEmailFrequency] = useState<"immediate" | "daily" | "weekly">(
    (notificationPreferences?.email_frequency as "immediate" | "daily" | "weekly") || "immediate"
  );
  const [savingNotifications, setSavingNotifications] = useState(false);

  // Handle profile settings update
  const handleProfileUpdate = async () => {
    setSavingProfile(true);
    try {
      const success = await updateProfile({
        first_name: firstName,
        last_name: lastName,
        phone,
      });

      if (success) {
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating your profile");
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle company settings update
  const handleCompanyUpdate = async () => {
    setSavingCompany(true);
    try {
      const success = await updateCompanySettings({
        company_name: companyName,
        industry,
        address: companyAddress,
        city: companyCity,
        postal_code: companyPostalCode,
        country: companyCountry,
        tax_id: companyTaxId,
      });

      if (success) {
        toast.success("Company settings updated successfully");
      } else {
        toast.error("Failed to update company settings");
      }
    } catch (error) {
      console.error("Error updating company settings:", error);
      toast.error("An error occurred while updating company settings");
    } finally {
      setSavingCompany(false);
    }
  };

  // Handle billing settings update
  const handleBillingUpdate = async () => {
    setSavingBilling(true);
    try {
      const success = await updateBillingSettings({
        billing_name: billingName,
        billing_email: billingEmail,
      });

      if (success) {
        toast.success("Billing settings updated successfully");
      } else {
        toast.error("Failed to update billing settings");
      }
    } catch (error) {
      console.error("Error updating billing settings:", error);
      toast.error("An error occurred while updating billing settings");
    } finally {
      setSavingBilling(false);
    }
  };

  // Handle adding a payment method
  const handleAddPaymentMethod = async () => {
    setAddingPayment(true);
    try {
      if (!newPaymentProvider) {
        toast.error("Please enter a payment provider");
        return;
      }

      const success = await addPaymentMethod({
        payment_type: newPaymentType,
        provider: newPaymentProvider,
        last_four: newPaymentLastFour,
        expiry_date: newPaymentExpiryDate ? new Date(newPaymentExpiryDate).toISOString() : undefined,
      });

      if (success) {
        setOpenAddPaymentDialog(false);
        setNewPaymentType("credit_card");
        setNewPaymentProvider("");
        setNewPaymentLastFour("");
        setNewPaymentExpiryDate("");
        toast.success("Payment method added successfully");
      } else {
        toast.error("Failed to add payment method");
      }
    } catch (error) {
      console.error("Error adding payment method:", error);
      toast.error("An error occurred while adding the payment method");
    } finally {
      setAddingPayment(false);
    }
  };

  // Handle deleting a payment method
  const handleDeletePaymentMethod = async (id: string) => {
    try {
      const success = await deletePaymentMethod(id);
      if (success) {
        toast.success("Payment method removed successfully");
      } else {
        toast.error("Failed to remove payment method");
      }
    } catch (error) {
      console.error("Error removing payment method:", error);
      toast.error("An error occurred while removing the payment method");
    }
  };

  // Handle changing password
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setChangingPassword(true);
    try {
      const success = await changePassword(currentPassword, newPassword);
      if (success) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        toast.success("Password changed successfully");
      } else {
        toast.error("Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("An error occurred while changing your password");
    } finally {
      setChangingPassword(false);
    }
  };

  // Handle toggling two-factor authentication
  const handleToggleTwoFactor = async () => {
    try {
      const newValue = !twoFactorEnabled;
      const success = await updateSecuritySettings({
        two_factor_enabled: newValue,
      });

      if (success) {
        setTwoFactorEnabled(newValue);
        toast.success(
          newValue
            ? "Two-factor authentication enabled"
            : "Two-factor authentication disabled"
        );
      } else {
        toast.error("Failed to update two-factor authentication settings");
      }
    } catch (error) {
      console.error("Error updating two-factor authentication:", error);
      toast.error("An error occurred while updating two-factor authentication");
    }
  };

  // Handle notification preferences update
  const handleNotificationUpdate = async () => {
    setSavingNotifications(true);
    try {
      const success = await updatePreferences({
        invoice_notifications: invoiceNotifications,
        client_activity: clientActivity,
        project_updates: projectUpdates,
        marketing_tips: marketingTips,
        email_frequency: emailFrequency,
      });

      if (success) {
        toast.success("Notification preferences updated successfully");
      } else {
        toast.error("Failed to update notification preferences");
      }
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      toast.error("An error occurred while updating notification preferences");
    } finally {
      setSavingNotifications(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Profile Settings Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{profileError.message}</AlertDescription>
                </Alert>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <Button onClick={handleProfileUpdate} disabled={savingProfile}>
                {savingProfile ? (
                  <>
                    Saving <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Settings Tab */}
        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {companyError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{companyError.message}</AlertDescription>
                </Alert>
              )}
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  type="text"
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input
                  type="text"
                  id="industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="companyAddress">Address</Label>
                <Input
                  type="text"
                  id="companyAddress"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="companyCity">City</Label>
                  <Input
                    type="text"
                    id="companyCity"
                    value={companyCity}
                    onChange={(e) => setCompanyCity(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="companyPostalCode">Postal Code</Label>
                  <Input
                    type="text"
                    id="companyPostalCode"
                    value={companyPostalCode}
                    onChange={(e) => setCompanyPostalCode(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="companyCountry">Country</Label>
                  <Input
                    type="text"
                    id="companyCountry"
                    value={companyCountry}
                    onChange={(e) => setCompanyCountry(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="companyTaxId">Tax ID</Label>
                <Input
                  type="text"
                  id="companyTaxId"
                  value={companyTaxId}
                  onChange={(e) => setCompanyTaxId(e.target.value)}
                />
              </div>
              <Button onClick={handleCompanyUpdate} disabled={savingCompany}>
                {savingCompany ? (
                  <>
                    Saving <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  "Update Company"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Settings Tab */}
        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {billingError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{billingError.message}</AlertDescription>
                </Alert>
              )}
              <div>
                <Label htmlFor="billingName">Billing Name</Label>
                <Input
                  type="text"
                  id="billingName"
                  value={billingName}
                  onChange={(e) => setBillingName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="billingEmail">Billing Email</Label>
                <Input
                  type="email"
                  id="billingEmail"
                  value={billingEmail}
                  onChange={(e) => setBillingEmail(e.target.value)}
                />
              </div>
              <Button onClick={handleBillingUpdate} disabled={savingBilling}>
                {savingBilling ? (
                  <>
                    Saving <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  "Update Billing"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              {billingLoading ? (
                <div className="flex justify-center items-center h-24">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : paymentMethods.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  No payment methods added yet.
                </Alert>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Last Four</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentMethods.map((method) => (
                      <TableRow key={method.id}>
                        <TableCell>{method.payment_type}</TableCell>
                        <TableCell>{method.provider}</TableCell>
                        <TableCell>{method.last_four}</TableCell>
                        <TableCell>
                          {method.expiry_date
                            ? new Date(method.expiry_date).toLocaleDateString()
                            : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePaymentMethod(method.id)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              <Button
                variant="outline"
                onClick={() => setOpenAddPaymentDialog(true)}
                className="mt-4"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Payment Method
              </Button>
            </CardContent>
          </Card>

          {/* Add Payment Method Dialog */}
          <Dialog open={openAddPaymentDialog} onOpenChange={setOpenAddPaymentDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
                <DialogDescription>
                  Add a new payment method to your account.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="paymentType" className="text-right">
                    Type
                  </Label>
                  <Select
                    value={newPaymentType}
                    onValueChange={setNewPaymentType}
                    className="col-span-3"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="paymentProvider" className="text-right">
                    Provider
                  </Label>
                  <Input
                    id="paymentProvider"
                    value={newPaymentProvider}
                    onChange={(e) => setNewPaymentProvider(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                {newPaymentType === "credit_card" && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="paymentLastFour" className="text-right">
                        Last Four Digits
                      </Label>
                      <Input
                        id="paymentLastFour"
                        value={newPaymentLastFour}
                        onChange={(e) => setNewPaymentLastFour(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="paymentExpiryDate" className="text-right">
                        Expiry Date
                      </Label>
                      <Input
                        type="date"
                        id="paymentExpiryDate"
                        value={newPaymentExpiryDate}
                        onChange={(e) => setNewPaymentExpiryDate(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setOpenAddPaymentDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddPaymentMethod} disabled={addingPayment}>
                  {addingPayment ? (
                    <>
                      Adding <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    "Add Payment"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Notification Preferences Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {notificationError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{notificationError.message}</AlertDescription>
                </Alert>
              )}
              <div>
                <Label htmlFor="invoiceNotifications" className="flex items-center">
                  <Switch
                    id="invoiceNotifications"
                    checked={invoiceNotifications}
                    onCheckedChange={setInvoiceNotifications}
                  />
                  <span className="ml-2">Invoice Notifications</span>
                </Label>
              </div>
              <div>
                <Label htmlFor="clientActivity" className="flex items-center">
                  <Switch
                    id="clientActivity"
                    checked={clientActivity}
                    onCheckedChange={setClientActivity}
                  />
                  <span className="ml-2">Client Activity</span>
                </Label>
              </div>
              <div>
                <Label htmlFor="projectUpdates" className="flex items-center">
                  <Switch
                    id="projectUpdates"
                    checked={projectUpdates}
                    onCheckedChange={setProjectUpdates}
                  />
                  <span className="ml-2">Project Updates</span>
                </Label>
              </div>
              <div>
                <Label htmlFor="marketingTips" className="flex items-center">
                  <Switch
                    id="marketingTips"
                    checked={marketingTips}
                    onCheckedChange={setMarketingTips}
                  />
                  <span className="ml-2">Marketing Tips</span>
                </Label>
              </div>
              <div>
                <Label htmlFor="emailFrequency">Email Frequency</Label>
                <Select
                  value={emailFrequency}
                  onValueChange={(value) =>
                    setEmailFrequency(value as "immediate" | "daily" | "weekly")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleNotificationUpdate} disabled={savingNotifications}>
                {savingNotifications ? (
                  <>
                    Saving <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  "Update Notifications"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {securityError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{securityError.message}</AlertDescription>
                </Alert>
              )}
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button onClick={handleChangePassword} disabled={changingPassword}>
                {changingPassword ? (
                  <>
                    Changing <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="twoFactor">Enable Two-Factor Authentication</Label>
                  <Switch
                    id="twoFactor"
                    checked={twoFactorEnabled}
                    onCheckedChange={handleToggleTwoFactor}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Enhance your account security by requiring a verification code from
                  your authenticator app in addition to your password.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session History</CardTitle>
            </CardHeader>
            <CardContent>
              {securityLoading ? (
                <div className="flex justify-center items-center h-24">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : sessionHistory.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  No session history found.
                </Alert>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Login At</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>User Agent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessionHistory.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>
                          {new Date(session.login_at).toLocaleString()}
                        </TableCell>
                        <TableCell>{session.ip_address}</TableCell>
                        <TableCell>
                          <a
                            href={`https://whois.domaintools.com/${session.ip_address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            {session.user_agent}
                            <ExternalLink className="inline-block ml-1 h-4 w-4" />
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
