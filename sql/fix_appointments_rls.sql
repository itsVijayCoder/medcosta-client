-- Fix appointments RLS policies
-- Run this in Supabase SQL Editor

-- First, check current user profile and role
SELECT 'Current User Profile:' as test, id, role, email, created_at
FROM profiles 
WHERE id = auth.uid();

-- Check if user exists in auth.users
SELECT 'Auth User Check:' as test, id, email, email_confirmed_at, role as auth_role
FROM auth.users 
WHERE id = auth.uid();

-- Update user role to admin if not set properly
UPDATE profiles 
SET role = 'admin' 
WHERE id = auth.uid() 
AND (role IS NULL OR role NOT IN ('admin', 'doctor', 'nurse', 'receptionist'));

-- Drop existing appointments policies
DROP POLICY IF EXISTS "Staff can view appointments" ON appointments;
DROP POLICY IF EXISTS "Staff can manage appointments" ON appointments;

-- Create more permissive policies for appointments
CREATE POLICY "Authenticated users can view appointments" ON appointments
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create appointments" ON appointments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update appointments" ON appointments
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete appointments" ON appointments
  FOR DELETE USING (auth.role() = 'authenticated');

-- Verify the policies were created
SELECT 'Appointments Policies Check:' as test, schemaname, tablename, policyname, permissive, cmd, qual
FROM pg_policies 
WHERE tablename = 'appointments';

-- Verify current user profile after update
SELECT 'Updated User Profile:' as test, id, role, email, created_at
FROM profiles 
WHERE id = auth.uid();
