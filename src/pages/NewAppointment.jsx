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
   const [firstName, setFirstName] = useState("");
   const [lastName, setLastName] = useState("");
   const [city, setCity] = useState("");
   const [stateList, setStateList] = useState([]);
   const [selectedState, setSelectedState] = useState("");
   const [pincode, setPincode] = useState("");
   const [email, setEmail] = useState("");
   const [phone, setPhone] = useState("");
   const [addressLine1, setAddressLine1] = useState("");
   const [addressLine2, setAddressLine2] = useState("");
   const [insurance, setInsurance] = useState("");
   const [policyNumber, setPolicyNumber] = useState("");
   const [selectedDoctorName, setSelectedDoctorName] = useState("");
   const [selectedDoctor, setSelectedDoctor] = useState(null);
   const [dateOfBirth, setDateOfBirth] = useState(null);
   const [visitNumber, setVisitNumber] = useState("");
   const [doctors, setDoctors] = useState([]);
   const [loading, setLoading] = useState(false);

   const handleDateClick = (arg) => {
      setSelectedTime(arg.start);
      setDialogOpen(true);
   };

   // Fetch providers from Supabase
   useEffect(() => {
      const fetchDoctors = async () => {
         try {
            const { data: providers, error } =
               await masterDataService.getProviders();
            if (error) {
               console.error("Error fetching providers:", error);
               return;
            }

            const formattedDoctors = providers.map((provider) => ({
               id: provider.id,
               name: provider.name,
               specialty: provider.specialty || "General Medicine",
               avatar: provider.name.charAt(0).toUpperCase(),
            }));

            setDoctors(formattedDoctors);
         } catch (error) {
            console.error("Error fetching doctors:", error);
         }
      };

      fetchDoctors();
   }, []);

   // Fetch appointments from Supabase with real-time updates
   useEffect(() => {
      const fetchAppointments = async () => {
         try {
            const { data: appointmentsData, error } =
               await appointmentService.getAppointments();
            if (error) {
               console.error("Error fetching appointments:", error);
               return;
            }

            const formattedAppointments = appointmentsData.map(
               (appointment) => ({
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
               })
            );

            setAppointments(formattedAppointments);
         } catch (error) {
            console.error("Error fetching appointments:", error);
         }
      };

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
         if (firstName && lastName && dateOfBirth) {
            try {
               const { data: patients, error } =
                  await patientService.searchPatients({
                     first_name: firstName,
                     last_name: lastName,
                     date_of_birth: dateOfBirth.toISOString().split("T")[0],
                  });

               if (error) {
                  console.error("Error fetching patient data:", error);
                  return;
               }

               if (patients && patients.length > 0) {
                  const patient = patients[0];
                  setPhone(patient.home_phone || patient.mobile_phone || "");
                  setCity(patient.city || "");
                  setSelectedState(patient.state || "");
                  setPincode(patient.zip || "");
                  setEmail(patient.email || "");
                  setAddressLine1(patient.address || "");
                  setAddressLine2("");

                  // Get patient's insurance information
                  if (
                     patient.patient_insurance &&
                     patient.patient_insurance.length > 0
                  ) {
                     const insurance = patient.patient_insurance[0];
                     setInsurance(insurance.insurance_companies?.name || "");
                     setPolicyNumber(insurance.policy_number || "");
                  }

                  // Generate visit number based on patient's appointment history
                  const { data: appointmentCount, error: countError } =
                     await appointmentService.getPatientAppointmentCount(
                        patient.id
                     );
                  if (!countError) {
                     setVisitNumber(
                        `${patient.patient_number}-${
                           (appointmentCount || 0) + 1
                        }`
                     );
                  }
               }
            } catch (error) {
               console.error("Error fetching patient data:", error);
            }
         }
      };

      fetchVisitNumber();
   }, [firstName, lastName, dateOfBirth]);

   // Add this new state for form data
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
   });

   // Handle appointment creation with Supabase
   const handleAddAppointment = async () => {
      if (!selectedTime) {
         console.warn("⚠️ No time selected, aborting...");
         return;
      }

      if (!firstName || !lastName || !selectedDoctorName) {
         alert(
            "Please fill in all required fields: First Name, Last Name, and Doctor"
         );
         return;
      }

      setLoading(true);

      try {
         // First, find or create the patient
         let patientId;
         const { data: existingPatients, error: searchError } =
            await patientService.searchPatients({
               first_name: firstName,
               last_name: lastName,
               date_of_birth: dateOfBirth
                  ? dateOfBirth.toISOString().split("T")[0]
                  : null,
            });

         if (searchError) {
            console.error("Error searching for patient:", searchError);
            alert("Error finding patient information");
            return;
         }

         if (existingPatients && existingPatients.length > 0) {
            patientId = existingPatients[0].id;
         } else {
            // Create new patient if not found
            const patientData = {
               first_name: firstName,
               last_name: lastName,
               date_of_birth: dateOfBirth
                  ? dateOfBirth.toISOString().split("T")[0]
                  : null,
               city: city,
               state: selectedState,
               zip: pincode,
               email: email,
               home_phone: phone,
               address: addressLine1 + (addressLine2 ? ` ${addressLine2}` : ""),
               case_type: "Regular",
            };

            const { data: newPatient, error: createPatientError } =
               await patientService.createPatient(patientData);
            if (createPatientError) {
               console.error("Error creating patient:", createPatientError);
               alert("Error creating patient record");
               return;
            }
            patientId = newPatient.id;
         }

         // Find the selected doctor's ID
         const selectedDoctorObj = doctors.find(
            (doctor) => doctor.name === selectedDoctorName
         );
         if (!selectedDoctorObj) {
            alert("Please select a valid doctor");
            return;
         }

         // Create the appointment
         const appointmentData = {
            patient_id: patientId,
            provider_id: selectedDoctorObj.id,
            appointment_date: selectedTime.toISOString().split("T")[0],
            appointment_time: selectedTime
               .toTimeString()
               .split(" ")[0]
               .substring(0, 5), // HH:MM format
            duration_minutes: 30,
            appointment_type: "Regular",
            status: "Scheduled",
            reason_for_visit: "General Consultation",
            visit_number: visitNumber || `${patientId}-1`,
         };

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

         alert("Appointment created successfully!");

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
      setFirstName("");
      setLastName("");
      setPhone("");
      setAddressLine1("");
      setAddressLine2("");
      setSelectedState("");
      setPincode("");
      setEmail("");
      setInsurance("");
      setPolicyNumber("");
      setSelectedDoctorName("");
      setDateOfBirth(null);
      setVisitNumber("");
      setCity("");
   };

   const handleDoctorSelect = (doctor) => {
      setSelectedDoctor(doctor);
   };
   const formatDateToUS = (isoDate) => {
      if (!isoDate) return "";
      const date = new Date(isoDate);
      return isNaN(date.getTime())
         ? ""
         : `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
   };

   return (
      <div className='min-h-screen bg-gray-50 p-6'>
         <div className='max-w-[1400px] mx-auto space-y-6'>
            {/* Header */}
            <div className='flex items-center justify-between'>
               <div>
                  <h1 className='text-3xl font-bold text-gray-900'>
                     Appointments
                  </h1>
                  <p className='text-gray-500 mt-1'>
                     Manage and schedule patient appointments
                  </p>
               </div>
               <Button
                  className='bg-blue-600 hover:bg-blue-700'
                  onClick={() => setDialogOpen(true)}
               >
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  New Appointment
               </Button>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
               {/* Main Calendar */}
               <div className='lg:col-span-9'>
                  <Card className='shadow-md'>
                     <CardContent className='p-0'>
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
                           height='800px'
                           slotMinTime='08:00:00'
                           slotMaxTime='20:00:00'
                           allDaySlot={false}
                           slotDuration='00:30:00'
                           eventContent={(eventInfo) => (
                              <div className='p-1 text-xs'>
                                 <div className='font-semibold'>
                                    {eventInfo.event.title}
                                 </div>
                                 <div>
                                    {format(eventInfo.event.start, "h:mm a")}
                                 </div>
                              </div>
                           )}
                           eventClassNames='bg-blue-500 border-none text-white rounded-md'
                        />
                     </CardContent>
                  </Card>
               </div>

               {/* Sidebar */}
               <div className='lg:col-span-3 space-y-6'>
                  {/* Today's Appointments */}
                  <Card>
                     <CardHeader>
                        <CardTitle className='text-lg font-semibold'>
                           Today's Appointments
                        </CardTitle>
                     </CardHeader>
                     <CardContent>
                        <ScrollArea className='h-[400px] pr-4'>
                           {appointments
                              .filter(
                                 (apt) =>
                                    format(apt.start, "yyyy-MM-dd") ===
                                    format(new Date(), "yyyy-MM-dd")
                              )
                              .map((apt) => (
                                 <div
                                    key={apt.id}
                                    className='mb-4 p-3 bg-gray-50 rounded-lg'
                                 >
                                    <div className='font-medium'>
                                       {apt.title}
                                    </div>
                                    <div className='text-sm text-gray-500'>
                                       {format(apt.start, "h:mm a")}
                                    </div>
                                 </div>
                              ))}
                        </ScrollArea>
                     </CardContent>
                  </Card>

                  {/* Quick Stats */}
                  <Card>
                     <CardHeader>
                        <CardTitle className='text-lg font-semibold'>
                           Overview
                        </CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className='space-y-3'>
                           <div className='flex justify-between items-center'>
                              <span className='text-gray-600'>
                                 Today's Appointments
                              </span>
                              <span className='font-semibold'>
                                 {
                                    appointments.filter(
                                       (apt) =>
                                          format(apt.start, "yyyy-MM-dd") ===
                                          format(new Date(), "yyyy-MM-dd")
                                    ).length
                                 }
                              </span>
                           </div>
                           <div className='flex justify-between items-center'>
                              <span className='text-gray-600'>
                                 Total Doctors
                              </span>
                              <span className='font-semibold'>
                                 {doctors.length}
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
            formData={formData}
            setFormData={setFormData}
            stateList={stateList}
            doctors={doctors}
            onSubmit={handleAddAppointment}
         />
      </div>
   );
};

export default NewAppointment;
