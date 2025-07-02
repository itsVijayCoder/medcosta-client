# Supabase Migration Scripts

## Database Setup Scripts

### 1. Initial Schema Setup

```sql
-- Run this script in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'doctor', 'nurse', 'receptionist', 'user')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. Locations table
CREATE TABLE locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location_name TEXT NOT NULL,
  npi TEXT UNIQUE,
  clia_number TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  phone TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- 3. Insurance Companies table
CREATE TABLE insurance_companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  phone TEXT,
  email TEXT,
  insured_id TEXT UNIQUE,
  contact_person TEXT,
  fax TEXT,
  website TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE insurance_companies ENABLE ROW LEVEL SECURITY;

-- 4. Providers table
CREATE TABLE providers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location_id UUID REFERENCES locations(id),
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  phone TEXT,
  email TEXT,
  npi TEXT UNIQUE NOT NULL,
  taxonomy_code TEXT,
  state_license TEXT,
  specialty TEXT,
  degree TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

-- 5. Diagnosis Codes table
CREATE TABLE diagnosis_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  diagnosis_code TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  diagnosis_type TEXT,
  category TEXT,
  is_preferred BOOLEAN DEFAULT false,
  icd_version TEXT DEFAULT 'ICD-10',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE diagnosis_codes ENABLE ROW LEVEL SECURITY;

-- 6. Procedures table
CREATE TABLE procedures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  procedure_code TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2),
  specialty TEXT,
  modifier TEXT,
  rev_code TEXT,
  value_code TEXT,
  is_preferred BOOLEAN DEFAULT false,
  full_description TEXT,
  rvu DECIMAL(8,2),
  location_id UUID REFERENCES locations(id),
  category TEXT,
  cpt_version TEXT DEFAULT 'CPT-2024',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE procedures ENABLE ROW LEVEL SECURITY;

-- 7. Modifiers table
CREATE TABLE modifiers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  specialty TEXT,
  modifier_name TEXT NOT NULL,
  modifier_code TEXT UNIQUE,
  description TEXT,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  modified_by UUID REFERENCES auth.users(id),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE modifiers ENABLE ROW LEVEL SECURITY;

-- 8. Patients table
CREATE TABLE patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_number TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  ssn TEXT,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  home_phone TEXT,
  mobile_phone TEXT,
  email TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relationship TEXT,
  case_type TEXT,
  date_filed DATE,
  state_filed TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- 9. Patient Insurance table
CREATE TABLE patient_insurance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  insurance_company_id UUID REFERENCES insurance_companies(id),
  policy_number TEXT,
  group_number TEXT,
  subscriber_name TEXT,
  subscriber_dob DATE,
  relationship TEXT CHECK (relationship IN ('Self', 'Spouse', 'Child', 'Other')),
  effective_date DATE,
  termination_date DATE,
  copay_amount DECIMAL(8,2),
  deductible_amount DECIMAL(10,2),
  is_primary BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE patient_insurance ENABLE ROW LEVEL SECURITY;

-- 10. Patient Employers table
CREATE TABLE patient_employers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  employer_name TEXT,
  employer_address TEXT,
  employer_city TEXT,
  employer_state TEXT,
  employer_zip TEXT,
  employer_phone TEXT,
  adjuster_name TEXT,
  adjuster_phone TEXT,
  adjuster_email TEXT,
  claim_number TEXT,
  date_of_injury DATE,
  is_current BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE patient_employers ENABLE ROW LEVEL SECURITY;

-- 11. Appointments table
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id),
  provider_id UUID REFERENCES providers(id),
  location_id UUID REFERENCES locations(id),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  end_time TIME,
  duration_minutes INTEGER DEFAULT 30,
  appointment_type TEXT DEFAULT 'Regular',
  status TEXT DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'No Show')),
  reason_for_visit TEXT,
  notes TEXT,
  visit_number TEXT,
  confirmation_sent BOOLEAN DEFAULT false,
  reminder_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- 12. Appointment Procedures table
CREATE TABLE appointment_procedures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  procedure_id UUID REFERENCES procedures(id),
  quantity INTEGER DEFAULT 1,
  amount DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Appointment Diagnoses table
CREATE TABLE appointment_diagnoses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  diagnosis_id UUID REFERENCES diagnosis_codes(id),
  is_primary BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. Deleted Visits table
CREATE TABLE deleted_visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  original_appointment_id UUID,
  patient_name TEXT,
  patient_id UUID,
  provider_name TEXT,
  appointment_date DATE,
  appointment_time TIME,
  deletion_reason TEXT,
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_by UUID REFERENCES auth.users(id),
  can_restore BOOLEAN DEFAULT true,
  backup_data JSONB
);

ALTER TABLE deleted_visits ENABLE ROW LEVEL SECURITY;

-- 15. System Settings table
CREATE TABLE system_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type TEXT DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
```

### 2. Indexes for Performance

