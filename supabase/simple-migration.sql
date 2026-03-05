-- Simple migration script - run this step by step in Supabase SQL Editor

-- Step 1: Add first_name column (run this first)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS first_name text;

-- Step 2: Add last_name column (run this after step 1)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_name text;

-- Step 3: Update NULL values to empty strings (run this after step 2)
UPDATE profiles SET first_name = '' WHERE first_name IS NULL;

-- Step 4: Update NULL last_name to empty strings (run this after step 3)
UPDATE profiles SET last_name = '' WHERE last_name IS NULL;

-- Step 5: Drop existing policies (run this after step 4)
DROP POLICY IF EXISTS "profiles select own" ON profiles;
DROP POLICY IF EXISTS "profiles upsert own" ON profiles;
DROP POLICY IF EXISTS "profiles update own" ON profiles;

-- Step 6: Recreate policies (run this after step 5)
CREATE POLICY "profiles select own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles upsert own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles update own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Success message
SELECT 'Migration completed successfully!' as result;
