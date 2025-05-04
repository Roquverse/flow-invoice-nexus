-- Script to fix and verify settings tables
SET search_path TO public;

-- Check if tables exist in public schema
DO $$
DECLARE
  table_count INTEGER;
BEGIN
  -- Check user_profiles
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables
  WHERE table_schema = 'public' AND table_name = 'user_profiles';

  IF table_count = 0 THEN
    RAISE NOTICE 'Table user_profiles does not exist in public schema. Creating it...';
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
  ELSE
    RAISE NOTICE 'Table user_profiles exists in public schema';
    
    -- Verify RLS policies
    DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
    
    -- Recreate policies to ensure they are set correctly
    CREATE POLICY "Users can view their own profile"
      ON user_profiles FOR SELECT
      USING (auth.uid() = id);

    CREATE POLICY "Users can update their own profile"
      ON user_profiles FOR UPDATE
      USING (auth.uid() = id);
      
    CREATE POLICY "Users can insert their own profile"
      ON user_profiles FOR INSERT
      WITH CHECK (auth.uid() = id);
  END IF;

  -- Check company_settings table
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables
  WHERE table_schema = 'public' AND table_name = 'company_settings';
  
  IF table_count = 0 THEN
    RAISE NOTICE 'Table company_settings does not exist in public schema. Creating it...';
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
  ELSE
    RAISE NOTICE 'Table company_settings exists in public schema';
    
    -- Verify RLS policies
    DROP POLICY IF EXISTS "Users can view their own company settings" ON company_settings;
    DROP POLICY IF EXISTS "Users can update their own company settings" ON company_settings;
    DROP POLICY IF EXISTS "Users can insert their own company settings" ON company_settings;
    
    -- Recreate policies to ensure they are set correctly
    CREATE POLICY "Users can view their own company settings"
      ON company_settings FOR SELECT
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can update their own company settings"
      ON company_settings FOR UPDATE
      USING (auth.uid() = user_id);
      
    CREATE POLICY "Users can insert their own company settings"
      ON company_settings FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Check billing_settings table
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables
  WHERE table_schema = 'public' AND table_name = 'billing_settings';
  
  IF table_count = 0 THEN
    RAISE NOTICE 'Table billing_settings does not exist in public schema. Creating it...';
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
  ELSE
    RAISE NOTICE 'Table billing_settings exists in public schema';
  END IF;
  
  -- Check notification_preferences table
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables
  WHERE table_schema = 'public' AND table_name = 'notification_preferences';
  
  IF table_count = 0 THEN
    RAISE NOTICE 'Table notification_preferences does not exist in public schema. Creating it...';
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

    -- Enable Row Level Security
    ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

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
  ELSE
    RAISE NOTICE 'Table notification_preferences exists in public schema';
  END IF;
  
  -- Check security_settings table
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables
  WHERE table_schema = 'public' AND table_name = 'security_settings';
  
  IF table_count = 0 THEN
    RAISE NOTICE 'Table security_settings does not exist in public schema. Creating it...';
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
  ELSE
    RAISE NOTICE 'Table security_settings exists in public schema';
  END IF;
END $$;

-- Create trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers if they don't exist
DO $$
BEGIN
  -- user_profiles trigger
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_user_profiles_timestamp'
  ) THEN
    CREATE TRIGGER update_user_profiles_timestamp
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_settings_timestamp();
  END IF;
  
  -- company_settings trigger
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_company_settings_timestamp'
  ) THEN
    CREATE TRIGGER update_company_settings_timestamp
    BEFORE UPDATE ON company_settings
    FOR EACH ROW EXECUTE FUNCTION update_settings_timestamp();
  END IF;
  
  -- Add triggers for other tables
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_billing_settings_timestamp'
  ) THEN
    CREATE TRIGGER update_billing_settings_timestamp
    BEFORE UPDATE ON billing_settings
    FOR EACH ROW EXECUTE FUNCTION update_settings_timestamp();
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_notification_preferences_timestamp'
  ) THEN
    CREATE TRIGGER update_notification_preferences_timestamp
    BEFORE UPDATE ON notification_preferences
    FOR EACH ROW EXECUTE FUNCTION update_settings_timestamp();
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_security_settings_timestamp'
  ) THEN
    CREATE TRIGGER update_security_settings_timestamp
    BEFORE UPDATE ON security_settings
    FOR EACH ROW EXECUTE FUNCTION update_settings_timestamp();
  END IF;
END $$; 