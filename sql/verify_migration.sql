-- Verification queries to check if the soft delete migration completed successfully
-- Run these queries after executing migrate_soft_deletes.sql

-- 1. Check if the new columns were added to deleted_visits
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'deleted_visits' 
AND column_name IN ('datasource', 'original_id', 'record_name', 'record_description', 'deleted_by', 'deleted_reason')
ORDER BY column_name;

-- 2. Check total count of deleted records by datasource
SELECT 
    datasource,
    COUNT(*) as total_records,
    MIN(eventdate) as earliest_delete,
    MAX(eventdate) as latest_delete
FROM deleted_visits 
GROUP BY datasource 
ORDER BY total_records DESC;

-- 3. Sample deleted records from each table type
SELECT 
    datasource,
    record_name,
    record_description,
    speciality,
    eventdate
FROM deleted_visits 
WHERE datasource IN ('locations', 'insurance_companies', 'providers', 'diagnosis_codes', 'procedures', 'modifiers')
ORDER BY datasource, eventdate DESC
LIMIT 20;

-- 4. Verify triggers were created successfully
SELECT 
    trigger_name,
    event_object_table,
    action_timing,
    event_manipulation
FROM information_schema.triggers 
WHERE trigger_name LIKE '%soft_delete_trigger%'
ORDER BY event_object_table;

-- 5. Check for any records that might have been missed (soft deleted but not in deleted_visits)
-- Note: These queries will show if there are any is_active=false records not properly migrated

-- Locations check
SELECT 'locations' as table_name, COUNT(*) as missed_records
FROM locations l
WHERE l.is_active = false
AND NOT EXISTS (
    SELECT 1 FROM deleted_visits dv 
    WHERE dv.datasource = 'locations' AND dv.original_id = l.id
)

UNION ALL

-- Insurance companies check
SELECT 'insurance_companies' as table_name, COUNT(*) as missed_records
FROM insurance_companies ic
WHERE ic.is_active = false
AND NOT EXISTS (
    SELECT 1 FROM deleted_visits dv 
    WHERE dv.datasource = 'insurance_companies' AND dv.original_id = ic.id
)

UNION ALL

-- Providers check
SELECT 'providers' as table_name, COUNT(*) as missed_records
FROM providers p
WHERE p.is_active = false
AND NOT EXISTS (
    SELECT 1 FROM deleted_visits dv 
    WHERE dv.datasource = 'providers' AND dv.original_id = p.id
)

UNION ALL

-- Diagnosis codes check
SELECT 'diagnosis_codes' as table_name, COUNT(*) as missed_records
FROM diagnosis_codes dc
WHERE dc.is_active = false
AND NOT EXISTS (
    SELECT 1 FROM deleted_visits dv 
    WHERE dv.datasource = 'diagnosis_codes' AND dv.original_id = dc.id
)

UNION ALL

-- Procedures check
SELECT 'procedures' as table_name, COUNT(*) as missed_records
FROM procedures pr
WHERE pr.is_active = false
AND NOT EXISTS (
    SELECT 1 FROM deleted_visits dv 
    WHERE dv.datasource = 'procedures' AND dv.original_id = pr.id
)

UNION ALL

-- Modifiers check
SELECT 'modifiers' as table_name, COUNT(*) as missed_records
FROM modifiers m
WHERE m.is_active = false
AND NOT EXISTS (
    SELECT 1 FROM deleted_visits dv 
    WHERE dv.datasource = 'modifiers' AND dv.original_id = m.id
);

-- 6. Test the add_to_deleted_visits function exists
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name = 'add_to_deleted_visits';

-- 7. Sample query to test filtering by datasource (what the app will use)
SELECT 
    id,
    datasource,
    original_id,
    record_name,
    record_description,
    casenumber,
    doctorname,
    eventdate,
    speciality
FROM deleted_visits 
WHERE datasource = 'providers'  -- Change this to test different table types
ORDER BY eventdate DESC 
LIMIT 5;

-- Expected Results Summary:
-- Query 1: Should show 6 new columns (datasource, original_id, record_name, record_description, deleted_by, deleted_reason)
-- Query 2: Should show counts for each table that had soft-deleted records
-- Query 3: Should show sample records from each table type with proper field mappings
-- Query 4: Should show 6 triggers (one for each table)
-- Query 5: Should show 0 missed_records for all tables (all soft-deleted records should be migrated)
-- Query 6: Should show the add_to_deleted_visits function
-- Query 7: Should show filtered records by datasource
