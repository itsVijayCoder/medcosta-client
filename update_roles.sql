-- Update role constraints to include super_admin
-- Run this in Supabase SQL Editor

-- Drop existing constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Add new constraint with super_admin role
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('super_admin', 'admin', 'doctor', 'nurse', 'receptionist', 'user'));

-- Update RLS policies to include super_admin permissions
DROP POLICY IF EXISTS "Super admins can manage all settings" ON system_settings;

CREATE POLICY "Super admins can manage all settings" ON system_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('super_admin', 'admin')
    )
  );

-- Add super_admin permissions to other tables
DROP POLICY IF EXISTS "Super admins can manage locations" ON locations;
CREATE POLICY "Super admins can manage locations" ON locations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin', 'doctor')
    )
  );

DROP POLICY IF EXISTS "Super admins can manage deleted visits" ON deleted_visits;
CREATE POLICY "Super admins can manage deleted visits" ON deleted_visits
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin', 'doctor')
    )
  );
