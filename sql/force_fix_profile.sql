-- Comprehensive fix for user permissions
-- Run this step by step in Supabase SQL Editor

-- Step 1: Check what exists
SELECT 'Step 1 - Auth Users:' as step, id, email, created_at 
FROM auth.users 
WHERE email = 'superadmin@admin.com';

SELECT 'Step 1 - Existing Profiles:' as step, id, email, full_name, role 
FROM profiles 
WHERE email = 'superadmin@admin.com';

-- Step 2: Force delete and recreate the profile
DELETE FROM profiles WHERE email = 'superadmin@admin.com';

-- Step 3: Insert fresh profile with correct data
INSERT INTO profiles (id, email, full_name, role, avatar_url, created_at, updated_at)
SELECT 
    id, 
    email, 
    'Super Admin User', 
    'super_admin',
    null,
    NOW(),
    NOW()
FROM auth.users 
WHERE email = 'superadmin@admin.com';

-- Step 4: Verify profile was created correctly
SELECT 'Step 4 - Profile Verification:' as step, id, email, full_name, role, created_at 
FROM profiles 
WHERE email = 'superadmin@admin.com';

-- Step 5: Test the permission check again
SELECT 'Step 5 - Permission Test:' as step,
  auth.uid() as current_user_id,
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('super_admin', 'admin', 'doctor', 'nurse', 'receptionist')
  ) as has_permission;

-- Step 6: Check if the specific user has permission (using their actual ID)
SELECT 'Step 6 - Direct Permission Check:' as step,
  p.id,
  p.email,
  p.role,
  CASE 
    WHEN p.role IN ('super_admin', 'admin', 'doctor', 'nurse', 'receptionist') THEN true 
    ELSE false 
  END as should_have_permission
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'superadmin@admin.com';
