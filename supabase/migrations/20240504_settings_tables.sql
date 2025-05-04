-- Create tables in the public schema for better compatibility
-- with the Supabase JavaScript client

-- ==========================================================
-- USER PROFILES TABLE
-- ==========================================================
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

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- ==========================================================
-- COMPANY SETTINGS TABLE
-- ==========================================================
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

-- Enable Row Level Security
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own company settings" ON company_settings;
DROP POLICY IF EXISTS "Users can update their own company settings" ON company_settings;
DROP POLICY IF EXISTS "Users can insert their own company settings" ON company_settings;

-- Create policies
CREATE POLICY "Users can view their own company settings"
  ON company_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own company settings"
  ON company_settings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own company settings"
  ON company_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ==========================================================
-- BILLING SETTINGS TABLE
-- ==========================================================
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

-- Enable Row Level Security
ALTER TABLE billing_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own billing settings" ON billing_settings;
DROP POLICY IF EXISTS "Users can update their own billing settings" ON billing_settings;
DROP POLICY IF EXISTS "Users can insert their own billing settings" ON billing_settings;

-- Create policies
CREATE POLICY "Users can view their own billing settings"
  ON billing_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own billing settings"
  ON billing_settings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own billing settings"
  ON billing_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ==========================================================
-- PAYMENT METHODS TABLE
-- ==========================================================
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_type TEXT NOT NULL, -- 'credit_card', 'bank_account', etc.
  provider TEXT NOT NULL, -- 'visa', 'mastercard', 'stripe', etc.
  last_four TEXT, -- Last four digits of card or account
  expiry_date DATE, -- For credit cards
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own payment methods" ON payment_methods;
DROP POLICY IF EXISTS "Users can update their own payment methods" ON payment_methods;
DROP POLICY IF EXISTS "Users can insert their own payment methods" ON payment_methods;
DROP POLICY IF EXISTS "Users can delete their own payment methods" ON payment_methods;

-- Create policies
CREATE POLICY "Users can view their own payment methods"
  ON payment_methods FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment methods"
  ON payment_methods FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment methods"
  ON payment_methods FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payment methods"
  ON payment_methods FOR DELETE
  USING (auth.uid() = user_id);

-- ==========================================================
-- NOTIFICATION PREFERENCES TABLE
-- ==========================================================
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_notifications BOOLEAN DEFAULT true,
  client_activity BOOLEAN DEFAULT true,
  project_updates BOOLEAN DEFAULT false,
  marketing_tips BOOLEAN DEFAULT false,
  email_frequency TEXT DEFAULT 'immediate', -- 'immediate', 'daily', 'weekly'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own notification preferences" ON notification_preferences;
DROP POLICY IF EXISTS "Users can update their own notification preferences" ON notification_preferences;
DROP POLICY IF EXISTS "Users can insert their own notification preferences" ON notification_preferences;

-- Create policies
CREATE POLICY "Users can view their own notification preferences"
  ON notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification preferences"
  ON notification_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notification preferences"
  ON notification_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ==========================================================
-- SECURITY SETTINGS TABLE
-- ==========================================================
CREATE TABLE IF NOT EXISTS security_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  two_factor_enabled BOOLEAN DEFAULT false,
  last_password_change TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE security_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own security settings" ON security_settings;
DROP POLICY IF EXISTS "Users can update their own security settings" ON security_settings;
DROP POLICY IF EXISTS "Users can insert their own security settings" ON security_settings;

-- Create policies
CREATE POLICY "Users can view their own security settings"
  ON security_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own security settings"
  ON security_settings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own security settings"
  ON security_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ==========================================================
-- SESSION HISTORY TABLE
-- ==========================================================
CREATE TABLE IF NOT EXISTS session_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device TEXT,
  browser TEXT,
  os TEXT,
  ip_address TEXT,
  location TEXT,
  login_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  logout_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE session_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own session history" ON session_history;

-- Create policies
CREATE POLICY "Users can view their own session history"
  ON session_history FOR SELECT
  USING (auth.uid() = user_id);

-- ==========================================================
-- TRIGGERS FOR UPDATED_AT
-- ==========================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for each table
DROP TRIGGER IF EXISTS update_user_profiles_timestamp ON user_profiles;
CREATE TRIGGER update_user_profiles_timestamp
BEFORE UPDATE ON user_profiles
FOR EACH ROW EXECUTE FUNCTION update_settings_timestamp();

DROP TRIGGER IF EXISTS update_company_settings_timestamp ON company_settings;
CREATE TRIGGER update_company_settings_timestamp
BEFORE UPDATE ON company_settings
FOR EACH ROW EXECUTE FUNCTION update_settings_timestamp();

DROP TRIGGER IF EXISTS update_billing_settings_timestamp ON billing_settings;
CREATE TRIGGER update_billing_settings_timestamp
BEFORE UPDATE ON billing_settings
FOR EACH ROW EXECUTE FUNCTION update_settings_timestamp();

DROP TRIGGER IF EXISTS update_payment_methods_timestamp ON payment_methods;
CREATE TRIGGER update_payment_methods_timestamp
BEFORE UPDATE ON payment_methods
FOR EACH ROW EXECUTE FUNCTION update_settings_timestamp();

DROP TRIGGER IF EXISTS update_notification_preferences_timestamp ON notification_preferences;
CREATE TRIGGER update_notification_preferences_timestamp
BEFORE UPDATE ON notification_preferences
FOR EACH ROW EXECUTE FUNCTION update_settings_timestamp();

DROP TRIGGER IF EXISTS update_security_settings_timestamp ON security_settings;
CREATE TRIGGER update_security_settings_timestamp
BEFORE UPDATE ON security_settings
FOR EACH ROW EXECUTE FUNCTION update_settings_timestamp();