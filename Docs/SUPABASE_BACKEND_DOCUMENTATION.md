# MedCosta Supabase Backend Architecture Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Database Schema Design](#database-schema-design)
4. [Authentication & Security](#authentication--security)
5. [API Endpoints Structure](#api-endpoints-structure)
6. [Implementation Guide](#implementation-guide)
7. [Frontend Integration](#frontend-integration)
8. [Deployment Strategy](#deployment-strategy)

## Project Overview

MedCosta is a comprehensive medical practice management system with the
following core functionalities:

### Core Modules

-  **Dashboard**: Analytics and overview of practice operations
-  **Data Entry Routes**:
   -  Patient Registration
   -  Insurance Company Master
   -  Location Management
   -  Diagnosis Code Management
   -  Procedure Master
   -  Provider Master
   -  Modifier Master
   -  Delete Visit Management
-  **Appointments Management**: Scheduling and appointment tracking

## System Architecture

### Technology Stack

-  **Frontend**: React.js with Vite
-  **Backend**: Supabase (PostgreSQL + Real-time + Auth + Storage)
-  **Database**: PostgreSQL (via Supabase)
-  **Authentication**: Supabase Auth
-  **File Storage**: Supabase Storage
-  **Real-time**: Supabase Realtime subscriptions

### Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │◄──►│   Supabase API  │◄──►│   PostgreSQL    │
│                 │    │                 │    │    Database     │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • Dashboard     │    │ • Authentication│    │ • Tables        │
│ • Data Entry    │    │ • Real-time     │    │ • Relationships │
│ • Appointments  │    │ • Row Level     │    │ • Indexes       │
│ • Auth          │    │   Security      │    │ • Triggers      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Database Schema Design

### 1. Authentication & User Management

#### `auth.users` (Supabase built-in)

```sql
-- Supabase handles this automatically
-- Additional user profile data in public.profiles
```

#### `public.profiles`

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'doctor', 'nurse', 'receptionist', 'user')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

### 2. Core Master Data Tables

#### `public.locations`

```sql
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

-- Indexes
CREATE INDEX idx_locations_state ON locations(state);
CREATE INDEX idx_locations_active ON locations(is_active);
```

#### `public.insurance_companies`

```sql
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

-- Indexes
CREATE INDEX idx_insurance_companies_name ON insurance_companies(name);
CREATE INDEX idx_insurance_companies_state ON insurance_companies(state);
```

#### `public.providers`

```sql
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

-- Indexes
CREATE INDEX idx_providers_npi ON providers(npi);
CREATE INDEX idx_providers_specialty ON providers(specialty);
CREATE INDEX idx_providers_location ON providers(location_id);
```

#### `public.diagnosis_codes`

```sql
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

-- Indexes
CREATE INDEX idx_diagnosis_codes_code ON diagnosis_codes(diagnosis_code);
CREATE INDEX idx_diagnosis_codes_category ON diagnosis_codes(category);
CREATE INDEX idx_diagnosis_codes_preferred ON diagnosis_codes(is_preferred);
```

#### `public.procedures`

```sql
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

-- Indexes
CREATE INDEX idx_procedures_code ON procedures(procedure_code);
CREATE INDEX idx_procedures_specialty ON procedures(specialty);
CREATE INDEX idx_procedures_category ON procedures(category);
```

#### `public.modifiers`

```sql
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

-- Indexes
CREATE INDEX idx_modifiers_specialty ON modifiers(specialty);
CREATE INDEX idx_modifiers_code ON modifiers(modifier_code);
```

### 3. Patient Management

#### `public.patients`

```sql
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

-- Indexes
CREATE INDEX idx_patients_name ON patients(last_name, first_name);
CREATE INDEX idx_patients_dob ON patients(date_of_birth);
CREATE INDEX idx_patients_patient_number ON patients(patient_number);
CREATE INDEX idx_patients_case_type ON patients(case_type);
```

#### `public.patient_insurance`

```sql
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

-- Indexes
CREATE INDEX idx_patient_insurance_patient ON patient_insurance(patient_id);
CREATE INDEX idx_patient_insurance_company ON patient_insurance(insurance_company_id);
```

#### `public.patient_employers`

```sql
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

-- Indexes
CREATE INDEX idx_patient_employers_patient ON patient_employers(patient_id);
```

### 4. Appointment Management

#### `public.appointments`

```sql
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

-- Indexes
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_provider ON appointments(provider_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_datetime ON appointments(appointment_date, appointment_time);
```

#### `public.appointment_procedures`

```sql
CREATE TABLE appointment_procedures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  procedure_id UUID REFERENCES procedures(id),
  quantity INTEGER DEFAULT 1,
  amount DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `public.appointment_diagnoses`

```sql
CREATE TABLE appointment_diagnoses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  diagnosis_id UUID REFERENCES diagnosis_codes(id),
  is_primary BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Visit Management & Deletion Tracking

#### `public.deleted_visits`

```sql
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
  backup_data JSONB -- Store original appointment data for potential restoration
);

-- Indexes
CREATE INDEX idx_deleted_visits_date ON deleted_visits(deleted_at);
CREATE INDEX idx_deleted_visits_patient ON deleted_visits(patient_id);
```

### 6. System Configuration

#### `public.system_settings`

```sql
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

-- Initial settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('appointment_slot_duration', '30', 'number', 'Default appointment duration in minutes', true),
('clinic_timezone', 'America/New_York', 'string', 'Clinic timezone', true),
('max_advance_booking_days', '90', 'number', 'Maximum days in advance for booking', true);
```

## Authentication & Security

### Row Level Security (RLS) Policies

#### Basic User Access Patterns

```sql
-- Enable RLS on all tables
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnosis_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE modifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Example policies for locations table
CREATE POLICY "Authenticated users can view locations" ON locations
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage locations" ON locations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'doctor')
    )
  );

-- Similar patterns for other tables...
```

### User Roles and Permissions

```sql
-- Create role-based access function
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role FROM profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## API Endpoints Structure

### Supabase Client Configuration

```javascript
// supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY";

export const supabase = createClient(supabaseUrl, supabaseKey, {
   auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
   },
});
```

### API Service Layer Structure

#### 1. Authentication Service

```javascript
// services/authService.js
import { supabase } from "../supabaseClient";

export const authService = {
   async signIn(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({
         email,
         password,
      });
      return { data, error };
   },

   async signOut() {
      const { error } = await supabase.auth.signOut();
      return { error };
   },

   async getCurrentUser() {
      const {
         data: { user },
      } = await supabase.auth.getUser();
      return user;
   },

   async getProfile(userId) {
      const { data, error } = await supabase
         .from("profiles")
         .select("*")
         .eq("id", userId)
         .single();
      return { data, error };
   },
};
```

#### 2. Patient Service

```javascript
// services/patientService.js
import { supabase } from "../supabaseClient";

export const patientService = {
   async createPatient(patientData) {
      const { data, error } = await supabase
         .from("patients")
         .insert([patientData])
         .select();
      return { data, error };
   },

   async getPatients(filters = {}) {
      let query = supabase.from("patients").select(`
        *,
        patient_insurance (
          *,
          insurance_companies (*)
        ),
        patient_employers (*)
      `);

      // Apply filters
      if (filters.search) {
         query = query.or(
            `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%`
         );
      }
      if (filters.case_type) {
         query = query.eq("case_type", filters.case_type);
      }

      const { data, error } = await query;
      return { data, error };
   },

   async updatePatient(id, updates) {
      const { data, error } = await supabase
         .from("patients")
         .update(updates)
         .eq("id", id)
         .select();
      return { data, error };
   },

   async deletePatient(id) {
      const { data, error } = await supabase
         .from("patients")
         .delete()
         .eq("id", id);
      return { data, error };
   },
};
```

#### 3. Appointment Service

```javascript
// services/appointmentService.js
import { supabase } from "../supabaseClient";

export const appointmentService = {
   async createAppointment(appointmentData) {
      const { data, error } = await supabase
         .from("appointments")
         .insert([appointmentData]).select(`
        *,
        patients (*),
        providers (*),
        locations (*)
      `);
      return { data, error };
   },

   async getAppointments(dateRange = {}) {
      let query = supabase
         .from("appointments")
         .select(
            `
        *,
        patients (first_name, last_name, phone),
        providers (name, specialty),
        locations (location_name)
      `
         )
         .order("appointment_date", { ascending: true })
         .order("appointment_time", { ascending: true });

      if (dateRange.start && dateRange.end) {
         query = query
            .gte("appointment_date", dateRange.start)
            .lte("appointment_date", dateRange.end);
      }

      const { data, error } = await query;
      return { data, error };
   },

   async updateAppointmentStatus(id, status) {
      const { data, error } = await supabase
         .from("appointments")
         .update({ status, updated_at: new Date().toISOString() })
         .eq("id", id)
         .select();
      return { data, error };
   },

   async getPatientVisitNumber(firstName, lastName, dob) {
      const { data, error } = await supabase
         .from("patients")
         .select("id, patient_number")
         .eq("first_name", firstName)
         .eq("last_name", lastName)
         .eq("date_of_birth", dob)
         .single();

      if (data) {
         // Get visit count for this patient
         const { count } = await supabase
            .from("appointments")
            .select("*", { count: "exact", head: true })
            .eq("patient_id", data.id);

         return {
            data: {
               visit_number: `${data.patient_number}-${(count || 0) + 1}`,
               patient_id: data.id,
            },
            error: null,
         };
      }

      return { data: null, error };
   },
};
```

#### 4. Master Data Services

```javascript
// services/masterDataService.js
import { supabase } from "../supabaseClient";

export const masterDataService = {
   // Locations
   async getLocations() {
      const { data, error } = await supabase
         .from("locations")
         .select("*")
         .eq("is_active", true)
         .order("location_name");
      return { data, error };
   },

   async createLocation(locationData) {
      const { data, error } = await supabase
         .from("locations")
         .insert([locationData])
         .select();
      return { data, error };
   },

   // Insurance Companies
   async getInsuranceCompanies() {
      const { data, error } = await supabase
         .from("insurance_companies")
         .select("*")
         .eq("is_active", true)
         .order("name");
      return { data, error };
   },

   async createInsuranceCompany(insuranceData) {
      const { data, error } = await supabase
         .from("insurance_companies")
         .insert([insuranceData])
         .select();
      return { data, error };
   },

   // Providers
   async getProviders() {
      const { data, error } = await supabase
         .from("providers")
         .select(
            `
        *,
        locations (location_name)
      `
         )
         .eq("is_active", true)
         .order("name");
      return { data, error };
   },

   async createProvider(providerData) {
      const { data, error } = await supabase
         .from("providers")
         .insert([providerData])
         .select();
      return { data, error };
   },

   // Diagnosis Codes
   async getDiagnosisCodes(filters = {}) {
      let query = supabase
         .from("diagnosis_codes")
         .select("*")
         .eq("is_active", true);

      if (filters.search) {
         query = query.or(
            `diagnosis_code.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
         );
      }
      if (filters.category) {
         query = query.eq("category", filters.category);
      }

      const { data, error } = await query.order("diagnosis_code");
      return { data, error };
   },

   // Procedures
   async getProcedures(filters = {}) {
      let query = supabase
         .from("procedures")
         .select(
            `
        *,
        locations (location_name)
      `
         )
         .eq("is_active", true);

      if (filters.specialty) {
         query = query.eq("specialty", filters.specialty);
      }
      if (filters.search) {
         query = query.or(
            `procedure_code.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
         );
      }

      const { data, error } = await query.order("procedure_code");
      return { data, error };
   },

   // Modifiers
   async getModifiers(specialty = null) {
      let query = supabase.from("modifiers").select("*").eq("is_active", true);

      if (specialty) {
         query = query.eq("specialty", specialty);
      }

      const { data, error } = await query.order("modifier_name");
      return { data, error };
   },
};
```

#### 5. Dashboard Service

```javascript
// services/dashboardService.js
import { supabase } from "../supabaseClient";

export const dashboardService = {
   async getDashboardStats(dateRange = {}) {
      const today = new Date().toISOString().split("T")[0];

      // Today's appointments
      const { count: todayAppointments } = await supabase
         .from("appointments")
         .select("*", { count: "exact", head: true })
         .eq("appointment_date", today)
         .neq("status", "Cancelled");

      // Total patients
      const { count: totalPatients } = await supabase
         .from("patients")
         .select("*", { count: "exact", head: true })
         .eq("is_active", true);

      // This week's completed appointments
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);

      const { count: weeklyAppointments } = await supabase
         .from("appointments")
         .select("*", { count: "exact", head: true })
         .gte("appointment_date", startOfWeek.toISOString().split("T")[0])
         .lte("appointment_date", endOfWeek.toISOString().split("T")[0])
         .eq("status", "Completed");

      // Recent appointments
      const { data: recentAppointments } = await supabase
         .from("appointments")
         .select(
            `
        *,
        patients (first_name, last_name),
        providers (name)
      `
         )
         .order("created_at", { ascending: false })
         .limit(10);

      return {
         stats: {
            todayAppointments: todayAppointments || 0,
            totalPatients: totalPatients || 0,
            weeklyAppointments: weeklyAppointments || 0,
         },
         recentAppointments: recentAppointments || [],
      };
   },

   async getAppointmentTrends(days = 30) {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      const { data, error } = await supabase
         .from("appointments")
         .select("appointment_date, status")
         .gte("appointment_date", startDate.toISOString().split("T")[0])
         .lte("appointment_date", endDate.toISOString().split("T")[0]);

      return { data, error };
   },
};
```

## Implementation Guide

### 1. Supabase Project Setup

#### Step 1: Create Supabase Project

```bash
# Visit https://supabase.com and create a new project
# Note down your project URL and anon key
```

#### Step 2: Database Migration

```sql
-- Run the SQL schema provided above in Supabase SQL Editor
-- Create tables in this order to respect foreign key dependencies:
-- 1. profiles
-- 2. locations
-- 3. insurance_companies
-- 4. providers
-- 5. diagnosis_codes
-- 6. procedures
-- 7. modifiers
-- 8. patients
-- 9. patient_insurance
-- 10. patient_employers
-- 11. appointments
-- 12. appointment_procedures
-- 13. appointment_diagnoses
-- 14. deleted_visits
-- 15. system_settings
```

#### Step 3: Enable Real-time (Optional)

```sql
-- Enable real-time for tables that need live updates
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE patients;
```

### 2. Frontend Integration Setup

#### Install Supabase Client

```bash
cd /Users/vijay/Developer/Work/Projects/Kreative\ Peeps/medcosta-client
npm install @supabase/supabase-js
```

#### Environment Configuration

```bash
# Create .env.local file
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Update Package.json Dependencies

```json
{
   "dependencies": {
      "@supabase/supabase-js": "^2.38.0",
      "date-fns": "^3.6.0",
      "axios": "^1.9.0"
   }
}
```

### 3. Migration from Current Backend

#### Current API Endpoints to Supabase Mapping

```javascript
// Current: http://localhost/medcosta/index.php/save_patient
// New: patientService.createPatient(patientData)

// Current: http://localhost/medcosta/index.php/modifier/get_modifier_data
// New: masterDataService.getModifiers()

// Current: http://localhost/medcosta/newappointment/add_appointment
// New: appointmentService.createAppointment(appointmentData)
```

### 4. Authentication Integration

#### Auth Context Update

```javascript
// contexts/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const useAuth = () => {
   return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
         setUser(session?.user ?? null);
         setLoading(false);
      });

      // Listen for auth changes
      const {
         data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
         setUser(session?.user ?? null);
         setLoading(false);
      });

      return () => subscription?.unsubscribe();
   }, []);

   const value = {
      user,
      signIn: (email, password) =>
         supabase.auth.signInWithPassword({ email, password }),
      signOut: () => supabase.auth.signOut(),
      loading,
   };

   return (
      <AuthContext.Provider value={value}>
         {!loading && children}
      </AuthContext.Provider>
   );
};
```

## Frontend Integration

### 1. Update Existing Components

#### Patient Registration Component

```javascript
// pages/PatientRegistration.jsx - Updated for Supabase
import { patientService } from "../services/patientService";

const PatientRegistration = () => {
   const handleSubmit = async (formData) => {
      try {
         const { data, error } = await patientService.createPatient(formData);

         if (error) {
            throw error;
         }

         alert("Patient registered successfully!");
         navigate("/dataentry/patient-entry");
      } catch (error) {
         console.error("Error submitting form:", error);
         alert("Error occurred during registration.");
      }
   };

   // Rest of component remains the same
};
```

#### Appointment Management

```javascript
// pages/NewAppointment.jsx - Updated for Supabase
import { appointmentService } from "../services/appointmentService";

const NewAppointment = () => {
   useEffect(() => {
      const fetchAppointments = async () => {
         try {
            const { data, error } = await appointmentService.getAppointments();

            if (error) {
               throw error;
            }

            const formattedAppointments = data.map((appointment) => ({
               id: appointment.id,
               title: `${appointment.patients.first_name} ${appointment.patients.last_name} - ${appointment.providers.name}`,
               start: new Date(
                  `${appointment.appointment_date}T${appointment.appointment_time}`
               ),
               end:
                  new Date(
                     `${appointment.appointment_date}T${appointment.appointment_time}`
                  ).getTime() +
                  30 * 60000,
            }));

            setAppointments(formattedAppointments);
         } catch (error) {
            console.error("Error fetching appointments:", error);
         }
      };

      fetchAppointments();
   }, []);

   // Rest of component logic...
};
```

### 2. Real-time Updates

#### Appointment Real-time Subscription

```javascript
// hooks/useRealtimeAppointments.js
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export const useRealtimeAppointments = () => {
   const [appointments, setAppointments] = useState([]);

   useEffect(() => {
      // Initial fetch
      const fetchAppointments = async () => {
         const { data } = await supabase.from("appointments").select(`
          *,
          patients (first_name, last_name),
          providers (name)
        `);
         setAppointments(data || []);
      };

      fetchAppointments();

      // Subscribe to changes
      const subscription = supabase
         .channel("appointments_channel")
         .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "appointments" },
            (payload) => {
               console.log("Appointment change received!", payload);
               fetchAppointments(); // Refetch data
            }
         )
         .subscribe();

      return () => {
         supabase.removeChannel(subscription);
      };
   }, []);

   return appointments;
};
```

## Deployment Strategy

### 1. Environment Setup

#### Development Environment

```bash
# .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_ENVIRONMENT=development
```

#### Production Environment

```bash
# .env.production
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_ENVIRONMENT=production
```

### 2. Database Security

#### Row Level Security Policies

```sql
-- Comprehensive RLS setup for production

-- Patients - healthcare providers can see patients
CREATE POLICY "Healthcare providers can view patients" ON patients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'doctor', 'nurse', 'receptionist')
    )
  );

-- Appointments - users can see relevant appointments
CREATE POLICY "Users can view relevant appointments" ON appointments
  FOR SELECT USING (
    patient_id IN (
      SELECT id FROM patients
      WHERE created_by = auth.uid()
    ) OR
    provider_id IN (
      SELECT id FROM providers
      WHERE created_by = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'doctor', 'nurse', 'receptionist')
    )
  );
```

### 3. Performance Optimization

#### Database Indexes

```sql
-- Performance indexes for common queries
CREATE INDEX CONCURRENTLY idx_appointments_composite
  ON appointments(appointment_date, provider_id, status);

CREATE INDEX CONCURRENTLY idx_patients_search
  ON patients USING gin(to_tsvector('english', first_name || ' ' || last_name));

CREATE INDEX CONCURRENTLY idx_procedures_search
  ON procedures USING gin(to_tsvector('english', procedure_code || ' ' || description));
```

#### Supabase Configuration

```javascript
// supabaseClient.js - Production optimized
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
   auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
   },
   db: {
      schema: "public",
   },
   global: {
      headers: { "x-my-custom-header": "medcosta-app" },
   },
});
```

### 4. Data Migration Plan

#### Step 1: Export Current Data

```bash
# Export from current PHP/MySQL system
mysqldump -u username -p medcosta_db > medcosta_backup.sql
```

#### Step 2: Transform and Import

```sql
-- Create migration scripts to transform data from MySQL to PostgreSQL format
-- Handle data type conversions, UUID generation, etc.

-- Example patient migration
INSERT INTO patients (
  id,
  patient_number,
  first_name,
  last_name,
  date_of_birth,
  -- ... other fields
  created_at
)
SELECT
  gen_random_uuid(),
  patient_id,
  first_name,
  last_name,
  STR_TO_DATE(dob, '%m/%d/%Y'),
  -- ... transform other fields
  COALESCE(created_date, NOW())
FROM old_patients_table;
```

### 5. Monitoring and Maintenance

#### Health Checks

```javascript
// utils/healthCheck.js
export const healthCheck = async () => {
   try {
      const { data, error } = await supabase
         .from("system_settings")
         .select("setting_key")
         .limit(1);

      return !error;
   } catch {
      return false;
   }
};
```

#### Error Handling

```javascript
// utils/errorHandler.js
export const handleSupabaseError = (error) => {
   console.error("Supabase Error:", error);

   if (error.code === "PGRST116") {
      return "No data found matching your criteria";
   }

   if (error.message.includes("duplicate key")) {
      return "A record with this information already exists";
   }

   return "An unexpected error occurred. Please try again.";
};
```

## Conclusion

This comprehensive Supabase backend architecture provides:

1. **Scalable Database Design**: PostgreSQL with proper relationships and
   indexes
2. **Security**: Row Level Security policies and authentication
3. **Real-time Capabilities**: Live updates for appointments and patient data
4. **Modern API**: Type-safe JavaScript services
5. **Performance**: Optimized queries and caching strategies
6. **Deployment Ready**: Production configuration and monitoring

The migration from your current PHP backend to Supabase will provide better
scalability, real-time features, and modern development experience while
maintaining all existing functionality.
