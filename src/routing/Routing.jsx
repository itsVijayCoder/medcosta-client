import Layout from "@/components/Layout";
import React, { useContext, lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "@/App";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Create a simpler lazy loading wrapper
const lazyLoad = (importFn) => {
   const LazyComponent = lazy(importFn);
   return (props) => (
      <Suspense fallback={<LoadingSpinner />}>
         <LazyComponent {...props} />
      </Suspense>
   );
};

// Lazy load components for code splitting with relative paths
const Dashboard = lazyLoad(() => import("../pages/Dashboard"));
const DeleteTable = lazyLoad(() => import("../pages/DeleteTable"));
const DiagnosisTable = lazyLoad(() => import("../pages/DiagnosisTable"));
const InsuranceTable = lazyLoad(() => import("../pages/InsuranceTable"));
const LocationTable = lazyLoad(() => import("../pages/LocationTable"));
const Login = lazyLoad(() => import("../pages/Login"));
const ModifierTable = lazyLoad(() => import("../pages/ModifierTable"));
const NewAppointment = lazyLoad(() => import("../pages/NewAppointment"));
const PatientRegistration = lazyLoad(() =>
   import("../pages/PatientRegistration")
);
const ProcedureTable = lazyLoad(() => import("../pages/ProcedureTable"));
const ProviderTable = lazyLoad(() => import("../pages/ProviderTable"));

// Protected route component
const ProtectedRoute = ({ children }) => {
   const { isAuthenticated } = useContext(AuthContext);
   const location = useLocation();

   // Check if user is authenticated
   if (!isAuthenticated) {
      // Save the attempted location for redirect after successful login
      console.log(
         "Access denied: Authentication required. Redirecting to login..."
      );

      // Redirect to login with location state to enable redirect back after login
      return (
         <Navigate
            to='/login'
            state={{
               from: location,
               message: "Please sign in to access this page",
            }}
            replace
         />
      );
   }

   // User is authenticated, render the protected content
   return children;
};

const Routing = () => {
   const { isAuthenticated } = useContext(AuthContext);

   return (
      <Routes>
         {/* Public routes without sidebar */}
         <Route
            path='/login'
            element={isAuthenticated ? <Navigate to='/' replace /> : <Login />}
         />

         {/* Protected routes with sidebar layout */}
         <Route
            path='/'
            element={
               <ProtectedRoute>
                  <Layout />
               </ProtectedRoute>
            }
         >
            <Route index element={<Dashboard />} />
            <Route
               path='dataentry/patient-entry'
               element={<PatientRegistration />}
            />
            <Route
               path='dataentry/insurance-master'
               element={<InsuranceTable />}
            />
            <Route
               path='dataentry/diagnosis-code'
               element={<DiagnosisTable />}
            />
            <Route path='dataentry/location' element={<LocationTable />} />
            <Route
               path='dataentry/provider-master'
               element={<ProviderTable />}
            />
            <Route path='dataentry/delete-visit' element={<DeleteTable />} />
            <Route
               path='dataentry/modifier-master'
               element={<ModifierTable />}
            />
            <Route
               path='dataentry/procedure-master'
               element={<ProcedureTable />}
            />
            <Route path='appointments/new' element={<NewAppointment />} />
            {/*  <Route path="appointments/search" element={<SearchAppointment />} />  */}
         </Route>
         {/* Catch all route - redirect to dashboard if authenticated, login otherwise */}
         <Route
            path='*'
            element={
               isAuthenticated ? (
                  <Navigate to='/' replace />
               ) : (
                  <Navigate to='/login' replace />
               )
            }
         />
      </Routes>
   );
};

export default Routing;
