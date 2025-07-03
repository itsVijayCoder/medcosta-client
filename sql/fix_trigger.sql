-- Fix for the add_to_deleted_visits trigger function
-- This creates a safer version that only accesses fields that exist for each table

-- First, drop the existing trigger function
DROP FUNCTION IF EXISTS add_to_deleted_visits() CASCADE;

-- Create a new, safer trigger function
CREATE OR REPLACE FUNCTION add_to_deleted_visits()
RETURNS TRIGGER AS $$
BEGIN
    -- Only proceed if this is a soft delete (is_active changed to false)
    IF OLD.is_active = true AND NEW.is_active = false THEN
        
        -- Insert into deleted_visits with safe field access
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
            -- Safe record name extraction
            CASE 
                WHEN TG_TABLE_NAME = 'locations' THEN 
                    CASE WHEN NEW ? 'location_name' THEN NEW.location_name ELSE 'Unknown Location' END
                WHEN TG_TABLE_NAME = 'insurance_companies' THEN 
                    CASE WHEN NEW ? 'name' THEN NEW.name ELSE 'Unknown Insurance' END
                WHEN TG_TABLE_NAME = 'providers' THEN 
                    CASE WHEN NEW ? 'name' THEN NEW.name ELSE 'Unknown Provider' END
                WHEN TG_TABLE_NAME = 'diagnosis_codes' THEN 
                    CASE WHEN NEW ? 'diagnosis_code' THEN NEW.diagnosis_code ELSE 'Unknown Code' END
                WHEN TG_TABLE_NAME = 'procedures' THEN 
                    CASE WHEN NEW ? 'procedure_code' THEN NEW.procedure_code ELSE 'Unknown Procedure' END
                WHEN TG_TABLE_NAME = 'modifiers' THEN 
                    CASE WHEN NEW ? 'modifier_code' THEN NEW.modifier_code ELSE 'Unknown Modifier' END
                ELSE 'Unknown'
            END,
            -- Safe record description
            CASE 
                WHEN TG_TABLE_NAME = 'diagnosis_codes' THEN 
                    CONCAT(
                        CASE WHEN NEW ? 'diagnosis_code' THEN NEW.diagnosis_code ELSE 'N/A' END,
                        ' - ',
                        CASE WHEN NEW ? 'description' THEN NEW.description ELSE 'No description' END
                    )
                WHEN TG_TABLE_NAME = 'procedures' THEN 
                    CONCAT(
                        CASE WHEN NEW ? 'procedure_code' THEN NEW.procedure_code ELSE 'N/A' END,
                        ' - ',
                        CASE WHEN NEW ? 'description' THEN NEW.description ELSE 'No description' END
                    )
                WHEN TG_TABLE_NAME = 'modifiers' THEN 
                    CONCAT(
                        CASE WHEN NEW ? 'modifier_code' THEN NEW.modifier_code ELSE 'N/A' END,
                        ' - ',
                        CASE WHEN NEW ? 'modifier_name' THEN NEW.modifier_name ELSE 'No name' END
                    )
                ELSE CONCAT('Deleted ', TG_TABLE_NAME, ' record')
            END,
            -- Safe case number extraction
            CASE 
                WHEN TG_TABLE_NAME = 'diagnosis_codes' AND NEW ? 'diagnosis_code' THEN NEW.diagnosis_code
                WHEN TG_TABLE_NAME = 'procedures' AND NEW ? 'procedure_code' THEN NEW.procedure_code
                WHEN TG_TABLE_NAME = 'modifiers' AND NEW ? 'modifier_code' THEN NEW.modifier_code
                ELSE NEW.id::text
            END,
            -- Safe doctor name
            CASE 
                WHEN TG_TABLE_NAME = 'providers' AND NEW ? 'name' THEN NEW.name
                ELSE CONCAT(TG_TABLE_NAME, ' Manager')
            END,
            -- Event date (use updated_at or current timestamp)
            COALESCE(NEW.updated_at, CURRENT_TIMESTAMP),
            -- Safe specialty extraction
            CASE 
                WHEN TG_TABLE_NAME = 'providers' AND NEW ? 'specialty' THEN NEW.specialty
                WHEN TG_TABLE_NAME = 'diagnosis_codes' AND NEW ? 'category' THEN NEW.category
                WHEN TG_TABLE_NAME = 'procedures' AND NEW ? 'specialty' THEN NEW.specialty
                WHEN TG_TABLE_NAME = 'modifiers' AND NEW ? 'specialty' THEN NEW.specialty
                WHEN TG_TABLE_NAME = 'locations' THEN 'Administration'
                WHEN TG_TABLE_NAME = 'insurance_companies' THEN 'Insurance'
                ELSE 'General'
            END,
            NEW.id::text,
            'System',
            CONCAT('Soft deleted ', TG_TABLE_NAME, ' record'),
            COALESCE(NEW.created_at, CURRENT_TIMESTAMP),
            COALESCE(NEW.updated_at, CURRENT_TIMESTAMP)
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Re-create triggers for all tables
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