```sql
-- Performance indexes
CREATE INDEX idx_locations_state ON locations(state);
CREATE INDEX idx_locations_active ON locations(is_active);

CREATE INDEX idx_insurance_companies_name ON insurance_companies(name);
CREATE INDEX idx_insurance_companies_state ON insurance_companies(state);

CREATE INDEX idx_providers_npi ON providers(npi);
CREATE INDEX idx_providers_specialty ON providers(specialty);
CREATE INDEX idx_providers_location ON providers(location_id);

CREATE INDEX idx_diagnosis_codes_code ON diagnosis_codes(diagnosis_code);
CREATE INDEX idx_diagnosis_codes_category ON diagnosis_codes(category);
CREATE INDEX idx_diagnosis_codes_preferred ON diagnosis_codes(is_preferred);

CREATE INDEX idx_procedures_code ON procedures(procedure_code);
CREATE INDEX idx_procedures_specialty ON procedures(specialty);
CREATE INDEX idx_procedures_category ON procedures(category);

CREATE INDEX idx_modifiers_specialty ON modifiers(specialty);
CREATE INDEX idx_modifiers_code ON modifiers(modifier_code);

CREATE INDEX idx_patients_name ON patients(last_name, first_name);
CREATE INDEX idx_patients_dob ON patients(date_of_birth);
CREATE INDEX idx_patients_patient_number ON patients(patient_number);
CREATE INDEX idx_patients_case_type ON patients(case_type);

CREATE INDEX idx_patient_insurance_patient ON patient_insurance(patient_id);
CREATE INDEX idx_patient_insurance_company ON patient_insurance(insurance_company_id);

CREATE INDEX idx_patient_employers_patient ON patient_employers(patient_id);

CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_provider ON appointments(provider_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_datetime ON appointments(appointment_date, appointment_time);

CREATE INDEX idx_deleted_visits_date ON deleted_visits(deleted_at);
CREATE INDEX idx_deleted_visits_patient ON deleted_visits(patient_id);
```

### 3. Row Level Security Policies

```sql
-- RLS Policies

-- Profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Helper function for role checking
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role FROM profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Locations policies
CREATE POLICY "Authenticated users can view locations" ON locations
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins and doctors can manage locations" ON locations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'doctor')
    )
  );

-- Insurance companies policies
CREATE POLICY "Authenticated users can view insurance companies" ON insurance_companies
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can manage insurance companies" ON insurance_companies
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'doctor', 'receptionist')
    )
  );

-- Providers policies
CREATE POLICY "Authenticated users can view providers" ON providers
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins and doctors can manage providers" ON providers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'doctor')
    )
  );

-- Diagnosis codes policies
CREATE POLICY "Authenticated users can view diagnosis codes" ON diagnosis_codes
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Medical staff can manage diagnosis codes" ON diagnosis_codes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'doctor', 'nurse')
    )
  );

-- Procedures policies
CREATE POLICY "Authenticated users can view procedures" ON procedures
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Medical staff can manage procedures" ON procedures
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'doctor', 'nurse')
    )
  );

-- Modifiers policies
CREATE POLICY "Authenticated users can view modifiers" ON modifiers
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Medical staff can manage modifiers" ON modifiers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'doctor', 'nurse')
    )
  );

-- Patients policies
CREATE POLICY "Healthcare staff can view patients" ON patients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'doctor', 'nurse', 'receptionist')
    )
  );

CREATE POLICY "Staff can manage patients" ON patients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'doctor', 'nurse', 'receptionist')
    )
  );

-- Patient insurance policies
CREATE POLICY "Staff can view patient insurance" ON patient_insurance
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'doctor', 'nurse', 'receptionist')
    )
  );

CREATE POLICY "Staff can manage patient insurance" ON patient_insurance
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'doctor', 'nurse', 'receptionist')
    )
  );

-- Patient employers policies
CREATE POLICY "Staff can view patient employers" ON patient_employers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'doctor', 'nurse', 'receptionist')
    )
  );

CREATE POLICY "Staff can manage patient employers" ON patient_employers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'doctor', 'nurse', 'receptionist')
    )
  );

-- Appointments policies
CREATE POLICY "Staff can view appointments" ON appointments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'doctor', 'nurse', 'receptionist')
    )
  );

CREATE POLICY "Staff can manage appointments" ON appointments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'doctor', 'nurse', 'receptionist')
    )
  );

-- Deleted visits policies
CREATE POLICY "Admins can view deleted visits" ON deleted_visits
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'doctor')
    )
  );

CREATE POLICY "Admins can manage deleted visits" ON deleted_visits
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- System settings policies
CREATE POLICY "Users can view public settings" ON system_settings
  FOR SELECT USING (is_public = true);

CREATE POLICY "Admins can manage all settings" ON system_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

### 4. Triggers and Functions

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to tables with updated_at column
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_insurance_companies_updated_at BEFORE UPDATE ON insurance_companies FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON providers FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_diagnosis_codes_updated_at BEFORE UPDATE ON diagnosis_codes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_procedures_updated_at BEFORE UPDATE ON procedures FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_modifiers_updated_at BEFORE UPDATE ON modifiers FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_patient_insurance_updated_at BEFORE UPDATE ON patient_insurance FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_patient_employers_updated_at BEFORE UPDATE ON patient_employers FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to generate patient numbers
CREATE OR REPLACE FUNCTION generate_patient_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    max_number INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(patient_number FROM '^[0-9]+') AS INTEGER)), 0)
    INTO max_number
    FROM patients
    WHERE patient_number ~ '^[0-9]+';

    new_number := LPAD((max_number + 1)::TEXT, 6, '0');
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate patient numbers
CREATE OR REPLACE FUNCTION set_patient_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.patient_number IS NULL OR NEW.patient_number = '' THEN
        NEW.patient_number := generate_patient_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_patient_number
    BEFORE INSERT ON patients
    FOR EACH ROW
    EXECUTE FUNCTION set_patient_number();

-- Function to handle profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### 5. Initial Data

```sql
-- Insert initial system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('appointment_slot_duration', '30', 'number', 'Default appointment duration in minutes', true),
('clinic_timezone', 'America/New_York', 'string', 'Clinic timezone', true),
('max_advance_booking_days', '90', 'number', 'Maximum days in advance for booking', true),
('clinic_name', 'MedCosta Medical Center', 'string', 'Clinic name', true),
('clinic_phone', '(555) 123-4567', 'string', 'Main clinic phone number', true),
('working_hours_start', '08:00', 'string', 'Clinic opening time', true),
('working_hours_end', '18:00', 'string', 'Clinic closing time', true),
('lunch_break_start', '12:00', 'string', 'Lunch break start time', true),
('lunch_break_end', '13:00', 'string', 'Lunch break end time', true);

