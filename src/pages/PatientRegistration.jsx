import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  CustomSelect,

} from "@/components/ui/custom-select";
// import { Separator } from "@/components/ui/separator";
// Add import
import { DatePicker } from "@/components/ui/date-picker";

const PatientRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    dob: "",
    city: "",
    ssn: "",
    address: "",
    home_phone: "",
    case_type: "",
    date_filed: "",
    state_filed: "",
    insurance_name: "",
    claim: "",
    policy_number: "",
    employer_name: "",
    employer_city: "",
    employer_address: "",
    adjuster_name: "",
    relation_name: "",
    relation_address: "",
    relation_phone: "",
    relation_type: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost/medcosta/index.php/save_patient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        alert("Patient registered successfully!");
        navigate("/dataentry/patient-entry");
      } else {
        alert("Failed to register patient.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error occurred during registration.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Patient Registration</h2>
          {/* <p className="text-muted-foreground">Please fill in the patient information carefully</p> */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>

           
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <DatePicker
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </div>
                
            
                {/* <div className="space-y-2">
                  <Label htmlFor="date_filed">Date Filed</Label>
                  <DatePicker
                    name="date_filed"
                    value={formData.date_filed}
                    onChange={handleChange}
                  />
                </div> */}
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ssn">SSN#</Label>
                  <Input
                    id="ssn"
                    name="ssn"
                    value={formData.ssn}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="home_phone">Home Phone</Label>
                  <Input
                    id="home_phone"
                    name="home_phone"
                    value={formData.home_phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <CustomSelect
                    label="Case Type"
                    value={formData.case_type}
                    onChange={(value) => handleChange({ target: { name: 'case_type', value }})}
                    items={[
                      { value: 'Dropped Cases', label: 'Dropped Cases' },
                      { value: 'Litigation', label: 'Litigation' },
                      { value: 'NoFault', label: 'NoFault' },
                      { value: 'Paid In Full', label: 'Paid In Full' },
                      { value: 'Lein', label: 'Lein' },
                      { value: 'Private', label: 'Private' },
                      { value: 'Stopped Cases', label: 'Stopped Cases' },
                      { value: 'Workers Compensation', label: 'Workers Compensation' },
                    ]}
                    placeholder="Select case type"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
{/* 
          <Card>
            <CardHeader>
              <CardTitle>Case Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <CustomSelect
                    label="Case Type"
                    value={formData.case_type}
                    onChange={(value) => handleChange({ target: { name: 'case_type', value }})}
                    items={[
                      { value: 'type1', label: 'Type 1' },
                      { value: 'type2', label: 'Type 2' },
                    ]}
                    placeholder="Select case type"
                  />
                </div>

           
              </div>
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader>
              <CardTitle>Accident & Insurance Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Accident Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Accident Information</h3>
                  <div className="space-y-2">
                    <Label htmlFor="date_filed">Date Filed</Label>
                    <DatePicker
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                  </div>
                  <div className="space-y-2">
                    <CustomSelect
                      label="State Filed"
                      value={formData.state_filed}
                      onChange={(value) => handleChange({ target: { name: 'state_filed', value }})}
                      items={[
                        { value: 'Texas', label: 'Texas' },
                        { value: 'California', label: 'California' },
                        { value: 'Florida', label: 'Florida' },
                        { value: 'New York', label: 'New York' },
                        { value: 'Illinois', label: 'Illinois' },
                      ]}
                      placeholder="Select state"
                    />
                  </div>
                </div>

                {/* Insurance Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Insurance Information</h3>
                  <div className="space-y-2">
                    <CustomSelect
                      label="Insurance Name"
                      value={formData.insurance_name}
                      onChange={(value) => handleChange({ target: { name: 'insurance_name', value }})}
                      items={[
                        { value: 'UnitedHealth Group', label: 'UnitedHealth Group' },
                        { value: 'Blue Cross Blue Shield', label: 'Blue Cross Blue Shield' },
                        { value: 'Aetna', label: 'Aetna' },
                        { value: 'Cigna', label: 'Cigna' },
                        { value: 'Humana', label: 'Humana' },
                      ]}
                      placeholder="Select insurance"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="claim">Claim</Label>
                    <Input
                      id="claim"
                      name="claim"
                      value={formData.claim}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="policy_number">Policy Number</Label>
                    <Input
                      id="policy_number"
                      name="policy_number"
                      value={formData.policy_number}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Employer & Adjuster Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Employer Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Employer Information</h3>
                  <div className="space-y-2">
                    <Label htmlFor="employer_name">Employer Name</Label>
                    <Input
                      id="employer_name"
                      name="employer_name"
                      value={formData.employer_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employer_city">City</Label>
                    <Input
                      id="employer_city"
                      name="employer_city"
                      value={formData.employer_city}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employer_address">Address</Label>
                    <Input
                      id="employer_address"
                      name="employer_address"
                      value={formData.employer_address}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Adjuster Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Adjuster Information</h3>
                  <div className="space-y-2">
                    <Label htmlFor="adjuster_name">Name</Label>
                    <Input
                      id="adjuster_name"
                      name="adjuster_name"
                      value={formData.adjuster_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit">Submit Registration</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientRegistration;
      