import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { CustomSelect } from "@/components/ui/custom-select";
import { FileText, CalendarIcon } from "lucide-react";
import { caseTypes, states } from "@/data";

export function AccidentInfoStep({ data, onDataChange }) {
   const [formData, setFormData] = useState({
      case_type: data.case_type || "",
      date_filed: data.date_filed || "",
      state_filed: data.state_filed || "",
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
            <div className='p-2 bg-orange-100 rounded-lg'>
               <FileText className='h-6 w-6 text-orange-600' />
            </div>
            <div>
               <h3 className='text-lg font-semibold text-gray-900'>
                  Accident & Case Information
               </h3>
               <p className='text-gray-600'>
                  Please provide accident and case details
               </p>
            </div>
         </div>

         <Card className='border-0 shadow-sm bg-gradient-to-br from-orange-50 to-amber-50'>
            <CardContent className='p-6'>
               <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                     <Label
                        htmlFor='case_type'
                        className='text-sm font-medium text-gray-700'
                     >
                        Case Type *
                     </Label>
                     <CustomSelect
                        value={formData.case_type}
                        onChange={(value) =>
                           handleSelectChange("case_type", value)
                        }
                        items={caseTypes}
                        placeholder='Select case type'
                        className='h-11'
                     />
                  </div>

                  <div className='space-y-2'>
                     <Label
                        htmlFor='date_filed'
                        className='text-sm font-medium text-gray-700'
                     >
                        Date Filed *
                     </Label>
                     <DatePicker
                        name='date_filed'
                        value={formData.date_filed}
                        onChange={handleChange}
                        className='h-11'
                     />
                  </div>

                  <div className='md:col-span-2 space-y-2'>
                     <Label
                        htmlFor='state_filed'
                        className='text-sm font-medium text-gray-700'
                     >
                        State Filed *
                     </Label>
                     <CustomSelect
                        value={formData.state_filed}
                        onChange={(value) =>
                           handleSelectChange("state_filed", value)
                        }
                        items={states}
                        placeholder='Select state'
                        className='h-11'
                     />
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
