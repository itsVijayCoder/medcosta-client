# Complete Supabase Integration Setup Guide

## Step 1: Create Users in Supabase

Go to your Supabase Dashboard → Authentication → Users and create these users:

1. **Super Admin User**

   -  Email: `superadmin@medcosta.com`
   -  Password: `superadmin123456`
   -  Email confirm: ✅

2. **Admin User**

   -  Email: `admin@medcosta.com`
   -  Password: `admin123456`
   -  Email confirm: ✅

3. **Doctor User**
   -  Email: `doctor@medcosta.com`
   -  Password: `doctor123456`
   -  Email confirm: ✅

## Step 2: Update Database Schema and User Roles

Run these SQL scripts in your Supabase SQL Editor:

### 2a. Update Role Constraints

```sql
-- Copy and run the content from update_roles.sql
```

### 2b. Set User Profiles

```sql
-- Copy and run the content from update_admin_user.sql
```

## Step 3: Test Real-time Features

1. **Dashboard Real-time Stats**

   -  Login with any user
   -  Go to Dashboard
   -  Stats will now show real data from Supabase
   -  Changes update automatically

2. **Data Entry Real-time Updates**

   -  Go to Data Entry → Insurance Company
   -  Add a new insurance company
   -  See it appear in the table immediately
   -  Changes are reflected across all sessions

3. **Appointments Real-time Updates**
   -  Go to Appointments
   -  Create a new appointment
   -  See it appear on the calendar immediately
   -  Appointment data is stored in Supabase

## Step 4: Test Login with Different Users

Try logging in with:

-  `superadmin@medcosta.com` / `superadmin123456`
-  `admin@medcosta.com` / `admin123456`
-  `doctor@medcosta.com` / `doctor123456`

Each user should have different access levels based on their role.

## Features Implemented:

### ✅ Real-time Dashboard

-  Shows live patient count, appointment count, and other stats
-  Auto-updates when data changes
-  Uses Supabase subscriptions for real-time updates

### ✅ Real-time Data Entry

-  Insurance Table: Add/Edit/Delete with live updates
-  Patient Registration: Saves to Supabase
-  All master data tables will work similarly

### ✅ Real-time Appointments

-  Calendar shows appointments from Supabase
-  Creating appointments updates calendar immediately
-  Links patients and providers from database

### ✅ Multi-user Authentication

-  Three user types: Super Admin, Admin, Doctor
-  Role-based access control
-  Secure authentication with Supabase

## Next Steps:

1. Run the SQL scripts to complete setup
2. Test all features with different user roles
3. Add more master data (providers, diagnosis codes, etc.)
4. Customize permissions based on user roles

## Files Updated:

-  `src/App.jsx` - Supabase authentication
-  `src/pages/Login.jsx` - Multi-user login
-  `src/pages/Dashboard.jsx` - Real-time dashboard
-  `src/pages/PatientRegistration.jsx` - Supabase integration
-  `src/pages/InsuranceTable.jsx` - Real-time data operations
-  `src/pages/NewAppointment.jsx` - Real-time appointments
-  All service files for Supabase integration
