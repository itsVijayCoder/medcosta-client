import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, UserCheck } from "lucide-react";

export function EmployerAdjusterStep({ data, onDataChange }) {
   const [formData, setFormData] = useState({
      employer_name: data.employer_name || "",
      employer_city: data.employer_city || "",
      employer_address: data.employer_address || "",
      adjuster_name: data.adjuster_name || "",
      ...data,
   });

   const handleChange = (e) => {
      const { name, value } = e.target;
      const updatedData = { ...formData, [name]: value };
      setFormData(updatedData);
      onDataChange(updatedData);
   };

   return (
      <div className='space-y-6'>
         <div className='flex items-center space-x-3 mb-6'>
            <div className='p-2 bg-purple-100 rounded-lg'>
               <Building2 className='h-6 w-6 text-purple-600' />
            </div>
            <div>
               <h3 className='text-lg font-semibold text-gray-900'>
                  Employer & Adjuster Information
               </h3>
               <p className='text-gray-600'>
                  Please provide employer and adjuster details
               </p>
            </div>
         </div>

         <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Employer Information */}
            <Card className='border-0 shadow-sm bg-gradient-to-br from-purple-50 to-indigo-50'>
               <CardContent className='p-6'>
                  <div className='flex items-center space-x-2 mb-4'>
                     <Building2 className='h-5 w-5 text-purple-600' />
                     <h4 className='text-lg font-semibold text-gray-900'>
                        Employer Information
                     </h4>
                  </div>

                  <div className='space-y-4'>
                     <div className='space-y-2'>
                        <Label
                           htmlFor='employer_name'
                           className='text-sm font-medium text-gray-700'
                        >
                           Employer Name
                        </Label>
                        <Input
                           id='employer_name'
                           name='employer_name'
                           value={formData.employer_name}
                           onChange={handleChange}
                           placeholder='Enter employer name'
                           className='h-11'
                        />
                     </div>

                     <div className='space-y-2'>
                        <Label
                           htmlFor='employer_city'
                           className='text-sm font-medium text-gray-700'
                        >
                           City
                        </Label>
                        <Input
                           id='employer_city'
                           name='employer_city'
                           value={formData.employer_city}
                           onChange={handleChange}
                           placeholder='Enter city'
                           className='h-11'
                        />
                     </div>

                     <div className='space-y-2'>
                        <Label
                           htmlFor='employer_address'
                           className='text-sm font-medium text-gray-700'
                        >
                           Address
                        </Label>
                        <Input
                           id='employer_address'
                           name='employer_address'
                           value={formData.employer_address}
                           onChange={handleChange}
                           placeholder='Enter full address'
                           className='h-11'
                        />
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* Adjuster Information */}
            <Card className='border-0 shadow-sm bg-gradient-to-br from-indigo-50 to-blue-50'>
               <CardContent className='p-6'>
                  <div className='flex items-center space-x-2 mb-4'>
                     <UserCheck className='h-5 w-5 text-indigo-600' />
                     <h4 className='text-lg font-semibold text-gray-900'>
                        Adjuster Information
                     </h4>
                  </div>

                  <div className='space-y-4'>
                     <div className='space-y-2'>
                        <Label
                           htmlFor='adjuster_name'
                           className='text-sm font-medium text-gray-700'
                        >
                           Adjuster Name
                        </Label>
                        <Input
                           id='adjuster_name'
                           name='adjuster_name'
                           value={formData.adjuster_name}
                           onChange={handleChange}
                           placeholder='Enter adjuster name'
                           className='h-11'
                        />
                     </div>

                     {/* Placeholder for additional adjuster fields */}
                     <div className='space-y-2'>
                        <Label className='text-sm font-medium text-gray-700'>
                           Contact Information
                        </Label>
                        <div className='text-sm text-gray-500 italic'>
                           Additional adjuster details can be added during case
                           processing
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
