import React, { useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { MultiStepForm } from "@/components/ui/multi-step-form";
import { Button } from "@/components/ui/button";
import { User, FileText, Shield, Building2 } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { patientService } from "@/services/patientService";

// Create a custom lazy loading wrapper for form step components
const createLazyComponent = (importFn, exportName) => {
   const LazyComponent = lazy(() =>
      importFn().then((module) => ({ default: module[exportName] }))
   );

   return (props) => (
      <Suspense fallback={<LoadingSpinner />}>
         <LazyComponent {...props} />
      </Suspense>
   );
};

// Lazily load form step components with direct import functions
const PersonalInfoStep = createLazyComponent(
   () => import("../components/form-steps/PersonalInfoStep"),
   "PersonalInfoStep"
);
const AccidentInfoStep = createLazyComponent(
   () => import("../components/form-steps/AccidentInfoStep"),
   "AccidentInfoStep"
);
const InsuranceInfoStep = createLazyComponent(
   () => import("../components/form-steps/InsuranceInfoStep"),
   "InsuranceInfoStep"
);
const EmployerAdjusterStep = createLazyComponent(
   () => import("../components/form-steps/EmployerAdjusterStep"),
   "EmployerAdjusterStep"
);

const PatientRegistration = () => {
   const navigate = useNavigate();
   const [enableAnimations, setEnableAnimations] = useState(false);
   const [formData, setFormData] = useState({
      // Personal Information
      first_name: "",
      last_name: "",
      dob: "",
      ssn: "",
      gender: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      home_phone: "",
      mobile_phone: "",
      email: "",
      emergency_contact_name: "",
      emergency_contact_phone: "",
      emergency_contact_relationship: "",

      // Case Information
      case_type: "",
      date_filed: "",
      state_filed: "",

      // Insurance Information
      insurance_name: "",
      policy_number: "",
      group_number: "",
      subscriber_name: "",
      subscriber_dob: "",
      relationship: "",
      effective_date: "",
      termination_date: "",
      copay_amount: "",
      deductible_amount: "",

      // Employer Information
      employer_name: "",
      employer_address: "",
      employer_city: "",
      employer_state: "",
      employer_zip: "",
      employer_phone: "",
      adjuster_name: "",
      adjuster_phone: "",
      adjuster_email: "",
      claim_number: "",
      date_of_injury: "",
   });

   const steps = [
      {
         id: "personal",
         title: "Personal Information",
         description: "Basic patient details",
         icon: User,
         component: PersonalInfoStep,
      },
      {
         id: "accident",
         title: "Accident & Case Info",
         description: "Case and accident details",
         icon: FileText,
         component: AccidentInfoStep,
      },
      {
         id: "insurance",
         title: "Insurance Information",
         description: "Insurance coverage details",
         icon: Shield,
         component: InsuranceInfoStep,
      },
      {
         id: "employer",
         title: "Employer & Adjuster",
         description: "Work and adjuster information",
         icon: Building2,
         component: EmployerAdjusterStep,
      },
   ];

   const handleStepDataChange = (stepData) => {
      setFormData((prev) => ({ ...prev, ...stepData }));
   };

   const handleSubmit = async (finalData) => {
      try {
         console.log("Form data being submitted:", finalData);

         // Use Supabase service to create patient with all related data
         const { data, error } = await patientService.createPatient(finalData);

         if (error) {
            console.error("Patient creation error:", error);
            alert(`Error: ${error}`);
            return;
         }

         console.log("Patient created successfully:", data);
         alert("Patient registered successfully!");
         navigate("/dataentry/patient-entry");
      } catch (error) {
         console.error("Error submitting form:", error);
         alert("Error occurred during registration.");
      }
   };

   const testPermissions = async () => {
      try {
         console.log("=== TESTING PERMISSIONS FROM UI ===");
         const result = await patientService.testPermissions();
         console.log("Permission test result:", result);
         alert(
            `Permission Test Result: ${
               result.hasPermission ? "PASS" : "FAIL"
            }\n\nDetails:\n${JSON.stringify(result, null, 2)}`
         );
      } catch (error) {
         console.error("Permission test error:", error);
         alert(`Permission Test Error: ${error.message}`);
      }
   };

   return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 relative overflow-hidden'>
         {/* Animation Toggle Button */}
         <div className='fixed top-20 right-4 z-50 space-y-2'>
            <Button
               onClick={() => setEnableAnimations(!enableAnimations)}
               variant={enableAnimations ? "default" : "outline"}
               className={`
                  px-4 py-2 text-sm font-semibold rounded-lg shadow-lg transition-all duration-300
                  ${
                     enableAnimations
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300"
                  }
               `}
            >
               {enableAnimations ? "🎬 Animations ON" : "🎭 Animations OFF"}
            </Button>

            <Button
               onClick={testPermissions}
               variant='outline'
               className='block w-full px-4 py-2 text-sm font-semibold rounded-lg shadow-lg bg-yellow-50 hover:bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
            >
               🔐 Test Permissions
            </Button>
         </div>

         {/* Enhanced Background Pattern */}
         <div className='absolute inset-0 opacity-30'>
            <div className='absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob' />
            <div className='absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000' />
            <div className='absolute bottom-20 left-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000' />
         </div>

         <div className='max-w-5xl mx-auto relative z-10'>
            <div className='text-center mb-8 sm:mb-12'>
               <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-3 sm:mb-4 pb-2'>
                  Patient Registration
               </h1>
               {/* <p className='text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto'>
                  Complete the patient registration process step by step with
                  our modern, intuitive interface
               </p> */}
            </div>{" "}
            <MultiStepForm
               steps={steps}
               initialData={formData}
               onStepDataChange={handleStepDataChange}
               onSubmit={handleSubmit}
               onCancel={() => navigate(-1)}
               submitButtonText='Complete Registration'
               className='rounded-xl bg-transparent backdrop-blur-sm'
               enableAnimations={enableAnimations}
            />
         </div>
      </div>
   );
};

export default PatientRegistration;
