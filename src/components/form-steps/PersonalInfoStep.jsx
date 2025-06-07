import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CustomSelect } from "@/components/ui/custom-select";
import { DatePicker } from "@/components/ui/date-picker";
import { Card, CardContent } from "@/components/ui/card";
import { User, Phone, MapPin, Heart } from "lucide-react";

export function PersonalInfoStep({ data, onDataChange }) {
   const [formData, setFormData] = useState({
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      dob: data.dob || "",
      city: data.city || "",
      ssn: data.ssn || "",
      address: data.address || "",
      home_phone: data.home_phone || "",
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
            <div className='p-2 bg-blue-100 rounded-lg'>
               <User className='h-6 w-6 text-blue-600' />
            </div>
            <div>
               <h3 className='text-lg font-semibold text-gray-900'>
                  Personal Information
               </h3>
               <p className='text-gray-600'>
                  Please provide the patient's basic information
               </p>
            </div>
         </div>

         <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
               <Label
                  htmlFor='first_name'
                  className='text-sm font-medium text-gray-700'
               >
                  First Name *
               </Label>
               <Input
                  id='first_name'
                  name='first_name'
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder='Enter first name'
                  required
                  className='h-11'
               />
            </div>

            <div className='space-y-2'>
               <Label
                  htmlFor='last_name'
                  className='text-sm font-medium text-gray-700'
               >
                  Last Name *
               </Label>
               <Input
                  id='last_name'
                  name='last_name'
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder='Enter last name'
                  required
                  className='h-11'
               />
            </div>

            <div className='space-y-2'>
               <Label
                  htmlFor='dob'
                  className='text-sm font-medium text-gray-700'
               >
                  Date of Birth *
               </Label>
               <DatePicker
                  name='dob'
                  value={formData.dob}
                  onChange={handleChange}
                  className='h-11'
               />
            </div>

            <div className='space-y-2'>
               <Label
                  htmlFor='ssn'
                  className='text-sm font-medium text-gray-700'
               >
                  SSN # *
               </Label>
               <Input
                  id='ssn'
                  name='ssn'
                  value={formData.ssn}
                  onChange={handleChange}
                  placeholder='XXX-XX-XXXX'
                  required
                  className='h-11'
               />
            </div>

            <div className='space-y-2'>
               <Label
                  htmlFor='home_phone'
                  className='text-sm font-medium text-gray-700'
               >
                  Phone Number
               </Label>
               <Input
                  id='home_phone'
                  name='home_phone'
                  value={formData.home_phone}
                  onChange={handleChange}
                  placeholder='(XXX) XXX-XXXX'
                  className='h-11'
               />
            </div>

            <div className='space-y-2'>
               <Label
                  htmlFor='city'
                  className='text-sm font-medium text-gray-700'
               >
                  City
               </Label>
               <Input
                  id='city'
                  name='city'
                  value={formData.city}
                  onChange={handleChange}
                  placeholder='Enter city'
                  className='h-11'
               />
            </div>

            <div className='md:col-span-2 space-y-2'>
               <Label
                  htmlFor='address'
                  className='text-sm font-medium text-gray-700'
               >
                  Address
               </Label>
               <Input
                  id='address'
                  name='address'
                  value={formData.address}
                  onChange={handleChange}
                  placeholder='Enter full address'
                  className='h-11'
               />
            </div>
         </div>
      </div>
   );
}
