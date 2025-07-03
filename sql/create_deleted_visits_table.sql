-- Create deleted_visits table for centralized soft delete management
-- Run this script in Supabase SQL Editor to create the table

CREATE TABLE IF NOT EXISTS deleted_visits (
    -- Primary key for deleted_visits table
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Source tracking - which table this record came from
    datasource TEXT NOT NULL,
    original_id UUID NOT NULL,
    
    -- Record identification
    record_name TEXT,
    record_description TEXT,
    
    -- Visit/Event information (legacy fields from original deleted_visits)
    casenumber TEXT,
    doctorname TEXT,
    eventdate TIMESTAMP WITH TIME ZONE,
    speciality TEXT,
    eventid TEXT,
    
    -- Deletion tracking
    deleted_by TEXT DEFAULT 'System',
    deleted_reason TEXT DEFAULT 'Soft deleted record',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_deleted_visits_datasource ON deleted_visits(datasource);
CREATE INDEX IF NOT EXISTS idx_deleted_visits_original_id ON deleted_visits(original_id);
CREATE INDEX IF NOT EXISTS idx_deleted_visits_datasource_original_id ON deleted_visits(datasource, original_id);
CREATE INDEX IF NOT EXISTS idx_deleted_visits_event_date ON deleted_visits(eventdate DESC);

-- Add RLS (Row Level Security) if needed
-- ALTER TABLE deleted_visits ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at column
CREATE TRIGGER update_deleted_visits_updated_at 
    BEFORE UPDATE ON deleted_visits 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments to document the table structure
COMMENT ON TABLE deleted_visits IS 'Centralized table for tracking all soft-deleted records from various tables';
COMMENT ON COLUMN deleted_visits.datasource IS 'Source table name (locations, providers, insurance_companies, etc.)';
COMMENT ON COLUMN deleted_visits.original_id IS 'Original ID from the source table';
COMMENT ON COLUMN deleted_visits.record_name IS 'Main identifier of the record (name, code, etc.)';
COMMENT ON COLUMN deleted_visits.record_description IS 'Detailed description of the record';
COMMENT ON COLUMN deleted_visits.casenumber IS 'Reference number (NPI, ID, code, etc.)';
COMMENT ON COLUMN deleted_visits.doctorname IS 'Associated doctor or manager name';
COMMENT ON COLUMN deleted_visits.eventdate IS 'Date when the record was deleted';
COMMENT ON COLUMN deleted_visits.speciality IS 'Category, specialty, or type of record';
COMMENT ON COLUMN deleted_visits.deleted_by IS 'Who deleted the record';
COMMENT ON COLUMN deleted_visits.deleted_reason IS 'Reason for deletion';

-- Insert a test record to verify table creation (optional)
INSERT INTO deleted_visits (
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
    deleted_reason
) VALUES (
    'test',
    gen_random_uuid(),
    'Test Record',
    'This is a test record to verify table creation',
    'TEST001',
    'System Administrator',
    NOW(),
    'Testing',
    'TEST001',
    'System',
    'Table creation test'
);

-- Verify table was created successfully
SELECT 
    'Table created successfully!' as status,
    COUNT(*) as test_records
FROM deleted_visits;

-- Show table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'deleted_visits'
ORDER BY ordinal_position;
