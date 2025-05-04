-- Drop the table if it exists with an error
DROP TABLE IF EXISTS session_history;

-- Create the table correctly
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

-- Create policies
DROP POLICY IF EXISTS "Users can view their own session history" ON session_history;
CREATE POLICY "Users can view their own session history"
  ON session_history FOR SELECT
  USING (auth.uid() = user_id);

-- Create triggers for timestamp updates
DROP TRIGGER IF EXISTS update_session_history_timestamp ON session_history;
CREATE TRIGGER update_session_history_timestamp
BEFORE UPDATE ON session_history
FOR EACH ROW EXECUTE FUNCTION update_settings_timestamp(); 