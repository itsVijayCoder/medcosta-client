import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import DeleteTable from "@/pages/DeleteTable";
import DiagnosisTable from "@/pages/DiagnosisTable";
import InsuranceTable from "@/pages/InsuranceTable";
import LocationTable from "@/pages/LocationTable";
import Login from "@/pages/Login";
import ModifierTable from "@/pages/ModifierTable";
import NewAppointment from "@/pages/NewAppointment";
import PatientRegistration from "@/pages/PatientRegistration";
import ProcedureTable from "@/pages/ProcedureTable";
import ProviderTable from "@/pages/ProviderTable";
import React, { useContext } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "@/App";

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
