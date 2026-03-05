-- Migration script to add first_name and last_name to profiles table
-- Run this in Supabase SQL editor

-- Step 1: Add new columns if they don't exist
DO $$
BEGIN
    -- Add first_name column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'first_name'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE profiles ADD COLUMN first_name text;
    END IF;

    -- Add last_name column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'last_name'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE profiles ADD COLUMN last_name text;
    END IF;
END $$;

-- Step 2: Update existing profiles with default empty values (since we can't access auth metadata directly)
UPDATE profiles 
SET 
    first_name = COALESCE(first_name, ''),
    last_name = COALESCE(last_name, '')
WHERE first_name IS NULL OR last_name IS NULL;

-- Step 3: Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "profiles select own" ON profiles;
DROP POLICY IF EXISTS "profiles upsert own" ON profiles;
DROP POLICY IF EXISTS "profiles update own" ON profiles;

-- Step 4: Recreate RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles select own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles upsert own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles update own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Success message
SELECT 'Migration completed successfully!' as result;
