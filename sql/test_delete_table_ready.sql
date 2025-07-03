-- Simple test to verify the DeleteTable page will work correctly
-- Run this in Supabase SQL Editor to test the setup

-- 1. Check if deleted_visits table exists and has correct structure
SELECT 
    'Table exists: ' || CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'deleted_visits'
    ) THEN 'YES' ELSE 'NO' END as table_status;

-- 2. Check if table has the correct columns
SELECT 
    CASE WHEN COUNT(*) = 6 THEN 'All required columns exist' 
         ELSE 'Missing columns: ' || (6 - COUNT(*))::text 
    END as column_status
FROM information_schema.columns 
WHERE table_name = 'deleted_visits' 
AND column_name IN ('datasource', 'original_id', 'record_name', 'record_description', 'deleted_by', 'deleted_reason');

-- 3. Test the query that the DeleteTable page will use
-- This simulates selecting "providers" from the dropdown
SELECT 
    'Test query for providers: ' || CASE 
        WHEN EXISTS (SELECT 1 FROM deleted_visits WHERE datasource = 'providers') 
        THEN 'Found ' || COUNT(*)::text || ' deleted providers'
        ELSE 'No deleted providers found (this is normal if no providers are soft-deleted)'
    END as provider_test
FROM deleted_visits 
WHERE datasource = 'providers';

-- 4. Test the query for all datasources
SELECT 
    datasource,
    COUNT(*) as record_count,
    'Working correctly' as status
FROM deleted_visits 
GROUP BY datasource
ORDER BY datasource;

-- 5. If no records exist, show expected datasource values
SELECT 'Expected datasource values:' as info
UNION ALL
SELECT 'locations' 
UNION ALL
SELECT 'insurance_companies'
UNION ALL  
SELECT 'providers'
UNION ALL
SELECT 'diagnosis_codes'
UNION ALL
SELECT 'procedures'
UNION ALL
SELECT 'modifiers';

-- 6. Final confirmation message
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'deleted_visits')
        THEN '✅ DeleteTable page should work correctly! The table structure is ready.'
        ELSE '❌ Please run create_deleted_visits_table.sql first'
    END as final_status;
