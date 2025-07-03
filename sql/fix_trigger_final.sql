-- Final fix for the trigger function
-- This creates a safe trigger function that checks for field existence before accessing them

-- 1. First, drop the problematic function and all triggers
DROP FUNCTION IF EXISTS add_to_deleted_visits() CASCADE;

-- 2. Create a new, safe trigger function
CREATE OR REPLACE FUNCTION add_to_deleted_visits()
RETURNS TRIGGER AS $$
BEGIN
    -- Only proceed if is_active is being set to false (soft delete)
    IF OLD.is_active = true AND NEW.is_active = false THEN
        INSERT INTO deleted_visits (
            id,
            datasource,
            original_id,
            record_name,
            record_description,
            casenumber,
            doctorname,
            eventdate,
            speciality,
            eventid,
            deleted_by,
            deleted_reason,
            created_at,
            updated_at
        ) VALUES (
            gen_random_uuid(),
            TG_TABLE_NAME,
            NEW.id,
            -- Safe record_name based on table
            CASE 
                WHEN TG_TABLE_NAME = 'locations' AND (TG_ARGV[0] IS NULL OR TG_ARGV[0] = 'location_name') THEN 
                    COALESCE((NEW.*::json->>'location_name'), 'Unknown Location')
                WHEN TG_TABLE_NAME = 'insurance_companies' THEN 
                    COALESCE((NEW.*::json->>'name'), 'Unknown Insurance')
                WHEN TG_TABLE_NAME = 'providers' THEN 
                    COALESCE((NEW.*::json->>'name'), 'Unknown Provider')
                WHEN TG_TABLE_NAME = 'diagnosis_codes' THEN 
                    COALESCE((NEW.*::json->>'diagnosis_code'), 'Unknown Diagnosis')
                WHEN TG_TABLE_NAME = 'procedures' THEN 
                    COALESCE((NEW.*::json->>'procedure_code'), 'Unknown Procedure')
                WHEN TG_TABLE_NAME = 'modifiers' THEN 
                    COALESCE((NEW.*::json->>'modifier_code'), 'Unknown Modifier')
                ELSE 'Unknown Record'
            END,
            -- Safe record_description based on table
            CASE 
                WHEN TG_TABLE_NAME = 'locations' THEN 
                    CONCAT(
                        COALESCE((NEW.*::json->>'location_name'), 'Unknown'), 
                        ' - ', 
                        COALESCE((NEW.*::json->>'city'), 'Unknown City'), 
                        ', ', 
                        COALESCE((NEW.*::json->>'state'), 'Unknown State')
                    )
                WHEN TG_TABLE_NAME = 'insurance_companies' THEN 
                    CONCAT(
                        COALESCE((NEW.*::json->>'name'), 'Unknown'), 
                        ' - ', 
                        COALESCE((NEW.*::json->>'city'), 'Unknown City'), 
                        ', ', 
                        COALESCE((NEW.*::json->>'state'), 'Unknown State')
                    )
                WHEN TG_TABLE_NAME = 'providers' THEN 
                    CONCAT(
                        COALESCE((NEW.*::json->>'name'), 'Unknown'), 
                        ' - ', 
                        COALESCE((NEW.*::json->>'specialty'), 'Unknown Specialty'), 
                        ' (NPI: ', 
                        COALESCE((NEW.*::json->>'npi'), 'Unknown'), 
                        ')'
                    )
                WHEN TG_TABLE_NAME = 'diagnosis_codes' THEN 
                    CONCAT(
                        COALESCE((NEW.*::json->>'diagnosis_code'), 'Unknown'), 
                        ' - ', 
                        COALESCE((NEW.*::json->>'description'), 'No description')
                    )
                WHEN TG_TABLE_NAME = 'procedures' THEN 
                    CONCAT(
                        COALESCE((NEW.*::json->>'procedure_code'), 'Unknown'), 
                        ' - ', 
                        COALESCE((NEW.*::json->>'description'), 'No description')
                    )
                WHEN TG_TABLE_NAME = 'modifiers' THEN 
                    CONCAT(
                        COALESCE((NEW.*::json->>'modifier_code'), 'Unknown'), 
                        ' - ', 
                        COALESCE((NEW.*::json->>'modifier_name'), 'No name')
                    )
                ELSE 'Unknown record'
            END,
            -- Safe casenumber based on table
            CASE 
                WHEN TG_TABLE_NAME = 'locations' THEN 
                    COALESCE((NEW.*::json->>'npi'), NEW.id::text)
                WHEN TG_TABLE_NAME = 'insurance_companies' THEN 
                    COALESCE((NEW.*::json->>'insured_id'), NEW.id::text)
                WHEN TG_TABLE_NAME = 'providers' THEN 
                    COALESCE((NEW.*::json->>'npi'), NEW.id::text)
                WHEN TG_TABLE_NAME = 'diagnosis_codes' THEN 
                    COALESCE((NEW.*::json->>'diagnosis_code'), NEW.id::text)
                WHEN TG_TABLE_NAME = 'procedures' THEN 
                    COALESCE((NEW.*::json->>'procedure_code'), NEW.id::text)
                WHEN TG_TABLE_NAME = 'modifiers' THEN 
                    COALESCE((NEW.*::json->>'modifier_code'), NEW.id::text)
                ELSE NEW.id::text
            END,
            -- Safe doctorname based on table
            CASE 
                WHEN TG_TABLE_NAME = 'providers' THEN 
                    COALESCE((NEW.*::json->>'name'), 'Unknown Provider')
                ELSE CONCAT(TG_TABLE_NAME, ' Manager')
            END,
            -- Use updated_at or current timestamp
            COALESCE(NEW.updated_at, NOW()),
            -- Safe speciality based on table
            CASE 
                WHEN TG_TABLE_NAME = 'locations' THEN 'Administration'
                WHEN TG_TABLE_NAME = 'insurance_companies' THEN 'Insurance'
                WHEN TG_TABLE_NAME = 'providers' THEN 
                    COALESCE((NEW.*::json->>'specialty'), 'General')
                WHEN TG_TABLE_NAME = 'diagnosis_codes' THEN 
                    COALESCE((NEW.*::json->>'category'), 'General')
                WHEN TG_TABLE_NAME = 'procedures' THEN 
                    COALESCE((NEW.*::json->>'specialty'), 'General')
                WHEN TG_TABLE_NAME = 'modifiers' THEN 
                    COALESCE((NEW.*::json->>'specialty'), 'General')
                ELSE 'General'
            END,
            NEW.id::text,
            'System',
            CONCAT('Soft deleted ', TG_TABLE_NAME, ' record'),
            COALESCE(NEW.created_at, NOW()),
            COALESCE(NEW.updated_at, NOW())
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Create triggers for all master data tables
CREATE TRIGGER soft_delete_to_deleted_visits_trigger
    AFTER UPDATE ON locations
    FOR EACH ROW
    EXECUTE FUNCTION add_to_deleted_visits();

CREATE TRIGGER soft_delete_to_deleted_visits_trigger
    AFTER UPDATE ON insurance_companies
    FOR EACH ROW
    EXECUTE FUNCTION add_to_deleted_visits();

CREATE TRIGGER soft_delete_to_deleted_visits_trigger
    AFTER UPDATE ON providers
    FOR EACH ROW
    EXECUTE FUNCTION add_to_deleted_visits();

CREATE TRIGGER soft_delete_to_deleted_visits_trigger
    AFTER UPDATE ON diagnosis_codes
    FOR EACH ROW
    EXECUTE FUNCTION add_to_deleted_visits();

CREATE TRIGGER soft_delete_to_deleted_visits_trigger
    AFTER UPDATE ON procedures
    FOR EACH ROW
    EXECUTE FUNCTION add_to_deleted_visits();

CREATE TRIGGER soft_delete_to_deleted_visits_trigger
    AFTER UPDATE ON modifiers
    FOR EACH ROW
    EXECUTE FUNCTION add_to_deleted_visits();

-- 4. Test the fix with a sample update
-- This should now work without errors
-- UPDATE diagnosis_codes 
-- SET is_active = false, updated_at = NOW() 
-- WHERE id = (SELECT id FROM diagnosis_codes WHERE is_active = true LIMIT 1);
