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
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6'>
         <div className='max-w-4xl mx-auto'>
            <div className='text-center mb-8'>
               <h1 className='text-4xl font-bold text-gray-900 mb-2'>
                  Patient Registration
               </h1>
               <p className='text-lg text-gray-600'>
                  Complete the patient registration process step by step
               </p>
            </div>

            <MultiStepForm
               steps={steps}
               initialData={formData}
               onStepDataChange={handleStepDataChange}
               onSubmit={handleSubmit}
               onCancel={() => navigate(-1)}
               submitButtonText='Complete Registration'
               className=' rounded-xl shadow-xl bg-transparent backdrop-blur-sm '
            />
         </div>
      </div>
   );
};

export default PatientRegistration;
