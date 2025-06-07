import React, { useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { MultiStepForm } from "@/components/ui/multi-step-form";
import { Button } from "@/components/ui/button";
import { User, FileText, Shield, Building2 } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

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
      first_name: "",
      last_name: "",
      dob: "",
      city: "",
      ssn: "",
      address: "",
      home_phone: "",
      case_type: "",
      date_filed: "",
      state_filed: "",
      insurance_name: "",
      claim: "",
      policy_number: "",
      employer_name: "",
      employer_city: "",
      employer_address: "",
      adjuster_name: "",
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
         const response = await fetch(
            "http://localhost/medcosta/index.php/save_patient",
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify(finalData),
            }
         );

         const data = await response.json();
         if (data.success) {
            alert("Patient registered successfully!");
            navigate("/dataentry/patient-entry");
         } else {
            alert("Failed to register patient.");
         }
      } catch (error) {
         console.error("Error submitting form:", error);
         alert("Error occurred during registration.");
      }
   };
   return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 relative overflow-hidden'>
         {/* Animation Toggle Button */}
         <div className='fixed top-20 right-4 z-50'>
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
