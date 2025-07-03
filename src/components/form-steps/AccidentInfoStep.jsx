import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
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

   // Handle date filed selection separately
   const handleDateChange = (date) => {
      const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
      const updatedData = { ...formData, date_filed: formattedDate };
      setFormData(updatedData);
      onDataChange(updatedData);
   };

   return (
      <div className='space-y-6'>
         <div className='flex items-center space-x-3 mb-6'>
            <div className='p-2 bg-accent/10 rounded-lg'>
               <FileText className='h-6 w-6 text-accent' />
            </div>
            <div>
               <h3 className='text-lg font-semibold text-foreground'>
                  Accident & Case Information
               </h3>
               <p className='text-muted-foreground'>
                  Please provide accident and case details
               </p>
            </div>
         </div>

         <Card className='border-0 shadow-sm bg-card/80'>
            <CardContent className='p-6'>
               <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                     <Label htmlFor='case_type' className='text-sm font-medium'>
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
                        className='text-sm font-medium'
                     >
                        Date Filed *
                     </Label>
                     <Popover>
                        <PopoverTrigger asChild>
                           <Button
                              variant={"outline"}
                              className={cn(
                                 "w-full h-11 justify-start text-left font-normal",
                                 !formData.date_filed && "text-muted-foreground"
                              )}
                           >
                              <CalendarIcon className='mr-2 h-4 w-4' />
                              {formData.date_filed ? (
                                 format(new Date(formData.date_filed), "PPP")
                              ) : (
                                 <span>Select filed date</span>
                              )}
                           </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0'>
                           <Calendar
                              mode='single'
                              selected={
                                 formData.date_filed
                                    ? new Date(formData.date_filed)
                                    : undefined
                              }
                              onSelect={handleDateChange}
                              initialFocus
                           />
                        </PopoverContent>
                     </Popover>
                  </div>

                  <div className='md:col-span-2 space-y-2'>
                     <Label
                        htmlFor='state_filed'
                        className='text-sm font-medium'
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
