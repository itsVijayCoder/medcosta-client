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
  formData,
  setFormData,
  stateList,
  doctors,
  onSubmit,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      
   
      <DialogContent className="max-w-2xl bg-white p-6">
      <DialogHeader>
        <DialogTitle>New Appointment</DialogTitle>
        <DialogDescription>
          {selectedTime && format(selectedTime, "PPP p")}
        </DialogDescription>
      </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Personal Information */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            <Input
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          {/* Address */}
          <div className="grid grid-cols-1 gap-4">
            <Input
              placeholder="Address Line 1"
              value={formData.addressLine1}
              onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
            />
            <Input
              placeholder="Address Line 2"
              value={formData.addressLine2}
              onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-3 gap-4">
            <Input
              placeholder="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
            <Select 
              value={formData.selectedState} 
              onValueChange={(value) => setFormData({ ...formData, selectedState: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                {stateList.map((state) => (
                  <SelectItem key={state.id} value={state.name}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Pincode"
              value={formData.pincode}
              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
            />
          </div>

          {/* Insurance */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Insurance Provider"
              value={formData.insurance}
              onChange={(e) => setFormData({ ...formData, insurance: e.target.value })}
            />
            <Input
              placeholder="Policy Number"
              value={formData.policyNumber}
              onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
            />
          </div>

          {/* Doctor Selection */}
          <Select 
            value={formData.selectedDoctorName} 
            onValueChange={(value) => setFormData({ ...formData, selectedDoctorName: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Doctor" />
            </SelectTrigger>
            <SelectContent>
              {doctors.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.name}>
                  {doctor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
        <Button 
          variant="outline" 
          onClick={() => onOpenChange(false)}
          className="px-6"
        >
          Cancel
        </Button>
        <Button 
          onClick={onSubmit}
          className="px-6 bg-blue-600 hover:bg-blue-700"
        >
          Confirm Appointment
        </Button>
      </div>
      </DialogContent>
     
    </Dialog>
  );
};

export default AppointmentDialog;