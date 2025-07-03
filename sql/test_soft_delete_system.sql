-- Test Query to Demonstrate the Soft Delete System
-- Run this AFTER executing migrate_soft_deletes.sql

-- 1. Show all available dataSources (table types) with counts
SELECT 
    dataSource,
    COUNT(*) as deleted_count,
    STRING_AGG(DISTINCT record_name, ', ' ORDER BY record_name) as sample_records
FROM deleted_visits 
GROUP BY dataSource 
ORDER BY deleted_count DESC;

-- 2. Example: Get all deleted PROVIDERS (this is what the app does when you select "Providers")
SELECT 
    id,
    dataSource,
    original_id,
    record_name as provider_name,
    record_description,
    CaseNumber as npi,
    speciality,
    EventDate as deleted_date
FROM deleted_visits 
WHERE dataSource = 'providers'  -- This filters to show only deleted providers
ORDER BY EventDate DESC;

-- 3. Example: Get all deleted LOCATIONS (this is what the app does when you select "Locations")
SELECT 
    id,
    dataSource,
    original_id,
    record_name as location_name,
    record_description,
    CaseNumber as npi,
    speciality,
    EventDate as deleted_date
FROM deleted_visits 
WHERE dataSource = 'locations'  -- This filters to show only deleted locations
ORDER BY EventDate DESC;

-- 4. Example: Get all deleted INSURANCE COMPANIES
SELECT 
    id,
    dataSource,
    original_id,
    record_name as insurance_name,
    record_description,
    CaseNumber as insured_id,
    speciality,
    EventDate as deleted_date
FROM deleted_visits 
WHERE dataSource = 'insurance_companies'  -- This filters to show only deleted insurance companies
ORDER BY EventDate DESC;

-- 5. Verify that each record in deleted_visits has a corresponding is_active=false record in the original table
-- This confirms the migration worked correctly

-- Check providers
SELECT 
    'providers' as table_name,
    dv.original_id,
    dv.record_name,
    p.is_active,
    CASE WHEN p.is_active = false THEN '✅ Correct' ELSE '❌ Error' END as status
FROM deleted_visits dv
LEFT JOIN providers p ON p.id = dv.original_id
WHERE dv.dataSource = 'providers'
LIMIT 5;

-- Check locations  
SELECT 
    'locations' as table_name,
    dv.original_id,
    dv.record_name,
    l.is_active,
    CASE WHEN l.is_active = false THEN '✅ Correct' ELSE '❌ Error' END as status
FROM deleted_visits dv
LEFT JOIN locations l ON l.id = dv.original_id
WHERE dv.dataSource = 'locations'
LIMIT 5;

-- 6. Test the dropdown functionality (this simulates what your React app does)
-- Get available table types for the dropdown
SELECT DISTINCT dataSource as table_type, COUNT(*) as record_count
FROM deleted_visits 
GROUP BY dataSource
ORDER BY dataSource;

-- Expected Output:
-- dataSource         | record_count
-- -------------------|-------------
-- diagnosis_codes    | X
-- insurance_companies| X  
-- locations          | X
-- modifiers          | X
-- procedures         | X
-- providers          | X
