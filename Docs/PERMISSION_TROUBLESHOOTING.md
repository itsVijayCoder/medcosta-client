# PERMISSION TROUBLESHOOTING GUIDE

## Issue

Patient creation fails with permission-related errors. User authentication and
profile permissions need to be verified and fixed.

## Step 1: Debug Current State

Run this in **Supabase SQL Editor** to check the current authentication state:

```sql
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
```

## Step 2: Fix Profile (if needed)

If the superadmin profile is missing or incorrect, run this in **Supabase SQL
Editor**:

```sql
-- Force delete and recreate the profile
DELETE FROM profiles WHERE email = 'superadmin@admin.com';

-- Insert fresh profile with correct data
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

-- Verify profile was created correctly
SELECT 'Profile Verification:' as step, id, email, full_name, role, created_at
FROM profiles
WHERE email = 'superadmin@admin.com';
```

## Step 3: Create Permission Test Function

Run this in **Supabase SQL Editor** to create a test function:

```sql
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
```

## Step 4: Test from Frontend

1. **Log in** to the application with `superadmin@admin.com`
2. **Navigate** to Patient Registration page
3. **Click** the "🔐 Test Permissions" button (added to the top right)
4. **Check console logs** and the alert popup for permission details

## Step 5: Verify RLS Policies

Run this in **Supabase SQL Editor** to check RLS policies:

```sql
-- Check RLS policies for patients table
SELECT 'RLS Policy Test:' as section,
  policy_name,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'patients';

-- Check if RLS is enabled
SELECT 'RLS Status:' as section,
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'patients';
```

## Step 6: Manual Permission Test

Run this in **Supabase SQL Editor** while logged in as superadmin:

```sql
-- Test manual permission check
SELECT 'Manual Permission Check:' as section,
  auth.uid() as current_user,
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('super_admin', 'admin', 'doctor', 'nurse', 'receptionist')
  ) as has_permission,
  (SELECT role FROM profiles WHERE id = auth.uid()) as user_role;
```

## Expected Results

-  ✅ **Auth user exists** for `superadmin@admin.com`
-  ✅ **Profile exists** with `role = 'super_admin'`
-  ✅ **Permission test returns `true`**
-  ✅ **Frontend test button shows "PASS"**
-  ✅ **Patient creation works**

## Common Issues & Solutions

### Issue: Profile doesn't exist

**Solution**: Run Step 2 to recreate the profile

### Issue: Permission test returns false

**Solution**:

1. Check if user is logged in (`auth.uid()` returns a value)
2. Verify profile role is one of the healthcare roles
3. Run Step 2 to fix profile

### Issue: RLS policies blocking access

**Solution**: Verify policies allow healthcare staff roles

### Issue: Frontend test fails

**Solution**:

1. Check browser console for detailed error logs
2. Verify Supabase connection
3. Ensure user is properly authenticated

## Files Modified

1. `create_permission_test_function.sql` - SQL function for testing
2. `debug_authentication.sql` - Debugging queries
3. `force_fix_profile.sql` - Profile fix script
4. `src/services/patientService.js` - Added permission testing
5. `src/pages/PatientRegistration.jsx` - Added test button

## Next Steps

After completing all steps:

1. Try creating a patient through the form
2. Verify real-time updates work
3. Test with different user roles (admin, doctor)
4. Confirm all CRUD operations work properly
