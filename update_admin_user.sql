-- Create and update multiple user profiles
-- Run this in Supabase SQL Editor after creating the users and updating role constraints

-- First, check if the users exist in auth.users
SELECT id, email FROM auth.users WHERE email IN ('superadmin@admin.com', 'admin@admin.com', 'doctor@doctor.com');

-- Update or insert the super admin user's profile
INSERT INTO profiles (id, email, full_name, role)
SELECT id, email, 'Super Admin User', 'super_admin'
FROM auth.users 
WHERE email = 'superadmin@admin.com'
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'super_admin',
  full_name = 'Super Admin User',
  updated_at = NOW();

-- Update or insert the admin user's profile
INSERT INTO profiles (id, email, full_name, role)
SELECT id, email, 'Admin User', 'admin'
FROM auth.users 
WHERE email = 'admin@admin.com'
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'admin',
  full_name = 'Admin User',
  updated_at = NOW();

-- Update or insert the doctor user's profile
INSERT INTO profiles (id, email, full_name, role)
SELECT id, email, 'Dr. John Smith', 'doctor'
FROM auth.users 
WHERE email = 'doctor@doctor.com'
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'doctor',
  full_name = 'Dr. John Smith',
  updated_at = NOW();

-- Verify all updates
SELECT p.id, p.email, p.full_name, p.role 
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email IN ('superadmin@admin.com', 'admin@admin.com', 'doctor@doctor.com')
ORDER BY p.role;
