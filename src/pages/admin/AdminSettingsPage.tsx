
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const AdminSettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Manage general system settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site-name">Site Name</Label>
              <Input id="site-name" defaultValue="Risitify" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site-url">Site URL</Label>
              <Input id="site-url" defaultValue="https://risitify.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Admin Email</Label>
              <Input id="admin-email" defaultValue="admin@risitify.com" />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="maintenance-mode" />
              <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
            </div>
            <Button className="bg-[#4caf50] hover:bg-[#388e3c]">Save General Settings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Settings</CardTitle>
            <CardDescription>Configure email notification settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="smtp-host">SMTP Host</Label>
              <Input id="smtp-host" defaultValue="smtp.example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-port">SMTP Port</Label>
              <Input id="smtp-port" defaultValue="587" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-user">SMTP Username</Label>
              <Input id="smtp-user" defaultValue="notifications@risitify.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-password">SMTP Password</Label>
              <Input id="smtp-password" type="password" defaultValue="••••••••••••" />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="use-ssl" defaultChecked />
              <Label htmlFor="use-ssl">Use SSL</Label>
            </div>
            <Button className="bg-[#4caf50] hover:bg-[#388e3c]">Save Email Settings</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>View system information and status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Version</span>
                <span>1.2.5</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">PHP Version</span>
                <span>8.2.0</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Database</span>
                <span>PostgreSQL 14.5</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Server</span>
                <span>Nginx 1.21.0</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Total Users</span>
                <span>150</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Total Invoices</span>
                <span>342</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Total Quotes</span>
                <span>218</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Total Receipts</span>
                <span>289</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettingsPage;
