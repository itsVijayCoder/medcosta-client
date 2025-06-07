import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
   FaCheck,
   FaChevronLeft,
   FaChevronRight,
   FaArrowRight,
   FaCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Helper components for conditional animation
const ConditionalMotion = ({
   enableAnimations,
   children,
   className,
   ...motionProps
}) => {
   if (enableAnimations) {
      return (
         <motion.div className={className} {...motionProps}>
            {children}
         </motion.div>
      );
   }
   return <div className={className}>{children}</div>;
};

const ConditionalAnimatePresence = ({
   enableAnimations,
   children,
   ...props
}) => {
   if (enableAnimations) {
      return <AnimatePresence {...props}>{children}</AnimatePresence>;
   }
   return <>{children}</>;
};

const ConditionalMotionButton = ({
   enableAnimations,
   children,
   className,
   whileHover,
   whileTap,
   ...buttonProps
}) => {
   if (enableAnimations) {
      return (
         <motion.button
            className={className}
            whileHover={whileHover}
            whileTap={whileTap}
            {...buttonProps}
         >
            {children}
         </motion.button>
      );
   }
   return (
      <button className={className} {...buttonProps}>
         {children}
      </button>
   );
};

export function MultiStepForm({
   steps = [],
   onSubmit,
   onStepChange,
   className = "",
   showProgress = true,
   allowSkip = false,
   enableAnimations = false,
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
      <div className={`w-full max-w-6xl mx-auto space-y-4 ${className}`}>
         {/* Enhanced Current Step Content */}
         <ConditionalAnimatePresence
            enableAnimations={enableAnimations}
            mode='wait'
         >
            <ConditionalMotion
               enableAnimations={enableAnimations}
               key={currentStep}
               initial={{ opacity: 0, x: 50, scale: 0.95 }}
               animate={{ opacity: 1, x: 0, scale: 1 }}
               exit={{ opacity: 0, x: -50, scale: 0.95 }}
               transition={{ duration: 0.4, ease: "easeInOut" }}
            >
               <Card className='border-0 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden'>
                  <CardHeader className='bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-gray-100/50 relative overflow-hidden'>
                     {/* Animated background pattern */}
                     <div className='absolute inset-0 opacity-30'>
                        <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.1),transparent_50%)] animate-pulse' />
                        <div
                           className='absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(139,92,246,0.1),transparent_50%)] animate-pulse'
                           style={{ animationDelay: "1s" }}
                        />
                     </div>

                     <div className='flex items-center justify-between relative z-10'>
                        <ConditionalMotion
                           enableAnimations={enableAnimations}
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: 0.2, duration: 0.3 }}
                        >
                           <CardTitle className='text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2'>
                              {currentStepData?.title}
                           </CardTitle>
                           {currentStepData?.description && (
                              <p className='text-gray-600 text-base leading-relaxed'>
                                 {currentStepData.description}
                              </p>
                           )}
                        </ConditionalMotion>
                        {/* {currentStepData?.badge && (
                           <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3, duration: 0.3 }}
                           >
                              <Badge
                                 variant='secondary'
                                 className='bg-blue-100 text-blue-700 border-blue-200 px-4 py-2 text-sm font-semibold'
                              >
                                 {currentStepData.badge}
                              </Badge>
                           </motion.div>
                        )} */}
                     </div>
                  </CardHeader>

                  <CardContent className='p-8 min-h-[500px] bg-gradient-to-br from-white to-gray-50/30'>
                     <ConditionalMotion
                        enableAnimations={enableAnimations}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        className='h-full'
                     >
                        {/* Render current step component */}
                        {currentStepData?.component && (
                           <currentStepData.component
                              data={formData}
                              onDataChange={updateFormData}
                              stepIndex={currentStep}
                              isLastStep={isLastStep}
                           />
                        )}
                     </ConditionalMotion>
                  </CardContent>
               </Card>
            </ConditionalMotion>
         </ConditionalAnimatePresence>

         {/* Enhanced Modern Step Navigation */}
         <ConditionalMotion
            enableAnimations={enableAnimations}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
         >
            <Card className=' border-0 shadow-xl bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40 backdrop-blur-sm overflow-hidden'>
               <CardContent className=' pb-6 px-4 sm:px-8'>
                  {/* Progress Bar Background */}
                  <div className='relative mb-8'>
                     <div className='absolute top-5 left-0 right-0 h-1 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full' />
                     <motion.div
                        className='absolute top-5 left-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full shadow-lg shadow-blue-500/30'
                        initial={enableAnimations ? { width: "0%" } : false}
                        animate={
                           enableAnimations
                              ? {
                                   width: `${
                                      (currentStep / (steps.length - 1)) * 100
                                   }%`,
                                }
                              : {}
                        }
                        transition={
                           enableAnimations
                              ? { duration: 0.6, ease: "easeInOut" }
                              : { duration: 0 }
                        }
                        style={
                           !enableAnimations
                              ? {
                                   width: `${
                                      (currentStep / (steps.length - 1)) * 100
                                   }%`,
                                }
                              : {}
                        }
                     />
                  </div>

                  {/* Desktop Enhanced Progress Steps */}
                  <div className='hidden md:flex items-center justify-between relative'>
                     {steps.map((step, index) => (
                        <ConditionalMotion
                           key={index}
                           enableAnimations={enableAnimations}
                           className='flex flex-col items-center relative z-10'
                           initial={{ opacity: 0, scale: 0.8 }}
                           animate={{ opacity: 1, scale: 1 }}
                           transition={{ delay: index * 0.1, duration: 0.3 }}
                        >
                           {/* Step Circle with Enhanced Design */}
                           <ConditionalMotionButton
                              enableAnimations={enableAnimations}
                              onClick={() => handleStepClick(index)}
                              disabled={
                                 !allowSkip &&
                                 !completedSteps.has(index - 1) &&
                                 index > currentStep
                              }
                              className={`
                                 relative flex items-center justify-center w-10 h-10 rounded-full border-3 
                                 transition-all duration-300 text-sm font-bold shadow-xl overflow-hidden
                                 ${
                                    index === currentStep
                                       ? "border-blue-500 bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-500/40 scale-110"
                                       : completedSteps.has(index)
                                       ? "border-green-500 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-green-500/30"
                                       : index < currentStep
                                       ? "border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 hover:from-blue-100 hover:to-blue-200"
                                       : "border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-500"
                                 }
                                 ${
                                    !allowSkip &&
                                    !completedSteps.has(index - 1) &&
                                    index > currentStep
                                       ? "cursor-not-allowed opacity-50"
                                       : "cursor-pointer hover:scale-105 hover:shadow-2xl"
                                 }
                              `}
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.95 }}
                           >
                              {/* Background Animation for Active Step */}
                              {index === currentStep && enableAnimations && (
                                 <motion.div
                                    className='absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full'
                                    animate={{
                                       scale: [1, 1.2, 1],
                                       opacity: [0.5, 0.2, 0.5],
                                    }}
                                    transition={{
                                       duration: 2,
                                       repeat: Infinity,
                                       ease: "easeInOut",
                                    }}
                                 />
                              )}

                              <ConditionalAnimatePresence
                                 enableAnimations={enableAnimations}
                                 mode='wait'
                              >
                                 {completedSteps.has(index) ? (
                                    <ConditionalMotion
                                       enableAnimations={enableAnimations}
                                       key='check'
                                       initial={{ scale: 0, rotate: -180 }}
                                       animate={{ scale: 1, rotate: 0 }}
                                       exit={{ scale: 0, rotate: 180 }}
                                       transition={{ duration: 0.3 }}
                                    >
                                       <FaCheck className='w-5 h-5' />
                                    </ConditionalMotion>
                                 ) : (
                                    <ConditionalMotion
                                       enableAnimations={enableAnimations}
                                       key='number'
                                       initial={{ scale: 0 }}
                                       animate={{ scale: 1 }}
                                       exit={{ scale: 0 }}
                                       transition={{ duration: 0.2 }}
                                       className='text-lg font-bold'
                                    >
                                       {index + 1}
                                    </ConditionalMotion>
                                 )}
                              </ConditionalAnimatePresence>
                           </ConditionalMotionButton>

                           {/* Enhanced Step Label */}
                           <ConditionalMotion
                              enableAnimations={enableAnimations}
                              className='mt-4 text-center max-w-[180px]'
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                 delay: index * 0.1 + 0.2,
                                 duration: 0.3,
                              }}
                           >
                              <div
                                 className={`
                                 text-sm font-semibold transition-all duration-300 leading-tight
                                 ${
                                    index === currentStep
                                       ? "text-blue-700 scale-105"
                                       : completedSteps.has(index)
                                       ? "text-green-600"
                                       : "text-gray-600"
                                 }
                              `}
                              >
                                 {step.label || step.title}
                              </div>
                              {/* <div
                                 className={`
                                 text-xs mt-1.5 transition-all duration-300 leading-tight
                                 ${
                                    index === currentStep
                                       ? "text-blue-600 font-medium"
                                       : completedSteps.has(index)
                                       ? "text-green-500"
                                       : "text-gray-500"
                                 }
                              `}
                              >
                                 {step.description || step.subtitle}
                              </div> */}
                           </ConditionalMotion>
                        </ConditionalMotion>
                     ))}
                  </div>

                  {/* Mobile Compact Stepper */}
                  <div className='md:hidden'>
                     <ConditionalMotion
                        enableAnimations={enableAnimations}
                        className='flex items-center justify-center space-x-2 mb-4'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                     >
                        {steps.map((step, index) => (
                           <ConditionalMotionButton
                              key={index}
                              enableAnimations={enableAnimations}
                              onClick={() => handleStepClick(index)}
                              disabled={
                                 !allowSkip &&
                                 !completedSteps.has(index - 1) &&
                                 index > currentStep
                              }
                              className={`
                                 w-3 h-3 rounded-full transition-all duration-300
                                 ${
                                    index === currentStep
                                       ? "bg-blue-500 scale-125 shadow-lg shadow-blue-500/50"
                                       : completedSteps.has(index)
                                       ? "bg-green-500 shadow-md shadow-green-500/30"
                                       : index <= currentStep
                                       ? "bg-blue-300"
                                       : "bg-gray-300"
                                 }
                              `}
                              whileTap={{ scale: 0.9 }}
                           />
                        ))}
                     </ConditionalMotion>

                     <ConditionalMotion
                        enableAnimations={enableAnimations}
                        className='text-center'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                     >
                        <h3
                           className={`
                           text-lg font-bold transition-colors duration-300
                           ${
                              currentStep === 0
                                 ? "text-blue-700"
                                 : currentStep === 1
                                 ? "text-orange-700"
                                 : currentStep === 2
                                 ? "text-green-700"
                                 : "text-purple-700"
                           }
                        `}
                        >
                           {currentStepData?.title}
                        </h3>
                        <p className='text-sm text-gray-600 mt-1'>
                           {currentStepData?.description}
                        </p>
                        <div className='text-xs text-gray-500 mt-2 bg-gray-100 px-3 py-1 rounded-full inline-block'>
                           Step {currentStep + 1} of {steps.length}
                        </div>
                     </ConditionalMotion>
                  </div>
               </CardContent>
            </Card>
         </ConditionalMotion>

         {/* Enhanced Navigation Buttons */}
         <ConditionalMotion
            enableAnimations={enableAnimations}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
         >
            <Card className=' border-0 shadow-xl bg-white/95 backdrop-blur-sm overflow-hidden'>
               <CardContent className='py-6 px-4 sm:px-8'>
                  <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
                     <ConditionalMotion
                        enableAnimations={enableAnimations}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                     >
                        <Button
                           variant='outline'
                           onClick={handlePrevious}
                           disabled={isFirstStep}
                           className={`
                              flex items-center gap-3 px-6 sm:px-8 py-3 border-2 text-base font-semibold
                              transition-all duration-300 rounded-xl w-full sm:w-auto
                              ${
                                 isFirstStep
                                    ? "opacity-50 cursor-not-allowed border-gray-200 text-gray-400"
                                    : "border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 hover:shadow-lg transform hover:-translate-y-0.5"
                              }
                           `}
                        >
                           <FaChevronLeft className='w-4 h-4' />
                           Previous
                        </Button>
                     </ConditionalMotion>

                     <div className='flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto'>
                        {/* Enhanced Progress indicator */}
                        <ConditionalMotion
                           enableAnimations={enableAnimations}
                           className='flex items-center gap-3 sm:gap-4 text-sm text-gray-600 bg-gray-50 px-4 sm:px-6 py-2 sm:py-3 rounded-full'
                           initial={{ opacity: 0, scale: 0.9 }}
                           animate={{ opacity: 1, scale: 1 }}
                           transition={{ delay: 0.5, duration: 0.3 }}
                        >
                           <span className='font-semibold text-xs sm:text-sm'>
                              Step {currentStep + 1} of {steps.length}
                           </span>
                           <div className='relative w-16 sm:w-20 h-2 bg-gray-200 rounded-full overflow-hidden'>
                              <motion.div
                                 className='absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-sm'
                                 initial={
                                    enableAnimations ? { width: "0%" } : false
                                 }
                                 animate={
                                    enableAnimations
                                       ? { width: `${progress}%` }
                                       : {}
                                 }
                                 transition={
                                    enableAnimations
                                       ? {
                                            duration: 0.6,
                                            ease: "easeInOut",
                                         }
                                       : { duration: 0 }
                                 }
                                 style={
                                    !enableAnimations
                                       ? { width: `${progress}%` }
                                       : {}
                                 }
                              />
                           </div>
                           <span className='font-bold text-blue-600 text-xs sm:text-sm'>
                              {Math.round(progress)}%
                           </span>
                        </ConditionalMotion>

                        <div className='flex items-center gap-3'>
                           {allowSkip && !isLastStep && (
                              <ConditionalMotion
                                 enableAnimations={enableAnimations}
                                 whileHover={{ scale: 1.02 }}
                                 whileTap={{ scale: 0.98 }}
                              >
                                 <Button
                                    variant='ghost'
                                    onClick={handleNext}
                                    className='text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-4 sm:px-6 py-2 rounded-xl transition-all duration-300'
                                 >
                                    Skip
                                 </Button>
                              </ConditionalMotion>
                           )}

                           <ConditionalMotion
                              enableAnimations={enableAnimations}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                           >
                              {isLastStep ? (
                                 <Button
                                    onClick={handleSubmit}
                                    className='flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 sm:px-10 py-3 text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl transform hover:-translate-y-0.5'
                                 >
                                    <FaCheck className='w-4 sm:w-5 h-4 sm:h-5' />
                                    <span className='hidden sm:inline'>
                                       Complete Registration
                                    </span>
                                    <span className='sm:hidden'>Complete</span>
                                 </Button>
                              ) : (
                                 <Button
                                    onClick={handleNext}
                                    className='flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 sm:px-10 py-3 text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl transform hover:-translate-y-0.5'
                                 >
                                    Continue
                                    <FaArrowRight className='w-4 h-4' />
                                 </Button>
                              )}
                           </ConditionalMotion>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </ConditionalMotion>
      </div>
   );
}
