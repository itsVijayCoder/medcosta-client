import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { addDays } from "date-fns";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import AppointmentDialog from "@/components/AppointmentDialog";
import { appointmentService } from "@/services/appointmentService";
import { patientService } from "@/services/patientService";
import { masterDataService } from "@/services/masterDataService";
import { supabase } from "@/lib/supabaseClient";

const NewAppointment = () => {
   const [appointments, setAppointments] = useState([]);
   const [currentDate, setCurrentDate] = useState(new Date());
   const [dialogOpen, setDialogOpen] = useState(false);
   const [selectedTime, setSelectedTime] = useState(null);
   const [stateList, setStateList] = useState([]);
   const [selectedDoctor, setSelectedDoctor] = useState(null);
   const [doctors, setDoctors] = useState([]);
   const [loading, setLoading] = useState(false);

   // Unified form data state
   const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      selectedState: "",
      pincode: "",
      insurance: "",
      policyNumber: "",
      selectedDoctorName: "",
      dateOfBirth: null,
      visitNumber: "",
   });

   const handleDateClick = (arg) => {
      setSelectedTime(arg.start);
      setDialogOpen(true);
   };

   // Fetch providers from Supabase
   useEffect(() => {
      const fetchDoctors = async () => {
         try {
            console.log("🏥 Fetching doctors from Supabase...");
            const { data: providers, error } =
               await masterDataService.getProviders();
            if (error) {
               console.error("Error fetching providers:", error);
               // Fallback to test doctors if there's an error
               const testDoctors = [
                  {
                     id: "a1111111-1111-1111-1111-111111111111",
                     name: "Dr. John Smith",
                     specialty: "Family Medicine",
                     avatar: "J",
                  },
                  {
                     id: "b2222222-2222-2222-2222-222222222222",
                     name: "Dr. Sarah Johnson",
                     specialty: "Internal Medicine",
                     avatar: "S",
                  },
                  {
                     id: "c3333333-3333-3333-3333-333333333333",
                     name: "Dr. Michael Brown",
                     specialty: "Cardiology",
                     avatar: "M",
                  },
                  {
                     id: "d4444444-4444-4444-4444-444444444444",
                     name: "Dr. Emily Davis",
                     specialty: "Orthopedics",
                     avatar: "E",
                  },
               ];
               console.log("👨‍⚕️ Using test doctors:", testDoctors);
               setDoctors(testDoctors);
               return;
            }

            console.log("📋 Raw providers data:", providers);

            if (!providers || providers.length === 0) {
               // Fallback to test doctors if no providers in database
               const testDoctors = [
                  {
                     id: "a1111111-1111-1111-1111-111111111111",
                     name: "Dr. John Smith",
                     specialty: "Family Medicine",
                     avatar: "J",
                  },
                  {
                     id: "b2222222-2222-2222-2222-222222222222",
                     name: "Dr. Sarah Johnson",
                     specialty: "Internal Medicine",
                     avatar: "S",
                  },
                  {
                     id: "c3333333-3333-3333-3333-333333333333",
                     name: "Dr. Michael Brown",
                     specialty: "Cardiology",
                     avatar: "M",
                  },
                  {
                     id: "d4444444-4444-4444-4444-444444444444",
                     name: "Dr. Emily Davis",
                     specialty: "Orthopedics",
                     avatar: "E",
                  },
               ];
               console.log(
                  "👨‍⚕️ No providers in database, using test doctors:",
                  testDoctors
               );
               setDoctors(testDoctors);
               return;
            }

            const formattedDoctors = providers.map((provider) => ({
               id: provider.id,
               name: provider.name,
               specialty: provider.specialty || "General Medicine",
               avatar: provider.name.charAt(0).toUpperCase(),
            }));

            console.log("👨‍⚕️ Formatted doctors:", formattedDoctors);
            setDoctors(formattedDoctors);
         } catch (error) {
            console.error("Error fetching doctors:", error);
            // Fallback to test doctors if there's an error
            const testDoctors = [
               {
                  id: "a1111111-1111-1111-1111-111111111111",
                  name: "Dr. John Smith",
                  specialty: "Family Medicine",
                  avatar: "J",
               },
               {
                  id: "b2222222-2222-2222-2222-222222222222",
                  name: "Dr. Sarah Johnson",
                  specialty: "Internal Medicine",
                  avatar: "S",
               },
               {
                  id: "c3333333-3333-3333-3333-333333333333",
                  name: "Dr. Michael Brown",
                  specialty: "Cardiology",
                  avatar: "M",
               },
               {
                  id: "d4444444-4444-4444-4444-444444444444",
                  name: "Dr. Emily Davis",
                  specialty: "Orthopedics",
                  avatar: "E",
               },
            ];
            console.log("👨‍⚕️ Error occurred, using test doctors:", testDoctors);
            setDoctors(testDoctors);
         }
      };

      fetchDoctors();

      // Initialize state list
      setStateList([
         { value: "TX", label: "Texas" },
         { value: "CA", label: "California" },
         { value: "FL", label: "Florida" },
         { value: "NY", label: "New York" },
         { value: "IL", label: "Illinois" },
      ]);
   }, []);

   // Function to fetch appointments from Supabase
   const fetchAppointments = async () => {
      try {
         const { data: appointmentsData, error } =
            await appointmentService.getAppointments();
         if (error) {
            console.error("Error fetching appointments:", error);
            return;
         }

         const formattedAppointments = appointmentsData.map((appointment) => ({
            id: appointment.id,
            title: `${appointment.patients?.first_name || ""} ${
               appointment.patients?.last_name || ""
            } - ${appointment.providers?.name || ""}`,
            start: new Date(
               `${appointment.appointment_date}T${appointment.appointment_time}`
            ),
            end:
               new Date(
                  `${appointment.appointment_date}T${appointment.appointment_time}`
               ).getTime() +
               (appointment.duration_minutes || 30) * 60000,
            extendedProps: {
               patient: appointment.patients,
               provider: appointment.providers,
               status: appointment.status,
            },
         }));

         setAppointments(formattedAppointments);
      } catch (error) {
         console.error("Error fetching appointments:", error);
      }
   };

   // Fetch appointments from Supabase with real-time updates
   useEffect(() => {
      fetchAppointments();

      // Set up real-time subscription for appointments
      const subscription = supabase
         .channel("appointments")
         .on(
            "postgres_changes",
            {
               event: "*",
               schema: "public",
               table: "appointments",
            },
            () => {
               fetchAppointments(); // Refresh appointments when changes occur
            }
         )
         .subscribe();

      return () => {
         subscription.unsubscribe();
      };
   }, []);

   // Fetch patient data and visit number
   useEffect(() => {
      const fetchPatientData = async () => {
         if (formData.firstName && formData.lastName && formData.dateOfBirth) {
            try {
               const { data: patients, error } =
                  await patientService.searchPatients({
                     first_name: formData.firstName,
                     last_name: formData.lastName,
                     date_of_birth: formData.dateOfBirth,
                  });

               if (error) {
                  console.error("Error fetching patient data:", error);
                  return;
               }

               if (patients && patients.length > 0) {
                  const patient = patients[0];

                  // Update formData with patient information
                  setFormData((prev) => ({
                     ...prev,
                     phone: patient.home_phone || patient.mobile_phone || "",
                     city: patient.city || "",
                     selectedState: patient.state || "",
                     pincode: patient.zip || "",
                     email: patient.email || "",
                     addressLine1: patient.address || "",
                     addressLine2: "",
                     insurance:
                        patient.patient_insurance?.[0]?.insurance_companies
                           ?.name || "",
                     policyNumber:
                        patient.patient_insurance?.[0]?.policy_number || "",
                  }));

                  // Generate visit number based on patient's appointment history
                  const { data: appointmentCount, error: countError } =
                     await appointmentService.getPatientAppointmentCount(
                        patient.id
                     );
                  if (!countError) {
                     setFormData((prev) => ({
                        ...prev,
                        visitNumber: `${patient.patient_number}-${
                           (appointmentCount || 0) + 1
                        }`,
                     }));
                  }
               }
            } catch (error) {
               console.error("Error fetching patient data:", error);
            }
         }
      };

      fetchPatientData();
   }, [formData.firstName, formData.lastName, formData.dateOfBirth]);

   // Handle appointment creation with Supabase
   const handleAddAppointment = async () => {
      console.log("🚀 handleAddAppointment called");
      console.log("📋 Form data:", formData);
      console.log("⏰ Selected time:", selectedTime);

      if (!selectedTime) {
         console.warn("⚠️ No time selected, aborting...");
         alert(
            "Please select both a date and time for the appointment using the date and time pickers in the form."
         );
         return;
      }

      if (
         !formData.firstName ||
         !formData.lastName ||
         !formData.selectedDoctorName
      ) {
         console.warn("⚠️ Missing required fields:", {
            firstName: formData.firstName,
            lastName: formData.lastName,
            selectedDoctorName: formData.selectedDoctorName,
         });
         alert(
            "Please fill in all required fields: First Name, Last Name, and Doctor"
         );
         return;
      }

      setLoading(true);
      console.log("🔄 Loading started...");

      try {
         console.log("Creating appointment with form data:", formData);

         // First, find or create the patient
         let patientId;
         const { data: existingPatients, error: searchError } =
            await patientService.searchPatients({
               first_name: formData.firstName,
               last_name: formData.lastName,
               date_of_birth: formData.dateOfBirth
                  ? new Date(formData.dateOfBirth).toISOString().split("T")[0]
                  : null,
            });

         if (searchError) {
            console.error("Error searching for patient:", searchError);
            alert("Error finding patient information");
            return;
         }

         if (existingPatients && existingPatients.length > 0) {
            patientId = existingPatients[0].id;
            console.log("Found existing patient:", patientId);
         } else {
            // Create new patient if not found
            const patientData = {
               first_name: formData.firstName,
               last_name: formData.lastName,
               date_of_birth: formData.dateOfBirth
                  ? new Date(formData.dateOfBirth).toISOString().split("T")[0]
                  : null,
               city: formData.city,
               state: formData.selectedState,
               zip: formData.pincode,
               email: formData.email,
               home_phone: formData.phone,
               address:
                  formData.addressLine1 +
                  (formData.addressLine2 ? ` ${formData.addressLine2}` : ""),
               case_type: "Regular",
            };

            console.log("Creating new patient with data:", patientData);
            const { data: newPatient, error: createPatientError } =
               await patientService.createPatient(patientData);
            if (createPatientError) {
               console.error("Error creating patient:", createPatientError);
               alert("Error creating patient record: " + createPatientError);
               return;
            }
            patientId = newPatient.id;
            console.log("Created new patient:", patientId);
         }

         // Find the selected doctor's ID
         const selectedDoctorObj = doctors.find(
            (doctor) => doctor.name === formData.selectedDoctorName
         );
         if (!selectedDoctorObj) {
            alert("Please select a valid doctor");
            return;
         }

         // Get the first available location (you might want to make this selectable)
         const { data: locations, error: locationError } =
            await masterDataService.getLocations();
         let locationId = null;
         if (!locationError && locations && locations.length > 0) {
            locationId = locations[0].id;
         }

         // Create the appointment
         const appointmentData = {
            patient_id: patientId,
            provider_id: selectedDoctorObj.id,
            location_id: locationId,
            appointment_date: selectedTime.toISOString().split("T")[0],
            appointment_time: selectedTime
               .toTimeString()
               .split(" ")[0]
               .substring(0, 5), // HH:MM format
            duration_minutes: 30,
            appointment_type: "Regular",
            status: "Scheduled",
            reason_for_visit: "General Consultation",
            visit_number: formData.visitNumber || `${patientId}-1`,
         };

         console.log("Creating appointment with data:", appointmentData);
         const { data: newAppointment, error: createAppointmentError } =
            await appointmentService.createAppointment(appointmentData);

         if (createAppointmentError) {
            console.error(
               "Error creating appointment:",
               createAppointmentError
            );
            alert("Error creating appointment: " + createAppointmentError);
            return;
         }

         console.log("Appointment created successfully:", newAppointment);
         alert("Appointment created successfully!");

         // Refresh appointments list
         fetchAppointments();

         // Reset form
         setDialogOpen(false);
         resetForm();
      } catch (error) {
         console.error("Error saving appointment:", error);
         alert("Failed to save appointment. Please try again.");
      } finally {
         setLoading(false);
      }
   };

   const resetForm = () => {
      setFormData({
         firstName: "",
         lastName: "",
         email: "",
         phone: "",
         addressLine1: "",
         addressLine2: "",
         city: "",
         selectedState: "",
         pincode: "",
         insurance: "",
         policyNumber: "",
         selectedDoctorName: "",
         dateOfBirth: null,
         visitNumber: "",
      });
      setSelectedTime(null);
   };

   const handleDoctorSelect = (doctor) => {
      setSelectedDoctor(doctor);
      setFormData((prev) => ({
         ...prev,
         selectedDoctorName: doctor.name,
      }));
   };
   const formatDateToUS = (isoDate) => {
      if (!isoDate) return "";
      const date = new Date(isoDate);
      return isNaN(date.getTime())
         ? ""
         : `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
   };

   return (
      <div className='min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6 relative overflow-hidden'>
         {/* Beautiful Background Pattern */}
         <div className='absolute inset-0 opacity-30'>
            <div className='absolute top-20 left-10 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl animate-blob' />
            <div className='absolute top-40 right-10 w-72 h-72 bg-secondary-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000' />
            <div className='absolute bottom-20 left-20 w-72 h-72 bg-accent-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000' />
         </div>

         <div className='max-w-[1400px] mx-auto space-y-6 relative z-10'>
            {/* Header */}
            <div className='flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border-0'>
               <div>
                  <h1 className='text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'>
                     📅 Appointments
                  </h1>
                  <p className='text-gray-600 mt-2 text-lg'>
                     Manage and schedule patient appointments with ease
                  </p>
               </div>
               <Button
                  className='bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200 text-white px-6 py-3 text-lg rounded-lg'
                  onClick={() => {
                     // Set default date and time when opening dialog
                     const defaultDateTime = new Date();
                     defaultDateTime.setHours(9, 0, 0, 0); // Default to 9:00 AM
                     setSelectedTime(defaultDateTime);
                     setDialogOpen(true);
                  }}
               >
                  <CalendarIcon className='mr-2 h-5 w-5' />✨ New Appointment
               </Button>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
               {/* Main Calendar */}
               <div className='lg:col-span-9'>
                  <Card className='shadow-lg border-0 bg-white/80 backdrop-blur-sm'>
                     <CardContent className='p-0'>
                        <div className='bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-t-lg'>
                           <h2 className='text-xl font-semibold text-white'>
                              📅 Appointment Calendar
                           </h2>
                        </div>
                        <div className='p-4'>
                           <FullCalendar
                              plugins={[
                                 dayGridPlugin,
                                 timeGridPlugin,
                                 interactionPlugin,
                              ]}
                              initialView='timeGridWeek'
                              headerToolbar={{
                                 left: "prev,next today",
                                 center: "title",
                                 right: "timeGridWeek,dayGridMonth",
                              }}
                              events={appointments}
                              selectable
                              select={handleDateClick}
                              height='750px'
                              slotMinTime='08:00:00'
                              slotMaxTime='20:00:00'
                              allDaySlot={false}
                              slotDuration='00:30:00'
                              eventContent={(eventInfo) => (
                                 <div className='p-2 text-xs rounded-md bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm border-l-4 border-white'>
                                    <div className='font-semibold flex items-center gap-1'>
                                       <span className='inline-block w-2 h-2 bg-white rounded-full'></span>
                                       {eventInfo.event.title}
                                    </div>
                                    <div className='mt-1 text-green-100'>
                                       ⏰{" "}
                                       {format(eventInfo.event.start, "h:mm a")}
                                    </div>
                                    {eventInfo.event.extendedProps?.patient && (
                                       <div className='mt-1 text-green-100 text-xs'>
                                          📞{" "}
                                          {eventInfo.event.extendedProps.patient
                                             .home_phone || "No phone"}
                                       </div>
                                    )}
                                 </div>
                              )}
                              eventClassNames='!bg-transparent !border-none'
                              dayHeaderClassNames='bg-gray-50 text-gray-700 font-medium py-3'
                              slotLabelClassNames='text-gray-600 text-sm'
                              viewClassNames='!border-gray-200'
                              eventMouseEnter={(info) => {
                                 info.el.style.transform = "scale(1.02)";
                                 info.el.style.transition =
                                    "transform 0.2s ease";
                                 info.el.style.zIndex = "999";
                              }}
                              eventMouseLeave={(info) => {
                                 info.el.style.transform = "scale(1)";
                                 info.el.style.zIndex = "1";
                              }}
                           />
                        </div>
                     </CardContent>
                  </Card>
               </div>

               {/* Sidebar */}
               <div className='lg:col-span-3 space-y-6'>
                  {/* Today's Appointments */}
                  <Card className='shadow-lg border-0 bg-gradient-to-br from-white to-green-50'>
                     <CardHeader className='bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg'>
                        <CardTitle className='text-lg font-semibold flex items-center gap-2'>
                           📋 Today's Appointments
                        </CardTitle>
                     </CardHeader>
                     <CardContent className='p-4'>
                        <ScrollArea className='h-[350px] pr-4'>
                           {appointments
                              .filter(
                                 (apt) =>
                                    format(apt.start, "yyyy-MM-dd") ===
                                    format(new Date(), "yyyy-MM-dd")
                              )
                              .map((apt, index) => (
                                 <div
                                    key={apt.id}
                                    className='mb-3 p-4 bg-white rounded-lg shadow-sm border-l-4 border-green-400 hover:shadow-md transition-shadow'
                                 >
                                    <div className='font-medium text-gray-800 flex items-center gap-2'>
                                       <span className='inline-block w-3 h-3 bg-green-400 rounded-full'></span>
                                       {apt.title}
                                    </div>
                                    <div className='text-sm text-gray-600 mt-1 flex items-center gap-1'>
                                       ⏰ {format(apt.start, "h:mm a")}
                                    </div>
                                    {apt.extendedProps?.patient && (
                                       <div className='text-xs text-gray-500 mt-2 flex items-center gap-1'>
                                          📞{" "}
                                          {apt.extendedProps.patient
                                             .home_phone || "No phone"}
                                       </div>
                                    )}
                                 </div>
                              ))}
                           {appointments.filter(
                              (apt) =>
                                 format(apt.start, "yyyy-MM-dd") ===
                                 format(new Date(), "yyyy-MM-dd")
                           ).length === 0 && (
                              <div className='text-center py-8 text-gray-500'>
                                 <div className='text-4xl mb-2'>🗓️</div>
                                 <p>No appointments today</p>
                              </div>
                           )}
                        </ScrollArea>
                     </CardContent>
                  </Card>

                  {/* Quick Stats */}
                  <Card className='shadow-lg border-0 bg-gradient-to-br from-white to-emerald-50'>
                     <CardHeader className='bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-t-lg'>
                        <CardTitle className='text-lg font-semibold flex items-center gap-2'>
                           📊 Overview
                        </CardTitle>
                     </CardHeader>
                     <CardContent className='p-4'>
                        <div className='space-y-4'>
                           <div className='flex justify-between items-center p-3 bg-white rounded-lg shadow-sm'>
                              <div className='flex items-center gap-2'>
                                 <span className='text-2xl'>📅</span>
                                 <span className='text-gray-600 font-medium'>
                                    Today's Appointments
                                 </span>
                              </div>
                              <span className='font-bold text-xl text-secondary-600'>
                                 {
                                    appointments.filter(
                                       (apt) =>
                                          format(apt.start, "yyyy-MM-dd") ===
                                          format(new Date(), "yyyy-MM-dd")
                                    ).length
                                 }
                              </span>
                           </div>
                           <div className='flex justify-between items-center p-3 bg-white rounded-lg shadow-sm'>
                              <div className='flex items-center gap-2'>
                                 <span className='text-2xl'>👨‍⚕️</span>
                                 <span className='text-gray-600 font-medium'>
                                    Total Doctors
                                 </span>
                              </div>
                              <span className='font-bold text-xl text-accent-600'>
                                 {doctors.length}
                              </span>
                           </div>
                           <div className='flex justify-between items-center p-3 bg-white rounded-lg shadow-sm'>
                              <div className='flex items-center gap-2'>
                                 <span className='text-2xl'>📋</span>
                                 <span className='text-gray-600 font-medium'>
                                    Total Appointments
                                 </span>
                              </div>
                              <span className='font-bold text-xl text-primary-600'>
                                 {appointments.length}
                              </span>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </div>
         </div>

         {/* Updated AppointmentDialog styling */}
         <AppointmentDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            formData={formData}
            setFormData={setFormData}
            stateList={stateList}
            doctors={doctors}
            onSubmit={handleAddAppointment}
            loading={loading}
         />
      </div>
   );
};

export default NewAppointment;
