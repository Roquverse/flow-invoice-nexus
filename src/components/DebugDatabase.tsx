import { useState } from "react";
import { Button } from "@/components/ui/button";
import * as settingsService from "@/services/settingsService";
import { supabase } from "@/integrations/supabase/client";

// SQL for creating tables
const CREATE_TABLES_SQL = `
-- Create tables in the public schema
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);
  
CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Company settings table
CREATE TABLE IF NOT EXISTS company_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT,
  industry TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT,
  tax_id TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own company settings"
  ON company_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own company settings"
  ON company_settings FOR UPDATE
  USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own company settings"
  ON company_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Billing settings table
CREATE TABLE IF NOT EXISTS billing_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  billing_name TEXT,
  billing_email TEXT,
  subscription_plan TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'active',
  subscription_renewal_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

ALTER TABLE billing_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own billing settings"
  ON billing_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own billing settings"
  ON billing_settings FOR UPDATE
  USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own billing settings"
  ON billing_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Notification preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_notifications BOOLEAN DEFAULT true,
  client_activity BOOLEAN DEFAULT true,
  project_updates BOOLEAN DEFAULT false,
  marketing_tips BOOLEAN DEFAULT false,
  email_frequency TEXT DEFAULT 'immediate',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notification preferences"
  ON notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification preferences"
  ON notification_preferences FOR UPDATE
  USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own notification preferences"
  ON notification_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Security settings
CREATE TABLE IF NOT EXISTS security_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  two_factor_enabled BOOLEAN DEFAULT false,
  last_password_change TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

ALTER TABLE security_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own security settings"
  ON security_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own security settings"
  ON security_settings FOR UPDATE
  USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own security settings"
  ON security_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);
`;

export function DebugDatabase() {
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runDebug = async () => {
    setIsLoading(true);
    try {
      const status = await settingsService.debugDatabaseStatus();
      setResult(status);
    } catch (error) {
      setResult({ error });
    } finally {
      setIsLoading(false);
    }
  };

  const createUserProfile = async () => {
    setIsLoading(true);
    try {
      // Get current user
      const { data: authData } = await supabase.auth.getUser();

      if (!authData.user) {
        setResult({ error: "No authenticated user" });
        return;
      }

      // Create a basic profile
      const profile = {
        email: authData.user.email || "unknown@example.com",
        first_name: "Test",
        last_name: "User",
      };

      const result = await settingsService.updateUserProfile(profile);
      setResult({ profileCreated: result });
    } catch (error) {
      setResult({ error });
    } finally {
      setIsLoading(false);
    }
  };

  const initializeDatabase = async () => {
    setIsLoading(true);
    try {
      // Execute the SQL directly through Supabase
      const { error } = await supabase.rpc("exec", {
        query: CREATE_TABLES_SQL,
      });

      if (error) {
        throw error;
      }

      setResult({
        message: "Database tables have been initialized",
        tables:
          "All required tables should now be created with proper RLS policies",
      });

      // Verify by running debug
      await runDebug();
    } catch (error) {
      setResult({
        error: error,
        message:
          "Failed to initialize database. Try running the SQL fix script manually in Supabase.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-slate-50">
      <h2 className="text-lg font-bold mb-4">Database Debugger</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        <Button onClick={runDebug} disabled={isLoading}>
          {isLoading ? "Running..." : "Check Database Status"}
        </Button>

        <Button
          onClick={createUserProfile}
          disabled={isLoading}
          variant="secondary"
        >
          Create Test Profile
        </Button>

        <Button
          onClick={initializeDatabase}
          disabled={isLoading}
          variant="destructive"
        >
          Initialize Database Tables
        </Button>
      </div>

      {result && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">Results:</h3>
          <pre className="bg-slate-800 text-slate-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
