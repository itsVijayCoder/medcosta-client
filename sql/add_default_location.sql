-- Add a default location for appointments
-- Run this in Supabase SQL Editor

-- Insert a default location if none exists
INSERT INTO locations (location_name, address, city, state, zip, phone, email, is_active)
SELECT 'Main Clinic', '123 Medical Center Drive', 'Medical City', 'TX', '12345', '(555) 123-4567', 'info@medcosta.com', true
WHERE NOT EXISTS (SELECT 1 FROM locations WHERE location_name = 'Main Clinic');

-- Verify location was created
SELECT 'Default Location Check:' as test, id, location_name, is_active
FROM locations 
WHERE location_name = 'Main Clinic';
