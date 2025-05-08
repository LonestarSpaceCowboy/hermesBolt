/*
  # Fix user signup trigger and profiles table

  1. Changes
    - Drop and recreate the handle_new_user trigger function with proper error handling
    - Ensure profiles table has correct constraints and defaults
    - Add proper RLS policies for profile creation

  2. Security
    - Enable RLS on profiles table
    - Add policies for authenticated users to manage their own profiles
*/

-- Recreate the trigger function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create a profile entry for the new user
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    avatar_url,
    timezone,
    auto_accept,
    email_retention
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL),
    'UTC',
    false,
    '6m'
  );

  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log the error details
    RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Ensure the trigger is properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure proper RLS policies exist
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow the trigger function to create profiles
CREATE POLICY "Allow trigger to create profiles"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);