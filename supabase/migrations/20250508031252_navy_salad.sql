/*
  # Initial Schema Setup

  1. Tables
    - profiles: User profiles with preferences
    - email_accounts: Connected email accounts
    - calendar_accounts: Connected calendar accounts
    - events: Calendar events
    - tasks: To-do items
    - incoming_requests: Pending commitments to review
    - emails: Stored email data
    - app_settings: Global application settings

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add admin-only policies for app settings

  3. Automation
    - Add triggers for updated_at timestamps
    - Add trigger for new user profile creation
*/

-- Create extension for vector operations
CREATE EXTENSION IF NOT EXISTS vector;

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  home_address TEXT,
  work_address TEXT,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  auto_accept BOOLEAN NOT NULL DEFAULT FALSE,
  email_retention TEXT NOT NULL DEFAULT '6m' CHECK (email_retention IN ('3m', '6m', '1y')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create email_accounts table
CREATE TABLE IF NOT EXISTS email_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  email TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create calendar_accounts table
CREATE TABLE IF NOT EXISTS calendar_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  name TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location TEXT,
  is_remote BOOLEAN NOT NULL DEFAULT FALSE,
  category TEXT NOT NULL,
  importance TEXT NOT NULL DEFAULT 'medium' CHECK (importance IN ('low', 'medium', 'high')),
  calendar_id UUID REFERENCES calendar_accounts(id) ON DELETE SET NULL,
  calendar_event_id TEXT,
  email_source_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  importance TEXT NOT NULL DEFAULT 'medium' CHECK (importance IN ('low', 'medium', 'high')),
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  email_source_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create incoming_requests table
CREATE TABLE IF NOT EXISTS incoming_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('event', 'task')),
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  location TEXT,
  is_remote BOOLEAN,
  category TEXT NOT NULL,
  importance TEXT NOT NULL DEFAULT 'medium' CHECK (importance IN ('low', 'medium', 'high')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  email_source_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create emails table
CREATE TABLE IF NOT EXISTS emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  email_account_id UUID NOT NULL REFERENCES email_accounts(id) ON DELETE CASCADE,
  external_id TEXT NOT NULL,
  sender TEXT NOT NULL,
  recipient TEXT[] NOT NULL,
  subject TEXT NOT NULL,
  body_text TEXT NOT NULL,
  body_html TEXT,
  received_at TIMESTAMPTZ NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT FALSE,
  embedding vector(1536),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create app_settings table
CREATE TABLE IF NOT EXISTS app_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  hero_text TEXT NOT NULL DEFAULT 'Are missed emails costing you trust, opportunities, and peace of mind? Hermes instantly turns your emails into calendar appointments, ensuring you never miss another crucial moment.',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE incoming_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create policies for email_accounts
CREATE POLICY "Users can view their own email accounts"
  ON email_accounts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own email accounts"
  ON email_accounts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own email accounts"
  ON email_accounts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own email accounts"
  ON email_accounts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for calendar_accounts
CREATE POLICY "Users can view their own calendar accounts"
  ON calendar_accounts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own calendar accounts"
  ON calendar_accounts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calendar accounts"
  ON calendar_accounts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calendar accounts"
  ON calendar_accounts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for events
CREATE POLICY "Users can view their own events"
  ON events FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own events"
  ON events FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events"
  ON events FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for tasks
CREATE POLICY "Users can view their own tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for incoming_requests
CREATE POLICY "Users can view their own requests"
  ON incoming_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own requests"
  ON incoming_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own requests"
  ON incoming_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own requests"
  ON incoming_requests FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for emails
CREATE POLICY "Users can view their own emails"
  ON emails FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own emails"
  ON emails FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own emails"
  ON emails FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own emails"
  ON emails FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for app_settings (admin only)
CREATE POLICY "Anyone can view app settings"
  ON app_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only admins can modify app settings"
  ON app_settings FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM profiles WHERE email = 'admin@hermesapp.com'));

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_accounts_updated_at
  BEFORE UPDATE ON email_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calendar_accounts_updated_at
  BEFORE UPDATE ON calendar_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_incoming_requests_updated_at
  BEFORE UPDATE ON incoming_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emails_updated_at
  BEFORE UPDATE ON emails
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_app_settings_updated_at
  BEFORE UPDATE ON app_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create a function to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function when a user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Insert default app settings
INSERT INTO app_settings (hero_text)
VALUES ('Are missed emails costing you trust, opportunities, and peace of mind? Hermes instantly turns your emails into calendar appointments, ensuring you never miss another crucial moment.')
ON CONFLICT (id) DO NOTHING;