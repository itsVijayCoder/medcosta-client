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
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from "axios";

// Remove all current FullCalendar CSS imports
// import '@fullcalendar/core/main.min.css';
// import '@fullcalendar/daygrid/main.min.css';
// import '@fullcalendar/timegrid/main.min.css';

// Add this import
import AppointmentDialog from "@/components/AppointmentDialog";

const NewAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [stateList, setStateList] = useState([]);
  const [selectedState, setSelectedState] = useState('');
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
  const [doctors, setDoctors] = useState([
    { id: 1, name: "Dr. Tariq Islam", specialty: "General Medicine", avatar: "T" },
    { id: 2, name: "Dr. Tahmina Akhter", specialty: "Pediatrics", avatar: "T" },
    { id: 3, name: "Dr. Yamin Rahman", specialty: "Cardiology", avatar: "Y" },
    { id: 4, name: "Dr. Maribul Haque", specialty: "Neurology", avatar: "M" }
  ]);

  const handleDateClick = (arg) => {
    setSelectedTime(arg.start);
    setDialogOpen(true);
  };

  useEffect(() => {
    axios.get('http://localhost/medcosta/newappointment/get_states')
      .then(response => {
        if (response.data.success) {
          setStateList(response.data.data); // Populate the state list
        }
      })
      .catch(error => {
        console.error('Error fetching states:', error);
      });
  }, []);

  const handleStateChange = (event) => {
    setSelectedState(event.target.value );
  };
  
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("http://localhost/medcosta/newappointment/get_all_appointments");
  
        if (response.data.success) {
          const formattedAppointments = response.data.data.map((appointment, index) => {
            const startDate = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`);
            return {
              id: index + 1,
              title: `${appointment.first_name} ${appointment.last_name} - ${appointment.doctor_name}`,
              start: startDate,
              end: new Date(startDate.getTime() + 30 * 60000),
            };
          });
  
          setAppointments(formattedAppointments);
        } else {
          console.warn("⚠️ Failed to fetch appointments:", response.data.message);
        }
      } catch (error) {
        console.error("🚨 Error fetching appointments:", error);
      }
    };
  
    fetchAppointments();
  }, []);
  
  useEffect(() => {
    const fetchVisitNumber = async () => {
      if (firstName && lastName && dateOfBirth) {
        try {
          const response = await axios.post('http://localhost/medcosta/newappointment/get_visit_number', {
            first_name: firstName,
            last_name: lastName,
            date_of_birth: formatDateToUS(dateOfBirth.toISOString()),
          });
  
          if (response.data.success) {
            setVisitNumber(response.data.visit_number);
  
            const patient = response.data.patient_data;
            if (patient) {
              setPhone(patient.phone || "");
              setCity(patient.city || "");
              setSelectedState(patient.state || "");
              setPincode(patient.pincode || "");
              setEmail(patient.email || "");
              setAddressLine1(patient.address_line1 || "");
              setAddressLine2(patient.address_line2 || "");              
              setInsurance(patient.insurance_provider || "");
              setPolicyNumber(patient.policy_number || "");
              setSelectedDoctorName(patient.doctor_name || "");
            }
          } else {
            console.warn("⚠️ Visit number fetch failed:", response.data.message);
          }
        } catch (error) {
          console.error("🚨 Error fetching visit number:", error);
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

  // Update your handleAddAppointment to use formData
  const handleAddAppointment = async () => {
    if (!selectedTime) {
      console.warn("⚠️ No time selected, aborting...");
      return;
    }
  
    const patientName = `${formData.firstName} ${formData.lastName}`;
    const doctorName = formData.selectedDoctorName;
  
    const newAppointment = {
      id: appointments.length + 1,
      title: `${patientName} - ${doctorName}`,
      start: selectedTime,
      end: new Date(selectedTime.getTime() + 30 * 60000),
    };
    
    // Format date and time for backend
    const appointmentDate = selectedTime.toISOString().split('T')[0];
    const appointmentTime = selectedTime.toTimeString().split(' ')[0];
    const appointmentData = {
      first_name: firstName,
      last_name: lastName,
      city: city,
      state: selectedState,
      pincode: pincode,
      email: email,
      phone: phone,
      insurance_provider: insurance,
      policy_number: policyNumber,
      date_of_birth: dateOfBirth ? formatDateToUS(dateOfBirth.toISOString()) : "",
      visit_number: visitNumber,
      doctor_name: doctorName,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      address_line1: addressLine1,
      address_line2: addressLine2,
          };
  
    try {
const response = await axios.post('http://localhost/medcosta/newappointment/add_appointment', appointmentData);
  
      if (response.data.success) {
 
        setAppointments([...appointments, newAppointment]);
        alert('Appointment created successfully!');
  
        // Reset form
        setDialogOpen(false);
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
        } else {
        console.error("❌ Backend error:", response.data.message);
        alert('Error creating appointment: ' + response.data.message);
      }
    } catch (error) {
      console.error('🚨 Error saving appointment:', error);
      alert('Failed to save appointment. Please try again.');
    }
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-500 mt-1">Manage and schedule patient appointments</p>
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setDialogOpen(true)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        </div>
    
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Calendar */}
          <div className="lg:col-span-9">
            <Card className="shadow-md">
              <CardContent className="p-0">
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="timeGridWeek"
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "timeGridWeek,dayGridMonth",
                  }}
                  events={appointments}
                  selectable
                  select={handleDateClick}
                  height="800px"
                  slotMinTime="08:00:00"
                  slotMaxTime="20:00:00"
                  allDaySlot={false}
                  slotDuration="00:30:00"
                  eventContent={(eventInfo) => (
                    <div className="p-1 text-xs">
                      <div className="font-semibold">{eventInfo.event.title}</div>
                      <div>{format(eventInfo.event.start, "h:mm a")}</div>
                    </div>
                  )}
                  eventClassNames="bg-blue-500 border-none text-white rounded-md"
                />
              </CardContent>
            </Card>
          </div>
    
          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            {/* Today's Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Today's Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  {appointments
                    .filter(apt => format(apt.start, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'))
                    .map(apt => (
                      <div key={apt.id} className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium">{apt.title}</div>
                        <div className="text-sm text-gray-500">
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
                <CardTitle className="text-lg font-semibold">Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Today's Appointments</span>
                    <span className="font-semibold">{
                      appointments.filter(apt => 
                        format(apt.start, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                      ).length
                    }</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Doctors</span>
                    <span className="font-semibold">{doctors.length}</span>
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