-- Fix RLS policies and user permissions
-- Run this in Supabase SQL Editor

-- First, check the current user's profile
SELECT p.id, p.email, p.full_name, p.role, u.email as auth_email
FROM profiles p
RIGHT JOIN auth.users u ON p.id = u.id
WHERE u.email = 'superadmin@admin.com';

-- If the profile doesn't exist or has wrong role, create/update it
INSERT INTO profiles (id, email, full_name, role)
SELECT id, email, 'Super Admin User', 'super_admin'
FROM auth.users 
WHERE email = 'superadmin@admin.com'
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'super_admin',
  full_name = 'Super Admin User',
  updated_at = NOW();

-- Drop and recreate patients policies with better permissions
DROP POLICY IF EXISTS "Healthcare staff can view patients" ON patients;
DROP POLICY IF EXISTS "Staff can manage patients" ON patients;

-- Create more permissive policies for patient management
CREATE POLICY "Authenticated users can view patients" ON patients
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Healthcare staff can insert patients" ON patients
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('super_admin', 'admin', 'doctor', 'nurse', 'receptionist')
    )
  );

CREATE POLICY "Healthcare staff can update patients" ON patients
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('super_admin', 'admin', 'doctor', 'nurse', 'receptionist')
    )
  );

CREATE POLICY "Healthcare staff can delete patients" ON patients
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('super_admin', 'admin', 'doctor')
    )
  );

-- Fix patient_insurance policies
DROP POLICY IF EXISTS "Staff can view patient insurance" ON patient_insurance;
DROP POLICY IF EXISTS "Staff can manage patient insurance" ON patient_insurance;

CREATE POLICY "Authenticated users can view patient insurance" ON patient_insurance
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Healthcare staff can manage patient insurance" ON patient_insurance
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('super_admin', 'admin', 'doctor', 'nurse', 'receptionist')
    )
  );

-- Fix patient_employers policies
DROP POLICY IF EXISTS "Staff can view patient employers" ON patient_employers;
DROP POLICY IF EXISTS "Staff can manage patient employers" ON patient_employers;

CREATE POLICY "Authenticated users can view patient employers" ON patient_employers
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Healthcare staff can manage patient employers" ON patient_employers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('super_admin', 'admin', 'doctor', 'nurse', 'receptionist')
    )
  );

-- Verify the user's profile is correctly set
SELECT 'User Profile Check:' as check_type, p.id, p.email, p.full_name, p.role 
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'superadmin@admin.com';

-- Test the policy (this should return true if the user has permission)
SELECT 'Permission Test:' as check_type,
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('super_admin', 'admin', 'doctor', 'nurse', 'receptionist')
  ) as has_permission;
