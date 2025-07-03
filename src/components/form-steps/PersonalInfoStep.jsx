import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CustomSelect } from "@/components/ui/custom-select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
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

   // Handle date of birth selection separately
   const handleDateChange = (date) => {
      const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
      const updatedData = { ...formData, dob: formattedDate };
      setFormData(updatedData);
      onDataChange(updatedData);
   };

   return (
      <div className='space-y-6'>
         <div className='flex items-center space-x-3 mb-6'>
            <div className='p-2 bg-primary/10 rounded-lg'>
               <User className='h-6 w-6 text-primary' />
            </div>
            <div>
               <h3 className='text-lg font-semibold text-foreground'>
                  Personal Information
               </h3>
               <p className='text-muted-foreground'>
                  Please provide the patient's basic information
               </p>
            </div>
         </div>

         <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
               <Label htmlFor='first_name' className='text-sm font-medium'>
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
               <Label htmlFor='last_name' className='text-sm font-medium'>
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
               <Label htmlFor='dob' className='text-sm font-medium'>
                  Date of Birth *
               </Label>
               <Popover>
                  <PopoverTrigger asChild>
                     <Button
                        variant={"outline"}
                        className={cn(
                           "w-full h-11 justify-start text-left font-normal",
                           !formData.dob && "text-muted-foreground"
                        )}
                     >
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {formData.dob ? (
                           format(new Date(formData.dob), "PPP")
                        ) : (
                           <span>Select date of birth</span>
                        )}
                     </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0'>
                     <Calendar
                        mode='single'
                        selected={
                           formData.dob ? new Date(formData.dob) : undefined
                        }
                        onSelect={handleDateChange}
                        initialFocus
                     />
                  </PopoverContent>
               </Popover>
            </div>

            <div className='space-y-2'>
               <Label htmlFor='ssn' className='text-sm font-medium'>
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
               <Label htmlFor='home_phone' className='text-sm font-medium'>
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
               <Label htmlFor='city' className='text-sm font-medium'>
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
               <Label htmlFor='address' className='text-sm font-medium'>
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
