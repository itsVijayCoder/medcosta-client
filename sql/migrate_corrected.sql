-- CORRECTED Migration Script for Soft Delete System
-- Use this instead of the original migrate_soft_deletes.sql
-- This version uses lowercase column names consistent with PostgreSQL

-- 1. Insert soft-deleted LOCATIONS into deleted_visits
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
)
SELECT 
    gen_random_uuid() as id,
    'locations' as datasource,
    l.id as original_id,
    l.location_name as record_name,
    CONCAT(l.location_name, ' - ', l.city, ', ', l.state) as record_description,
    l.npi as casenumber,
    'Location Manager' as doctorname,
    l.updated_at as eventdate,
    'Administration' as speciality,
    l.id::text as eventid,
    'System' as deleted_by,
    'Soft deleted location' as deleted_reason,
    l.created_at,
    l.updated_at
FROM locations l
WHERE l.is_active = false
AND NOT EXISTS (
    SELECT 1 FROM deleted_visits dv 
    WHERE dv.datasource = 'locations' 
    AND dv.original_id = l.id
);

-- 2. Insert soft-deleted INSURANCE COMPANIES into deleted_visits
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
)
SELECT 
    gen_random_uuid() as id,
    'insurance_companies' as datasource,
    ic.id as original_id,
    ic.name as record_name,
    CONCAT(ic.name, ' - ', ic.city, ', ', ic.state) as record_description,
    ic.insured_id as casenumber,
    'Insurance Manager' as doctorname,
    ic.updated_at as eventdate,
    'Insurance' as speciality,
    ic.id::text as eventid,
    'System' as deleted_by,
    'Soft deleted insurance company' as deleted_reason,
    ic.created_at,
    ic.updated_at
FROM insurance_companies ic
WHERE ic.is_active = false
AND NOT EXISTS (
    SELECT 1 FROM deleted_visits dv 
    WHERE dv.datasource = 'insurance_companies' 
    AND dv.original_id = ic.id
);

-- 3. Insert soft-deleted PROVIDERS into deleted_visits
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
)
SELECT 
    gen_random_uuid() as id,
    'providers' as datasource,
    p.id as original_id,
    p.name as record_name,
    CONCAT(p.name, ' - ', p.specialty, ' (NPI: ', p.npi, ')') as record_description,
    p.npi as casenumber,
    p.name as doctorname,
    p.updated_at as eventdate,
    p.specialty as speciality,
    p.id::text as eventid,
    'System' as deleted_by,
    'Soft deleted provider' as deleted_reason,
    p.created_at,
    p.updated_at
FROM providers p
WHERE p.is_active = false
AND NOT EXISTS (
    SELECT 1 FROM deleted_visits dv 
    WHERE dv.datasource = 'providers' 
    AND dv.original_id = p.id
);

-- 4. Insert soft-deleted DIAGNOSIS CODES into deleted_visits
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
)
SELECT 
    gen_random_uuid() as id,
    'diagnosis_codes' as datasource,
    dc.id as original_id,
    dc.diagnosis_code as record_name,
    CONCAT(dc.diagnosis_code, ' - ', dc.description) as record_description,
    dc.diagnosis_code as casenumber,
    'Medical Coder' as doctorname,
    dc.updated_at as eventdate,
    dc.category as speciality,
    dc.id::text as eventid,
    'System' as deleted_by,
    'Soft deleted diagnosis code' as deleted_reason,
    dc.created_at,
    dc.updated_at
FROM diagnosis_codes dc
WHERE dc.is_active = false
AND NOT EXISTS (
    SELECT 1 FROM deleted_visits dv 
    WHERE dv.datasource = 'diagnosis_codes' 
    AND dv.original_id = dc.id
);

-- 5. Insert soft-deleted PROCEDURES into deleted_visits
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
)
SELECT 
    gen_random_uuid() as id,
    'procedures' as datasource,
    pr.id as original_id,
    pr.procedure_code as record_name,
    CONCAT(pr.procedure_code, ' - ', pr.description, ' ($', pr.amount, ')') as record_description,
    pr.procedure_code as casenumber,
    'Procedure Manager' as doctorname,
    pr.updated_at as eventdate,
    pr.specialty as speciality,
    pr.id::text as eventid,
    'System' as deleted_by,
    'Soft deleted procedure' as deleted_reason,
    pr.created_at,
    pr.updated_at
FROM procedures pr
WHERE pr.is_active = false
AND NOT EXISTS (
    SELECT 1 FROM deleted_visits dv 
    WHERE dv.datasource = 'procedures' 
    AND dv.original_id = pr.id
);

-- 6. Insert soft-deleted MODIFIERS into deleted_visits
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
)
SELECT 
    gen_random_uuid() as id,
    'modifiers' as datasource,
    m.id as original_id,
    m.modifier_code as record_name,
    CONCAT(m.modifier_code, ' - ', m.modifier_name, ': ', m.description) as record_description,
    m.modifier_code as casenumber,
    'Modifier Manager' as doctorname,
    m.updated_at as eventdate,
    m.specialty as speciality,
    m.id::text as eventid,
    'System' as deleted_by,
    'Soft deleted modifier' as deleted_reason,
    m.created_at,
    m.updated_at
FROM modifiers m
WHERE m.is_active = false
AND NOT EXISTS (
    SELECT 1 FROM deleted_visits dv 
    WHERE dv.datasource = 'modifiers' 
    AND dv.original_id = m.id
);

