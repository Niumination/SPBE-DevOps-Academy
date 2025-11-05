-- Fix RLS Policies for Users Table
-- Add missing INSERT policy for users table

-- Users can insert their own profile (during signup)
-- Drop policy if exists first, then recreate
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Fix activities table name mismatch
-- The code is trying to access 'activities' table but schema has 'activity_logs'
DROP POLICY IF EXISTS "Users can insert own activity logs" ON activity_logs;
CREATE POLICY "Users can insert own activity logs" ON activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);