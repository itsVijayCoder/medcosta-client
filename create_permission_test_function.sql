-- Create a simple permission test function
-- Run this in Supabase SQL Editor

-- Create a function to test permissions
CREATE OR REPLACE FUNCTION test_user_permission()
RETURNS TABLE(
  user_id UUID,
  user_email TEXT,
  profile_exists BOOLEAN,
  profile_role TEXT,
  has_healthcare_role BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    auth.uid() as user_id,
    auth.email() as user_email,
    EXISTS(SELECT 1 FROM profiles WHERE id = auth.uid()) as profile_exists,
    COALESCE((SELECT role FROM profiles WHERE id = auth.uid()), 'none') as profile_role,
    EXISTS(
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'admin', 'doctor', 'nurse', 'receptionist')
    ) as has_healthcare_role;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION test_user_permission() TO authenticated;

-- Test the function
SELECT * FROM test_user_permission();
