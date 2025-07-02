import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CustomSelect } from "@/components/ui/custom-select";
import { Shield } from "lucide-react";
import { insuranceProviders } from "@/data";

export function InsuranceInfoStep({ data, onDataChange }) {
   const [formData, setFormData] = useState({
      insurance_name: data.insurance_name || "",
      claim: data.claim || "",
      policy_number: data.policy_number || "",
      ...data,
   });

   const handleChange = (e) => {
      const { name, value } = e.target;
      const updatedData = { ...formData, [name]: value };
      setFormData(updatedData);
      onDataChange(updatedData);
   };

   const handleSelectChange = (name, value) => {
      const updatedData = { ...formData, [name]: value };
      setFormData(updatedData);
      onDataChange(updatedData);
   };

   return (
      <div className='space-y-6'>
         <div className='flex items-center space-x-3 mb-6'>
            <div className='p-2 bg-success/10 rounded-lg'>
               <Shield className='h-6 w-6 text-success' />
            </div>
            <div>
               <h3 className='text-lg font-semibold text-foreground'>
                  Insurance Information
               </h3>
               <p className='text-muted-foreground'>
                  Please provide insurance coverage details
               </p>
            </div>
         </div>

         <Card className='border-0 shadow-sm bg-card/80'>
            <CardContent className='p-6'>
               <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='md:col-span-2 space-y-2'>
                     <Label
                        htmlFor='insurance_name'
                        className='text-sm font-medium'
                     >
                        Insurance Provider *
                     </Label>
                     <CustomSelect
                        value={formData.insurance_name}
                        onChange={(value) =>
                           handleSelectChange("insurance_name", value)
                        }
                        items={insuranceProviders}
                        placeholder='Select insurance provider'
                        className='h-11'
                     />
                  </div>

                  <div className='space-y-2'>
                     <Label htmlFor='claim' className='text-sm font-medium'>
                        Claim Number
                     </Label>
                     <Input
                        id='claim'
                        name='claim'
                        value={formData.claim}
                        onChange={handleChange}
                        placeholder='Enter claim number'
                        className='h-11'
                     />
                  </div>

                  <div className='space-y-2'>
                     <Label
                        htmlFor='policy_number'
                        className='text-sm font-medium'
                     >
                        Policy Number *
                     </Label>
                     <Input
                        id='policy_number'
                        name='policy_number'
                        value={formData.policy_number}
                        onChange={handleChange}
                        placeholder='Enter policy number'
                        required
                        className='h-11'
                     />
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
