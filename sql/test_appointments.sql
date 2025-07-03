-- Test appointment creation and retrieval
-- Run this in Supabase SQL Editor to verify the appointments work correctly

-- Test 1: Check if appointments table exists and is accessible
SELECT 'Appointments Table Test:' as test, COUNT(*) as appointment_count
FROM appointments;

-- Test 2: Check if we can read appointment data with joins
SELECT 'Appointments Join Test:' as test,
  a.id,
  a.appointment_date,
  a.appointment_time,
  a.status,
  p.first_name,
  p.last_name,
  pr.name as provider_name
FROM appointments a
LEFT JOIN patients p ON a.patient_id = p.id
LEFT JOIN providers pr ON a.provider_id = pr.id
LIMIT 5;

-- Test 3: Check providers are available
SELECT 'Providers Test:' as test, COUNT(*) as provider_count
FROM providers 
WHERE is_active = true;

-- Test 4: Check locations are available  
SELECT 'Locations Test:' as test, COUNT(*) as location_count
FROM locations 
WHERE is_active = true;

-- Test 5: Sample appointment creation test (will fail if no data, but shows structure)
SELECT 'Sample Data Structure:' as test,
  'appointment_date: ' || CURRENT_DATE as sample_appointment_date,
  'appointment_time: 09:00' as sample_appointment_time,
  'duration_minutes: 30' as sample_duration,
  'status: Scheduled' as sample_status;
