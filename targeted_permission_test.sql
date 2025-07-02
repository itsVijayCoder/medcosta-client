-- Targeted Permission Test
-- Run this in Supabase SQL Editor

-- Step 1: Check who is currently authenticated in SQL Editor
SELECT 'Current SQL Session:' as test,
  auth.uid() as current_user_id,
  auth.email() as current_email,
  auth.role() as auth_role;

-- Step 2: Check if the superadmin user exists and has correct role
SELECT 'Superadmin Profile:' as test,
  p.id,
  p.email,
  p.role,
  u.email as auth_email
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.email = 'superadmin@admin.com';

-- Step 3: Test the permission logic with the actual superadmin user ID
SELECT 'Permission Test with Superadmin ID:' as test,
  p.id as user_id,
  p.email,
  p.role,
  CASE 
    WHEN p.role IN ('super_admin', 'admin', 'doctor', 'nurse', 'receptionist') THEN true 
    ELSE false 
  END as should_have_permission
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.email = 'superadmin@admin.com';

-- Step 4: Check if RLS is enabled on patients table
SELECT 'RLS Status:' as test,
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'patients';

-- Step 5: Test a simple select on patients table
-- This will show if RLS is blocking access
SELECT 'Patients Table Access Test:' as test,
  COUNT(*) as patient_count
FROM patients;
