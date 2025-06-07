import React from "react";
import GenericTable from "@/components/ui/generic-table";
import { tableConfigs } from "@/data/tableConfigs";

// Define the location data directly here since it wasn't in the data index
const locationData = [
   {
      id: 1,
      location_name: "Main Clinic",
      npi: "1234567890",
      clia_number: "12D1234567",
      address: "123 Medical Drive",
      state: "NY",
      city: "New York",
      zip: "10001",
   },
   {
      id: 2,
      location_name: "Downtown Office",
      npi: "9876543210",
      clia_number: "12D7654321",
      address: "456 Downtown Ave",
      state: "CA",
      city: "Los Angeles",
      zip: "90210",
   },
   {
      id: 3,
      location_name: "Suburban Branch",
      npi: "5555555555",
      clia_number: "12D5555555",
      address: "789 Suburban Blvd",
      state: "IL",
      city: "Chicago",
      zip: "60601",
   },
];

const LocationTable = () => {
   const config = tableConfigs.location;

   return <GenericTable {...config} data={locationData} />;
};

export default LocationTable;
