import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { FaCheck, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export function MultiStepForm({
   steps = [],
   onSubmit,
   onStepChange,
   className = "",
   showProgress = true,
   allowSkip = false,
}) {
   const [currentStep, setCurrentStep] = useState(0);
   const [completedSteps, setCompletedSteps] = useState(new Set());
   const [formData, setFormData] = useState({});

   const handleNext = () => {
      if (currentStep < steps.length - 1) {
         // Mark current step as completed
         const newCompleted = new Set(completedSteps);
         newCompleted.add(currentStep);
         setCompletedSteps(newCompleted);

         const nextStep = currentStep + 1;
         setCurrentStep(nextStep);
         onStepChange?.(nextStep, steps[nextStep]);
      }
   };

   const handlePrevious = () => {
      if (currentStep > 0) {
         const prevStep = currentStep - 1;
         setCurrentStep(prevStep);
         onStepChange?.(prevStep, steps[prevStep]);
      }
   };

   const handleStepClick = (stepIndex) => {
      if (
         allowSkip ||
         completedSteps.has(stepIndex - 1) ||
         stepIndex <= currentStep
      ) {
         setCurrentStep(stepIndex);
         onStepChange?.(stepIndex, steps[stepIndex]);
      }
   };

   const handleSubmit = () => {
      // Mark final step as completed
      const newCompleted = new Set(completedSteps);
      newCompleted.add(currentStep);
      setCompletedSteps(newCompleted);

      onSubmit?.(formData);
   };

   const updateFormData = (stepData) => {
      setFormData((prev) => ({ ...prev, ...stepData }));
   };

   const currentStepData = steps[currentStep];
   const isLastStep = currentStep === steps.length - 1;
   const isFirstStep = currentStep === 0;
   const progress = ((currentStep + 1) / steps.length) * 100;

   return (
      <div className={`w-full max-w-4xl mx-auto  ${className}`}>
         {/* Progress Indicator */}
         {/* {showProgress && (
            <Card>
               <CardContent className='pt-6'>
                  <div className='space-y-4'>
                     <div className='flex justify-between items-center'>
                        <span className='text-sm font-medium text-gray-600'>
                           Step {currentStep + 1} of {steps.length}
                        </span>
                        <span className='text-sm font-medium text-gray-600'>
                           {Math.round(progress)}% Complete
                        </span>
                     </div>
                     <Progress value={progress} className='h-2' />
                  </div>
               </CardContent>
            </Card>
         )} */}

         {/* Step Navigation */}
         <Card className='border-0 shadow-none'>
            <CardContent className='pt-6'>
               <div className='flex items-center justify-between overflow-x-auto pb-4'>
                  {steps.map((step, index) => (
                     <div
                        key={index}
                        className='flex items-center flex-shrink-0'
                     >
                        <button
                           onClick={() => handleStepClick(index)}
                           disabled={
                              !allowSkip &&
                              !completedSteps.has(index - 1) &&
                              index > currentStep
                           }
                           className={`
                    relative flex items-center justify-center w-10 h-10 rounded-full border-2 
                    transition-all duration-200 text-sm font-medium
                    ${
                       index === currentStep
                          ? "border-primary bg-primary text-white"
                          : completedSteps.has(index)
                          ? "border-green-500 bg-green-500 text-white"
                          : index < currentStep
                          ? "border-blue-300 bg-blue-100 text-blue-600 hover:bg-blue-200"
                          : "border-gray-300 bg-gray-100 text-gray-400"
                    }
                    ${
                       !allowSkip &&
                       !completedSteps.has(index - 1) &&
                       index > currentStep
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer hover:scale-105"
                    }
                  `}
                        >
                           {completedSteps.has(index) ? (
                              <FaCheck className='w-4 h-4' />
                           ) : (
                              index + 1
                           )}
                        </button>

                        {index < steps.length - 1 && (
                           <div
                              className={`
                    w-12 sm:w-20 h-0.5 mx-2 ml-16
                    ${
                       completedSteps.has(index)
                          ? "bg-green-300"
                          : "bg-gray-300"
                    }
                  `}
                           />
                        )}
                     </div>
                  ))}
               </div>

               {/* Step Labels */}
               {/* <div className='flex justify-between text-xs text-gray-600 mt-2 overflow-x-auto'>
                  {steps.map((step, index) => (
                     <div
                        key={index}
                        className='flex-shrink-0 text-center'
                        style={{ width: "40px" }}
                     >
                        <div className='truncate px-1'>{step.label} </div>
                     </div>
                  ))}
               </div> */}

               {/* <div className='space-y-4'>
                  <div className='flex justify-between items-center'>
                     <span className='text-sm font-medium text-gray-600'>
                        Step {currentStep + 1} of {steps.length}
                     </span>
                     <span className='text-sm font-medium text-gray-600'>
                        {Math.round(progress)}% Complete
                     </span>
                  </div>
                  <Progress value={progress} className='h-2' />
               </div> */}
            </CardContent>
         </Card>

         {/* Current Step Content */}
         <Card className='border-0 shadow-none pt-0'>
            {/* <CardHeader className='pt-0'> */}
            <div className='flex items-center justify-between'>
               {/* <div>
                     <CardTitle className='text-xl font-semibold'>
                        {currentStepData?.title}
                     </CardTitle>
                     {currentStepData?.description && (
                        <p className='text-gray-600 mt-1'>
                           {currentStepData.description}
                        </p>
                     )}
                  </div> */}
               {currentStepData?.badge && (
                  <Badge variant='secondary'>{currentStepData.badge}</Badge>
               )}
            </div>
            {/* </CardHeader> */}

            <CardContent className='pt-0'>
               {/* Render current step component */}
               {currentStepData?.component && (
                  <currentStepData.component
                     data={formData}
                     onDataChange={updateFormData}
                     stepIndex={currentStep}
                     isLastStep={isLastStep}
                  />
               )}
            </CardContent>
         </Card>

         {/* Navigation Buttons */}
         <Card className='border-0 shadow-lg hover:shadow-xl transition-all duration-300'>
            <CardContent className='pt-0'>
               <div className='flex justify-between items-center'>
                  <Button
                     variant='outline'
                     onClick={handlePrevious}
                     disabled={isFirstStep}
                     className='flex items-center gap-2'
                  >
                     <FaChevronLeft className='w-4 h-4' />
                     Previous
                  </Button>

                  <div className='flex items-center gap-2'>
                     {allowSkip && !isLastStep && (
                        <Button
                           variant='ghost'
                           onClick={handleNext}
                           className='text-gray-600'
                        >
                           Skip
                        </Button>
                     )}

                     {isLastStep ? (
                        <Button
                           onClick={handleSubmit}
                           className='flex items-center gap-2 bg-green-600 hover:bg-green-700'
                        >
                           <FaCheck className='w-4 h-4' />
                           Complete
                        </Button>
                     ) : (
                        <Button
                           onClick={handleNext}
                           className='flex items-center gap-2'
                        >
                           Next
                           <FaChevronRight className='w-4 h-4' />
                        </Button>
                     )}
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
