-- Update admin user profile
-- Run this in Supabase SQL Editor after creating the admin user

-- First, check if the user exists in auth.users
SELECT id, email FROM auth.users WHERE email = 'admin@admin.com';

-- Update or insert the user's profile with admin role
INSERT INTO profiles (id, email, full_name, role)
SELECT id, email, 'Admin User', 'admin'
FROM auth.users 
WHERE email = 'admin@admin.com'
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'admin',
  full_name = 'Admin User',
  updated_at = NOW();

-- Verify the update
SELECT p.id, p.email, p.full_name, p.role 
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'admin@admin.com';
