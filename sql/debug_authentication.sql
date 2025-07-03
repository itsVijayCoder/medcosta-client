-- Debug Authentication and Permissions
-- Run each section separately in Supabase SQL Editor

-- Section 1: Check all users and profiles
SELECT 'All Auth Users:' as section, id, email, email_confirmed_at, created_at 
FROM auth.users 
ORDER BY created_at DESC;

SELECT 'All Profiles:' as section, id, email, full_name, role, created_at 
FROM profiles 
ORDER BY created_at DESC;

-- Section 2: Check current authenticated user
SELECT 'Current User Check:' as section,
  auth.uid() as current_user_id,
  auth.email() as current_email,
  auth.role() as current_auth_role;

-- Section 3: Check superadmin specifically
SELECT 'Superadmin User Check:' as section,
  u.id as user_id,
  u.email,
  u.email_confirmed_at,
  u.created_at as user_created,
  p.id as profile_id,
  p.full_name,
  p.role as profile_role,
  p.created_at as profile_created
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'superadmin@admin.com';

-- Section 4: Test RLS policies for patients table
SELECT 'RLS Policy Test:' as section,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'patients';

-- Section 5: Manually check if profile exists for superadmin
SELECT 'Manual Profile Check:' as section,
  COUNT(*) as profile_count,
  ARRAY_AGG(role) as roles_found
FROM profiles 
WHERE email = 'superadmin@admin.com';
