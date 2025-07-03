-- Simple test to debug profile and permissions
-- Run this in Supabase SQL Editor

-- Check if the user exists in auth.users
SELECT 'Auth Users:' as table_name, id, email, created_at 
FROM auth.users 
WHERE email = 'superadmin@admin.com';

-- Check if profile exists
SELECT 'Profiles:' as table_name, id, email, full_name, role, created_at 
FROM profiles 
WHERE email = 'superadmin@admin.com';

-- Get current user context
SELECT 'Current User:' as context, auth.uid() as current_user_id, auth.role() as current_role;

-- Force create/update profile with explicit UUID (if needed)
DO $$
DECLARE
    user_uuid UUID;
BEGIN
    -- Get the user UUID
    SELECT id INTO user_uuid FROM auth.users WHERE email = 'superadmin@admin.com';
    
    IF user_uuid IS NOT NULL THEN
        -- Insert or update profile
        INSERT INTO profiles (id, email, full_name, role)
        VALUES (user_uuid, 'superadmin@admin.com', 'Super Admin User', 'super_admin')
        ON CONFLICT (id) 
        DO UPDATE SET 
            role = 'super_admin',
            full_name = 'Super Admin User',
            email = 'superadmin@admin.com',
            updated_at = NOW();
            
        RAISE NOTICE 'Profile created/updated for user: %', user_uuid;
    ELSE
        RAISE NOTICE 'User not found in auth.users table';
    END IF;
END $$;

-- Verify profile was created
SELECT 'Final Profile Check:' as check_type, id, email, full_name, role 
FROM profiles 
WHERE email = 'superadmin@admin.com';