-- Insert sample location
INSERT INTO locations (location_name, npi, address, city, state, zip, phone, email) VALUES
('Main Clinic', '1234567890', '123 Medical Drive', 'New York', 'NY', '10001', '(555) 123-4567', 'main@medcosta.com');

-- Insert sample insurance companies
INSERT INTO insurance_companies (name, address, city, state, zip, phone, email, insured_id) VALUES
('UnitedHealth Group', '9900 Bren Rd E', 'Minnetonka', 'MN', '55343', '(952) 936-1300', 'customer.service@uhg.com', 'UHG001'),
('Blue Cross Blue Shield', '225 N Michigan Ave', 'Chicago', 'IL', '60601', '(312) 440-6000', 'info@bcbs.com', 'BCBS001'),
('Aetna', '151 Farmington Ave', 'Hartford', 'CT', '06156', '(860) 273-0123', 'support@aetna.com', 'AET001'),
('Cigna', '900 Cottage Grove Rd', 'Bloomfield', 'CT', '06002', '(860) 226-6000', 'info@cigna.com', 'CIG001'),
('Humana', '500 W Main St', 'Louisville', 'KY', '40202', '(502) 580-1000', 'support@humana.com', 'HUM001');

-- Insert sample diagnosis codes
INSERT INTO diagnosis_codes (diagnosis_code, description, diagnosis_type, category, is_preferred) VALUES
('Z00.00', 'Encounter for general adult medical examination without abnormal findings', 'Primary', 'Preventive', true),
('M25.50', 'Pain in unspecified joint', 'Primary', 'Musculoskeletal', true),
('R06.02', 'Shortness of breath', 'Primary', 'Respiratory', true),
('E11.9', 'Type 2 diabetes mellitus without complications', 'Primary', 'Endocrine', true),
('I10', 'Essential hypertension', 'Primary', 'Cardiovascular', true);

-- Insert sample procedures
INSERT INTO procedures (procedure_code, description, amount, specialty, category, is_preferred) VALUES
('99213', 'Office visit, established patient, low complexity', 150.00, 'General Medicine', 'Office Visit', true),
('99214', 'Office visit, established patient, moderate complexity', 200.00, 'General Medicine', 'Office Visit', true),
('85025', 'Complete blood count', 45.00, 'Laboratory', 'Lab Test', true),
('80053', 'Comprehensive metabolic panel', 65.00, 'Laboratory', 'Lab Test', true),
('93000', 'Electrocardiogram', 85.00, 'Cardiology', 'Diagnostic', true);

-- Insert sample modifiers
INSERT INTO modifiers (specialty, modifier_name, modifier_code, description, is_default) VALUES
('General Medicine', 'Bilateral Procedure', '50', 'Bilateral procedure', false),
('Surgery', 'Multiple Procedures', '51', 'Multiple procedures', false),
('Radiology', 'Professional Component', '26', 'Professional component', false),
('Laboratory', 'Reference Laboratory', '90', 'Reference (outside) laboratory', false),
('General Medicine', 'Distinct Procedural Service', '59', 'Distinct procedural service', false);
```

### 6. Enable Realtime (Optional)

```sql
-- Enable realtime for tables that need live updates
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE patients;
ALTER PUBLICATION supabase_realtime ADD TABLE providers;
```
