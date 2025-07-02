# Supabase Implementation Steps

This guide provides step-by-step instructions for implementing the Supabase
backend for your MedCosta application.

## Prerequisites

1. **Supabase Account**: Create an account at
   [supabase.com](https://supabase.com)
2. **Node.js**: Ensure you have Node.js 16+ installed
3. **Git**: For version control

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   -  **Name**: `medcosta-backend`
   -  **Database Password**: Use a strong password
   -  **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for project creation (takes 1-2 minutes)

## Step 2: Configure Database

### 2.1 Run Migration Scripts

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy the entire content from `database_migration.sql`
4. Paste it into the SQL Editor
5. Click **Run** to execute all scripts
6. You should see "Success. No rows returned" indicating successful execution

### 2.2 Verify Schema

1. Go to **Table Editor** in your Supabase dashboard
2. Verify all tables are created:
   -  profiles
   -  locations
   -  insurance_companies
   -  providers
   -  diagnosis_codes
   -  procedures
   -  modifiers
   -  patients
   -  patient_insurance
   -  patient_employers
   -  appointments
   -  appointment_procedures
   -  appointment_diagnoses
   -  deleted_visits
   -  system_settings

## Step 3: Set Up Authentication

### 3.1 Configure Auth Settings

1. Go to **Authentication** > **Settings**
2. Configure the following:
   -  **Site URL**: `http://localhost:5173` (for development)
   -  **Redirect URLs**: Add your production URL when ready
   -  **Enable email confirmations**: Recommended for production

### 3.2 Create Admin User

1. Go to **Authentication** > **Users**
2. Click **Add user**
3. Fill in admin details:
   -  **Email**: your admin email
   -  **Password**: strong password
   -  **Email confirm**: true
4. After creation, go to **SQL Editor** and run:

```sql
-- Update the admin user's role
UPDATE profiles
SET role = 'admin', full_name = 'Admin User'
WHERE email = 'your-admin-email@example.com';
```

## Step 4: Frontend Integration

### 4.1 Install Dependencies

```bash
cd /Users/vijay/Developer/Work/Projects/Kreative\ Peeps/medcosta-client
npm install @supabase/supabase-js
```

### 4.2 Environment Variables

Create `.env.local` file in your project root:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**To find these values:**

1. Go to your Supabase dashboard
2. Click **Settings** > **API**
3. Copy the **URL** and **anon public** key

### 4.3 Update App.jsx with Supabase Auth

Replace your existing authentication logic in `App.jsx`:

```javascript
import React, { createContext, useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import Routing from "./routing/Routing";
import "./App.css";

export const AuthContext = createContext();

function App() {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);
   const [isAuthenticated, setIsAuthenticated] = useState(false);

   useEffect(() => {
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
         setUser(session?.user ?? null);
         setIsAuthenticated(!!session?.user);
         setLoading(false);
      });

      // Listen for auth changes
      const {
         data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
         setUser(session?.user ?? null);
         setIsAuthenticated(!!session?.user);
         setLoading(false);
      });

      return () => subscription?.unsubscribe();
   }, []);

   if (loading) {
      return (
         <div className='flex items-center justify-center min-h-screen'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
         </div>
      );
   }

   return (
      <AuthContext.Provider
         value={{
            user,
            isAuthenticated,
            loading,
         }}
      >
         <Routing />
      </AuthContext.Provider>
   );
}

export default App;
```

### 4.4 Update Login Component

Update your `Login.jsx` component:

```javascript
import React, { useState } from "react";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Login = () => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const navigate = useNavigate();

   const handleLogin = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      const { data, error: authError } = await authService.signIn(
         email,
         password
      );

      if (authError) {
         setError(authError);
      } else {
         navigate("/");
      }

      setLoading(false);
   };

   return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
         <div className='max-w-md w-full space-y-8'>
            <div>
               <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
                  Sign in to MedCosta
               </h2>
            </div>
            <form className='mt-8 space-y-6' onSubmit={handleLogin}>
               {error && (
                  <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
                     {error}
                  </div>
               )}
               <div>
                  <input
                     type='email'
                     required
                     className='appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                     placeholder='Email address'
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                  />
               </div>
               <div>
                  <input
                     type='password'
                     required
                     className='appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                     placeholder='Password'
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                  />
               </div>
               <div>
                  <button
                     type='submit'
                     disabled={loading}
                     className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
                  >
                     {loading ? "Signing in..." : "Sign in"}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
};

export default Login;
```

## Step 5: Update Existing Components

### 5.1 Update Patient Registration

```javascript
// pages/PatientRegistration.jsx
import { patientService } from "../services/patientService";

// In your handleSubmit function:
const handleSubmit = async (formData) => {
   try {
      const { data, error } = await patientService.createPatient(formData);

      if (error) {
         alert(`Error: ${error}`);
         return;
      }

      alert("Patient registered successfully!");
      navigate("/dataentry/patient-entry");
   } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error occurred during registration.");
   }
};
```

### 5.2 Update Appointment Management

```javascript
// pages/NewAppointment.jsx
import { appointmentService } from "../services/appointmentService";
import { patientService } from "../services/patientService";

// Replace your existing fetch calls:
useEffect(() => {
   const fetchAppointments = async () => {
      const { data, error } = await appointmentService.getAppointments();

      if (error) {
         console.error("Error fetching appointments:", error);
         return;
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
   };

   fetchAppointments();
}, []);
```

### 5.3 Update Master Data Components

For each master data component (Insurance, Provider, etc.), update the service
calls:

```javascript
// Example for InsuranceTable.jsx
import { masterDataService } from "../services/masterDataService";

// Replace existing fetch calls:
useEffect(() => {
   const fetchData = async () => {
      const { data, error } = await masterDataService.getInsuranceCompanies();
      if (data) setData(data);
      if (error) console.error("Error fetching insurance companies:", error);
   };
   fetchData();
}, []);

const handleAdd = async (insuranceData) => {
   const { data, error } = await masterDataService.createInsuranceCompany(
      insuranceData
   );
   if (data) {
      setData((prev) => [...prev, data]);
      alert("Insurance company added successfully");
   }
   if (error) alert(`Error: ${error}`);
};
```

## Step 6: Testing

### 6.1 Test Authentication

1. Start your development server: `npm run dev`
2. Go to `/login`
3. Try logging in with your admin credentials
4. Verify you're redirected to the dashboard

### 6.2 Test Patient Registration

1. Go to `/dataentry/patient-entry`
2. Fill out the patient form
3. Submit and verify data appears in Supabase dashboard

### 6.3 Test Appointments

1. Go to `/appointments/new`
2. Create a new appointment
3. Verify it appears in the calendar

## Step 7: Data Migration (Optional)

If you have existing data from your PHP backend:

### 7.1 Export Current Data

```bash
# Export from your current database
mysqldump -u username -p medcosta_db > current_data.sql
```

### 7.2 Transform and Import

Create transformation scripts to convert your existing data to match the new
schema. This will require mapping your current table structure to the new
Supabase tables.

## Step 8: Production Deployment

### 8.1 Update Environment Variables

For production deployment, update your environment variables:

```bash
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key
```

### 8.2 Configure Production Auth Settings

1. Go to Supabase dashboard > Authentication > Settings
2. Update **Site URL** to your production domain
3. Add production domain to **Redirect URLs**

### 8.3 Enable RLS Policies

Ensure all your RLS policies are properly configured for production security.

## Step 9: Monitoring and Maintenance

### 9.1 Set Up Monitoring

1. Go to Supabase dashboard > Observability
2. Monitor API usage, database performance, and error rates

### 9.2 Backup Strategy

1. Enable automatic backups in Supabase dashboard
2. Set up regular database dumps for critical data

## Troubleshooting

### Common Issues

1. **RLS Policy Errors**: Check that your policies allow the required operations
2. **CORS Issues**: Verify your site URL is correctly configured
3. **Connection Errors**: Check your environment variables are correct

### Getting Help

-  Supabase Documentation: [supabase.com/docs](https://supabase.com/docs)
-  Community Discord: [discord.supabase.com](https://discord.supabase.com)
-  GitHub Issues: For specific technical problems

## Next Steps

1. Implement real-time features using Supabase subscriptions
2. Add file upload functionality for patient documents
3. Implement advanced reporting with custom queries
4. Set up automated backups and monitoring
5. Add data validation and business rules

This completes your Supabase backend implementation. Your application will now
have a modern, scalable backend with real-time capabilities, robust
authentication, and excellent developer experience.
