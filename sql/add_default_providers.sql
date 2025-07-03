-- Add default providers for testing
-- Run this in Supabase SQL Editor

-- First, get the location ID (assuming we have one from add_default_location.sql)
DO $$
DECLARE
    location_id UUID;
BEGIN
    -- Get the first available location
    SELECT id INTO location_id FROM locations WHERE is_active = true LIMIT 1;
    
    -- If no location exists, create a default one
    IF location_id IS NULL THEN
        INSERT INTO locations (location_name, address, city, state, zip, phone, email, is_active)
        VALUES ('Main Clinic', '123 Medical Center Drive', 'Medical City', 'TX', '12345', '(555) 123-4567', 'info@medcosta.com', true)
        RETURNING id INTO location_id;
    END IF;
    
    -- Insert default providers with explicit UUIDs if they don't exist
    INSERT INTO providers (id, name, npi, specialty, state_license, phone, email, location_id, is_active)
    SELECT 'a1111111-1111-1111-1111-111111111111'::UUID, 'Dr. John Smith', '1234567890', 'Family Medicine', 'TX123456', '(555) 234-5678', 'john.smith@medcosta.com', location_id, true
    WHERE NOT EXISTS (SELECT 1 FROM providers WHERE name = 'Dr. John Smith');
    
    INSERT INTO providers (id, name, npi, specialty, state_license, phone, email, location_id, is_active)
    SELECT 'b2222222-2222-2222-2222-222222222222'::UUID, 'Dr. Sarah Johnson', '1234567891', 'Internal Medicine', 'TX123457', '(555) 234-5679', 'sarah.johnson@medcosta.com', location_id, true
    WHERE NOT EXISTS (SELECT 1 FROM providers WHERE name = 'Dr. Sarah Johnson');
    
    INSERT INTO providers (id, name, npi, specialty, state_license, phone, email, location_id, is_active)
    SELECT 'c3333333-3333-3333-3333-333333333333'::UUID, 'Dr. Michael Brown', '1234567892', 'Cardiology', 'TX123458', '(555) 234-5680', 'michael.brown@medcosta.com', location_id, true
    WHERE NOT EXISTS (SELECT 1 FROM providers WHERE name = 'Dr. Michael Brown');
    
    INSERT INTO providers (id, name, npi, specialty, state_license, phone, email, location_id, is_active)
    SELECT 'd4444444-4444-4444-4444-444444444444'::UUID, 'Dr. Emily Davis', '1234567893', 'Orthopedics', 'TX123459', '(555) 234-5681', 'emily.davis@medcosta.com', location_id, true
    WHERE NOT EXISTS (SELECT 1 FROM providers WHERE name = 'Dr. Emily Davis');
    
    INSERT INTO providers (id, name, npi, specialty, state_license, phone, email, location_id, is_active)
    SELECT 'e5555555-5555-5555-5555-555555555555'::UUID, 'Dr. Robert Wilson', '1234567894', 'Neurology', 'TX123460', '(555) 234-5682', 'robert.wilson@medcosta.com', location_id, true
    WHERE NOT EXISTS (SELECT 1 FROM providers WHERE name = 'Dr. Robert Wilson');
    
END $$;

-- Verify providers were created
SELECT 'Default Providers Check:' as test, id, name, specialty, is_active
FROM providers 
WHERE is_active = true
ORDER BY name;
