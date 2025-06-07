import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MultiStepForm } from "@/components/ui/multi-step-form";
import { PersonalInfoStep } from "@/components/form-steps/PersonalInfoStep";
import { AccidentInfoStep } from "@/components/form-steps/AccidentInfoStep";
import { InsuranceInfoStep } from "@/components/form-steps/InsuranceInfoStep";
import { EmployerAdjusterStep } from "@/components/form-steps/EmployerAdjusterStep";
import { User, FileText, Shield, Building2 } from "lucide-react";

const PatientRegistration = () => {
   const navigate = useNavigate();
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
         {/* Enhanced Background Pattern */}
         <div className='absolute inset-0 opacity-30'>
            <div className='absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob' />
            <div className='absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000' />
            <div className='absolute bottom-20 left-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000' />
         </div>

         <div className='max-w-5xl mx-auto relative z-10'>
            <div className='text-center mb-8 sm:mb-12'>
               <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-3 sm:mb-4'>
                  Patient Registration
               </h1>
               {/* <p className='text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto'>
                  Complete the patient registration process step by step with
                  our modern, intuitive interface
               </p> */}
            </div>

            <MultiStepForm
               steps={steps}
               initialData={formData}
               onStepDataChange={handleStepDataChange}
               onSubmit={handleSubmit}
               onCancel={() => navigate(-1)}
               submitButtonText='Complete Registration'
               className='rounded-xl bg-transparent backdrop-blur-sm'
            />
         </div>
      </div>
   );
};

export default PatientRegistration;
