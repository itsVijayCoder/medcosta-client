-- Remove all triggers and deleted_visits functionality
-- Run this in Supabase SQL Editor

-- 1. Drop all triggers from master data tables
DROP TRIGGER IF EXISTS soft_delete_to_deleted_visits_trigger ON locations CASCADE;
DROP TRIGGER IF EXISTS soft_delete_to_deleted_visits_trigger ON insurance_companies CASCADE;
DROP TRIGGER IF EXISTS soft_delete_to_deleted_visits_trigger ON providers CASCADE;
DROP TRIGGER IF EXISTS soft_delete_to_deleted_visits_trigger ON diagnosis_codes CASCADE;
DROP TRIGGER IF EXISTS soft_delete_to_deleted_visits_trigger ON procedures CASCADE;
DROP TRIGGER IF EXISTS soft_delete_to_deleted_visits_trigger ON modifiers CASCADE;

-- 2. Drop any other triggers that might exist
DROP TRIGGER IF EXISTS audit_trigger ON locations CASCADE;
DROP TRIGGER IF EXISTS audit_trigger ON insurance_companies CASCADE;
DROP TRIGGER IF EXISTS audit_trigger ON providers CASCADE;
DROP TRIGGER IF EXISTS audit_trigger ON diagnosis_codes CASCADE;
DROP TRIGGER IF EXISTS audit_trigger ON procedures CASCADE;
DROP TRIGGER IF EXISTS audit_trigger ON modifiers CASCADE;

DROP TRIGGER IF EXISTS log_changes_trigger ON locations CASCADE;
DROP TRIGGER IF EXISTS log_changes_trigger ON insurance_companies CASCADE;
DROP TRIGGER IF EXISTS log_changes_trigger ON providers CASCADE;
DROP TRIGGER IF EXISTS log_changes_trigger ON diagnosis_codes CASCADE;
DROP TRIGGER IF EXISTS log_changes_trigger ON procedures CASCADE;
DROP TRIGGER IF EXISTS log_changes_trigger ON modifiers CASCADE;

DROP TRIGGER IF EXISTS update_trigger ON locations CASCADE;
DROP TRIGGER IF EXISTS update_trigger ON insurance_companies CASCADE;
DROP TRIGGER IF EXISTS update_trigger ON providers CASCADE;
DROP TRIGGER IF EXISTS update_trigger ON diagnosis_codes CASCADE;
DROP TRIGGER IF EXISTS update_trigger ON procedures CASCADE;
DROP TRIGGER IF EXISTS update_trigger ON modifiers CASCADE;

DROP TRIGGER IF EXISTS set_updated_at_trigger ON locations CASCADE;
DROP TRIGGER IF EXISTS set_updated_at_trigger ON insurance_companies CASCADE;
DROP TRIGGER IF EXISTS set_updated_at_trigger ON providers CASCADE;
DROP TRIGGER IF EXISTS set_updated_at_trigger ON diagnosis_codes CASCADE;
DROP TRIGGER IF EXISTS set_updated_at_trigger ON procedures CASCADE;
DROP TRIGGER IF EXISTS set_updated_at_trigger ON modifiers CASCADE;

-- 3. Drop the trigger function
DROP FUNCTION IF EXISTS add_to_deleted_visits() CASCADE;

-- 4. Test soft delete directly - this should now work without any triggers
-- UPDATE diagnosis_codes 
-- SET is_active = false, updated_at = NOW() 
-- WHERE id = (SELECT id FROM diagnosis_codes WHERE is_active = true LIMIT 1);

-- Note: You can keep the deleted_visits table if you want to preserve existing data,
-- or drop it if you don't need it anymore:
-- DROP TABLE IF EXISTS deleted_visits;
