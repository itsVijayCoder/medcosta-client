import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

const AppointmentDialog = ({
   open,
   onOpenChange,
   selectedTime,
   setSelectedTime, // Add this prop
   formData,
   setFormData,
   stateList,
   doctors,
   onSubmit,
   loading = false,
}) => {
   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className='max-w-2xl bg-white p-6'>
            <DialogHeader>
               <DialogTitle>New Appointment</DialogTitle>
               <DialogDescription>
                  {selectedTime
                     ? format(selectedTime, "PPP")
                     : "Select appointment date and time"}
               </DialogDescription>
            </DialogHeader>

            {/* Date and Time Selection */}
            <div className='grid gap-4 py-4'>
               <div className='grid grid-cols-2 gap-4'>
                  <div>
                     <label className='text-sm font-medium text-gray-700 mb-2 block'>
                        📅 Appointment Date
                     </label>
                     <Input
                        type='date'
                        value={
                           selectedTime
                              ? selectedTime.toISOString().split("T")[0]
                              : ""
                        }
                        onChange={(e) => {
                           if (e.target.value) {
                              const currentTime = selectedTime || new Date();
                              const newDate = new Date(e.target.value);
                              newDate.setHours(
                                 currentTime.getHours(),
                                 currentTime.getMinutes()
                              );
                              setSelectedTime(newDate);
                           }
                        }}
                        className='w-full'
                     />
                  </div>
                  <div>
                     <label className='text-sm font-medium text-gray-700 mb-2 block'>
                        ⏰ Appointment Time
                     </label>
                     <Select
                        value={
                           selectedTime
                              ? selectedTime.toTimeString().substring(0, 5)
                              : ""
                        }
                        onValueChange={(value) => {
                           if (value) {
                              const [hours, minutes] = value.split(":");
                              const newDateTime = selectedTime
                                 ? new Date(selectedTime)
                                 : new Date();
                              newDateTime.setHours(
                                 parseInt(hours),
                                 parseInt(minutes)
                              );
                              setSelectedTime(newDateTime);
                           }
                        }}
                     >
                        <SelectTrigger>
                           <SelectValue placeholder='Select Time' />
                        </SelectTrigger>
                        <SelectContent className='max-h-48'>
                           {Array.from({ length: 12 }, (_, hour) => {
                              const startHour = hour + 8; // Start from 8 AM
                              return Array.from({ length: 2 }, (_, half) => {
                                 const minutes = half * 30;
                                 const time = `${startHour
                                    .toString()
                                    .padStart(2, "0")}:${minutes
                                    .toString()
                                    .padStart(2, "0")}`;
                                 const displayTime = new Date(
                                    `2000-01-01T${time}`
                                 ).toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                 });
                                 return (
                                    <SelectItem
                                       key={time}
                                       value={time}
                                       className='cursor-pointer hover:bg-primary-50'
                                    >
                                       ⏰ {displayTime}
                                    </SelectItem>
                                 );
                              });
                           }).flat()}
                        </SelectContent>
                     </Select>
                  </div>
               </div>
            </div>

            <div className='grid gap-4 py-4'>
               {/* Personal Information */}
               <div className='grid grid-cols-2 gap-4'>
                  <Input
                     placeholder='First Name'
                     value={formData.firstName}
                     onChange={(e) =>
                        setFormData((prev) => ({
                           ...prev,
                           firstName: e.target.value,
                        }))
                     }
                  />
                  <Input
                     placeholder='Last Name'
                     value={formData.lastName}
                     onChange={(e) =>
                        setFormData((prev) => ({
                           ...prev,
                           lastName: e.target.value,
                        }))
                     }
                  />
               </div>

               {/* Date of Birth */}
               <div className='grid grid-cols-1 gap-4'>
                  <Input
                     placeholder='Date of Birth (YYYY-MM-DD)'
                     type='date'
                     value={formData.dateOfBirth || ""}
                     onChange={(e) =>
                        setFormData((prev) => ({
                           ...prev,
                           dateOfBirth: e.target.value,
                        }))
                     }
                  />
               </div>

               {/* Contact Information */}
               <div className='grid grid-cols-2 gap-4'>
                  <Input
                     placeholder='Email'
                     type='email'
                     value={formData.email}
                     onChange={(e) =>
                        setFormData((prev) => ({
                           ...prev,
                           email: e.target.value,
                        }))
                     }
                  />
                  <Input
                     placeholder='Phone'
                     value={formData.phone}
                     onChange={(e) =>
                        setFormData((prev) => ({
                           ...prev,
                           phone: e.target.value,
                        }))
                     }
                  />
               </div>

               {/* Address */}
               <div className='grid grid-cols-1 gap-4'>
                  <Input
                     placeholder='Address Line 1'
                     value={formData.addressLine1}
                     onChange={(e) =>
                        setFormData((prev) => ({
                           ...prev,
                           addressLine1: e.target.value,
                        }))
                     }
                  />
                  <Input
                     placeholder='Address Line 2'
                     value={formData.addressLine2}
                     onChange={(e) =>
                        setFormData((prev) => ({
                           ...prev,
                           addressLine2: e.target.value,
                        }))
                     }
                  />
               </div>

               {/* Location */}
               <div className='grid grid-cols-3 gap-4'>
                  <Input
                     placeholder='City'
                     value={formData.city}
                     onChange={(e) =>
                        setFormData((prev) => ({
                           ...prev,
                           city: e.target.value,
                        }))
                     }
                  />
                  <Select
                     value={formData.selectedState}
                     onValueChange={(value) =>
                        setFormData((prev) => ({
                           ...prev,
                           selectedState: value,
                        }))
                     }
                  >
                     <SelectTrigger>
                        <SelectValue placeholder='Select State' />
                     </SelectTrigger>
                     <SelectContent>
                        {stateList.map((state) => (
                           <SelectItem key={state.value} value={state.value}>
                              {state.label}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
                  <Input
                     placeholder='Pincode'
                     value={formData.pincode}
                     onChange={(e) =>
                        setFormData((prev) => ({
                           ...prev,
                           pincode: e.target.value,
                        }))
                     }
                  />
               </div>

               {/* Insurance */}
               <div className='grid grid-cols-2 gap-4'>
                  <Input
                     placeholder='Insurance Provider'
                     value={formData.insurance}
                     onChange={(e) =>
                        setFormData((prev) => ({
                           ...prev,
                           insurance: e.target.value,
                        }))
                     }
                  />
                  <Input
                     placeholder='Policy Number'
                     value={formData.policyNumber}
                     onChange={(e) =>
                        setFormData((prev) => ({
                           ...prev,
                           policyNumber: e.target.value,
                        }))
                     }
                  />
               </div>

               {/* Doctor Selection */}
               <div>
                  <label className='text-sm font-medium text-gray-700 mb-2 block'>
                     👨‍⚕️ Select Doctor *
                  </label>
                  <Select
                     value={formData.selectedDoctorName}
                     onValueChange={(value) => {
                        console.log("Doctor selected:", value);
                        setFormData((prev) => ({
                           ...prev,
                           selectedDoctorName: value,
                        }));
                     }}
                  >
                     <SelectTrigger>
                        <SelectValue placeholder='Select Doctor' />
                     </SelectTrigger>
                     <SelectContent>
                        {doctors.map((doctor) => (
                           <SelectItem key={doctor.id} value={doctor.name}>
                              <div className='flex items-center gap-2'>
                                 <span className='w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-sm font-medium text-primary-600'>
                                    {doctor.avatar}
                                 </span>
                                 <div>
                                    <div className='font-medium'>
                                       {doctor.name}
                                    </div>
                                    <div className='text-xs text-gray-500'>
                                       {doctor.specialty}
                                    </div>
                                 </div>
                              </div>
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
                  {doctors.length === 0 && (
                     <p className='text-xs text-error-500 mt-1'>
                        No doctors available. Please check the providers data.
                     </p>
                  )}
               </div>
            </div>
            <div className='flex justify-end gap-3 mt-6 pt-4 border-t'>
               <Button
                  variant='outline'
                  onClick={() => onOpenChange(false)}
                  className='px-6'
               >
                  Cancel
               </Button>
               <Button
                  onClick={() => {
                     console.log("🔵 Confirm button clicked in dialog");
                     onSubmit();
                  }}
                  disabled={loading}
                  className='px-6 bg-primary hover:bg-primary/90 disabled:opacity-50'
               >
                  {loading ? "Creating..." : "Confirm Appointment"}
               </Button>
            </div>
         </DialogContent>
      </Dialog>
   );
};

export default AppointmentDialog;
