import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import DeleteTable from "@/pages/DeleteTable";
import DiagnosisTable from "@/pages/DiagnosisTable";
import InsuranceTable from "@/pages/InsuranceTable";
import LocationTable from "@/pages/LocationTable";
import ModifierTable from "@/pages/ModifierTable";
import NewAppointment from "@/pages/NewAppointment";
import PatientRegistration from "@/pages/PatientRegistration";
import ProcedureTable from "@/pages/ProcedureTable";
import ProviderTable from "@/pages/ProviderTable";
import React from "react";
import { Routes, Route } from "react-router-dom";  

const Routing = () => {
  return (
    // Remove the Router wrapper, keep only Routes
    <Routes>
      {/* Public routes without sidebar */}
      {/* <Route path="/" element={<Home />} />
      <Route path="/billing/" element={<Login />} />
      <Route path="/doctor" element={<Signup />} /> */}

      {/* Protected routes with sidebar layout */}
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
         <Route
            path="/dataentry/patient-entry"
            element={<PatientRegistration />}
          />
        <Route
            path="/dataentry/insurance-master"
            element={<InsuranceTable />}
          />
          <Route
            path="/dataentry/diagnosis-code"
            element={<DiagnosisTable />}
          />
           <Route path="/dataentry/location" element={<LocationTable />} />
          <Route
            path="/dataentry/provider-master"
            element={<ProviderTable />}
          />
          <Route path="/dataentry/delete-visit" element={<DeleteTable />} />
          <Route
            path="/dataentry/modifier-master"
            element={<ModifierTable />}
          />
          <Route
            path="/dataentry/procedure-master"
            element={<ProcedureTable />}
          />
          <Route path="/appointments/new" element={<NewAppointment />} />
         {/*  <Route path="/appointments/search" element={<SearchAppointment />} />  */}
        </Route>
      </Routes>
    
  );
};

export default Routing;
