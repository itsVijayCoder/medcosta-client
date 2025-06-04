import React, { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaPlus } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";

const LocationTable = () => {
  const [data, setData] = useState([
    {
      id: 1,
      location_name: "Main Clinic",
      npi: "1234567890",
      clia_number: "12D1234567",
      address: "123 Medical Drive",
      state: "NY",
      city: "New York",
      zip: "10001"
    }
  ]);

  const [editId, setEditId] = useState(null);
  const [editedData, setEditedData] = useState({
    id: 0,
    location_name: "",
    npi: "",
    clia_number: "",
    address: "",
    state: "",
    city: "",
    zip: "",
  });

  const [newLocation, setNewLocation] = useState({
    location_name: "",
    npi: "",
    clia_number: "",
    address: "",
    state: "",
    city: "",
    zip: "",
  });

  const columns = [
    { header: "Location Name", accessorKey: "location_name" },
    { header: "NPI", accessorKey: "npi" },
    { header: "CLIA #", accessorKey: "clia_number" },
    { header: "Address", accessorKey: "address" },
    { header: "State", accessorKey: "state" },
    { header: "City", accessorKey: "city" },
    { header: "ZIP", accessorKey: "zip" },
  ];

  const handleEdit = (id, row) => {
    setEditId(id);
    setEditedData({ ...row });
  };

  const handleInputChange = (e, field) => {
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  const handleNewLocationChange = (e, field) => {
    setNewLocation({ ...newLocation, [field]: e.target.value });
  };

  const handleAddLocation = () => {
    const newId = Math.max(...data.map(item => item.id), 0) + 1;
    const newData = { ...newLocation, id: newId };
    setData([...data, newData]);
    setNewLocation({
      location_name: "",
      npi: "",
      clia_number: "",
      address: "",
      state: "",
      city: "",
      zip: "",
    });
    document.querySelector('[role="dialog"]')?.close();
  };

  const handleSave = () => {
    setData(data.map(item => 
      item.id === editedData.id ? editedData : item
    ));
    setEditId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      setData(data.filter(item => item.id !== id));
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Location Table</CardTitle>
            <Modal
              trigger={
                <Button className="bg-primary hover:bg-primary/90">
                  <FaPlus className="mr-2 h-4 w-4" /> Add Location
                </Button>
              }
              title="Add New Location"
              className="sm:max-w-[600px]"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                {Object.keys(newLocation).filter(key => key !== 'id').map((key) => (
                  <div key={key} className="flex flex-col gap-2">
                    <label htmlFor={key} className="text-sm font-medium">
                      {key.replace(/_/g, " ").toUpperCase()}
                    </label>
                    <Input
                      id={key}
                      placeholder={`Enter ${key.replace(/_/g, " ")}`}
                      value={newLocation[key]}
                      onChange={(e) => handleNewLocationChange(e, key)}
                    />
                  </div>
                ))}
                <div className="col-span-full flex justify-end mt-4">
                  <Button onClick={handleAddLocation}>
                    Save Location
                  </Button>
                </div>
              </div>
            </Modal>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={data}
            columns={columns}
            editId={editId}
            editedData={editedData}
            onEdit={handleEdit}
            onSave={handleSave}
            onDelete={handleDelete}
            onInputChange={handleInputChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationTable;