-- Create a function to automatically add records to deleted_visits when they are soft-deleted
CREATE OR REPLACE FUNCTION add_to_deleted_visits()
RETURNS TRIGGER AS $$
BEGIN
    -- Only trigger when is_active changes from true to false
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
            TG_TABLE_NAME, -- This will be the table name (locations, providers, etc.)
            NEW.id,
            CASE 
                WHEN TG_TABLE_NAME = 'locations' THEN NEW.location_name
                WHEN TG_TABLE_NAME = 'insurance_companies' THEN NEW.name
                WHEN TG_TABLE_NAME = 'providers' THEN NEW.name
                WHEN TG_TABLE_NAME = 'diagnosis_codes' THEN NEW.diagnosis_code
                WHEN TG_TABLE_NAME = 'procedures' THEN NEW.procedure_code
                WHEN TG_TABLE_NAME = 'modifiers' THEN NEW.modifier_code
                ELSE 'Unknown'
            END,
            CASE 
                WHEN TG_TABLE_NAME = 'locations' THEN CONCAT(NEW.location_name, ' - ', NEW.city, ', ', NEW.state)
                WHEN TG_TABLE_NAME = 'insurance_companies' THEN CONCAT(NEW.name, ' - ', NEW.city, ', ', NEW.state)
                WHEN TG_TABLE_NAME = 'providers' THEN CONCAT(NEW.name, ' - ', NEW.specialty, ' (NPI: ', NEW.npi, ')')
                WHEN TG_TABLE_NAME = 'diagnosis_codes' THEN CONCAT(NEW.diagnosis_code, ' - ', NEW.description)
                WHEN TG_TABLE_NAME = 'procedures' THEN CONCAT(NEW.procedure_code, ' - ', NEW.description)
                WHEN TG_TABLE_NAME = 'modifiers' THEN CONCAT(NEW.modifier_code, ' - ', NEW.modifier_name)
                ELSE 'Unknown record'
            END,
            CASE 
                WHEN TG_TABLE_NAME = 'locations' THEN NEW.npi
                WHEN TG_TABLE_NAME = 'insurance_companies' THEN NEW.insured_id
                WHEN TG_TABLE_NAME = 'providers' THEN NEW.npi
                WHEN TG_TABLE_NAME = 'diagnosis_codes' THEN NEW.diagnosis_code
                WHEN TG_TABLE_NAME = 'procedures' THEN NEW.procedure_code
                WHEN TG_TABLE_NAME = 'modifiers' THEN NEW.modifier_code
                ELSE NEW.id::text
            END,
            CASE 
                WHEN TG_TABLE_NAME = 'providers' THEN NEW.name
                ELSE CONCAT(TG_TABLE_NAME, ' Manager')
            END,
            NEW.updated_at,
            CASE 
                WHEN TG_TABLE_NAME = 'locations' THEN 'Administration'
                WHEN TG_TABLE_NAME = 'insurance_companies' THEN 'Insurance'
                WHEN TG_TABLE_NAME = 'providers' THEN NEW.specialty
                WHEN TG_TABLE_NAME = 'diagnosis_codes' THEN NEW.category
                WHEN TG_TABLE_NAME = 'procedures' THEN NEW.specialty
                WHEN TG_TABLE_NAME = 'modifiers' THEN NEW.specialty
                ELSE 'General'
            END,
            NEW.id::text,
            'System',
            CONCAT('Soft deleted ', TG_TABLE_NAME, ' record'),
            NEW.created_at,
            NEW.updated_at
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables that support soft delete
DROP TRIGGER IF EXISTS locations_soft_delete_trigger ON locations;
CREATE TRIGGER locations_soft_delete_trigger
    AFTER UPDATE ON locations
    FOR EACH ROW
    EXECUTE FUNCTION add_to_deleted_visits();

DROP TRIGGER IF EXISTS insurance_companies_soft_delete_trigger ON insurance_companies;
CREATE TRIGGER insurance_companies_soft_delete_trigger
    AFTER UPDATE ON insurance_companies
    FOR EACH ROW
    EXECUTE FUNCTION add_to_deleted_visits();

DROP TRIGGER IF EXISTS providers_soft_delete_trigger ON providers;
CREATE TRIGGER providers_soft_delete_trigger
    AFTER UPDATE ON providers
    FOR EACH ROW
    EXECUTE FUNCTION add_to_deleted_visits();

DROP TRIGGER IF EXISTS diagnosis_codes_soft_delete_trigger ON diagnosis_codes;
CREATE TRIGGER diagnosis_codes_soft_delete_trigger
    AFTER UPDATE ON diagnosis_codes
    FOR EACH ROW
    EXECUTE FUNCTION add_to_deleted_visits();

DROP TRIGGER IF EXISTS procedures_soft_delete_trigger ON procedures;
CREATE TRIGGER procedures_soft_delete_trigger
    AFTER UPDATE ON procedures
    FOR EACH ROW
    EXECUTE FUNCTION add_to_deleted_visits();

DROP TRIGGER IF EXISTS modifiers_soft_delete_trigger ON modifiers;
CREATE TRIGGER modifiers_soft_delete_trigger
    AFTER UPDATE ON modifiers
    FOR EACH ROW
    EXECUTE FUNCTION add_to_deleted_visits();

-- Verification query
SELECT 
    'Migration completed!' as status,
    datasource,
    COUNT(*) as migrated_count
FROM deleted_visits 
WHERE datasource != 'test'
GROUP BY datasource
ORDER BY migrated_count DESC;
