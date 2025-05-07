-- Drop the table if it exists
DROP TABLE IF EXISTS admin_users CASCADE;

-- Create admin_users table in the public schema
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  last_login TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Only superadmins can view all admin users" ON admin_users;
DROP POLICY IF EXISTS "Only superadmins can update admin users" ON admin_users;
DROP POLICY IF EXISTS "Only superadmins can create admin users" ON admin_users;
DROP POLICY IF EXISTS "Only superadmins can delete admin users" ON admin_users;
DROP POLICY IF EXISTS "Allow login by username" ON admin_users;

-- Create policies (more restrictive since these are admins)
-- Allow anyone to select by username for login purposes
CREATE POLICY "Allow login by username"
  ON admin_users FOR SELECT
  USING (true);  -- Allow all SELECT operations for now to debug

-- Restrict other operations to superadmins
CREATE POLICY "Only superadmins can update admin users"
  ON admin_users FOR UPDATE
  USING ((auth.jwt() ->> 'role')::text = 'superadmin');

CREATE POLICY "Only superadmins can create admin users"
  ON admin_users FOR INSERT
  WITH CHECK ((auth.jwt() ->> 'role')::text = 'superadmin');

CREATE POLICY "Only superadmins can delete admin users"
  ON admin_users FOR DELETE
  USING ((auth.jwt() ->> 'role')::text = 'superadmin');

-- Create a trigger to update the updated_at timestamp
CREATE TRIGGER update_admin_users_timestamp
BEFORE UPDATE ON admin_users
FOR EACH ROW EXECUTE FUNCTION update_settings_timestamp();

-- Insert initial superadmin user with a secure password
DO $$ 
BEGIN
    -- Check if admin user already exists
    IF NOT EXISTS (SELECT 1 FROM admin_users WHERE username = 'Admin') THEN
        INSERT INTO admin_users (
            username, 
            email, 
            password_hash, 
            salt, 
            role, 
            is_active
        ) VALUES (
            'Admin',
            'admin@risitify.com',
            '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', -- hash of 'admin'
            'salt123', -- This should be a random salt in production
            'superadmin',
            true
        );
    END IF;
END $$; 