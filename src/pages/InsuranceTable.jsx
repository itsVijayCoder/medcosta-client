import React, { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaPlus } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";

const InsuranceTable = () => {
  const [data, setData] = useState([
    {
      id: 1,
      name: "ABC Insurance",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      phone: "123-456-7890",
      email: "contact@abc.com",
      insured_id: "INS001"
    }
  ]);

  const [editId, setEditId] = useState(null);
  const [editedData, setEditedData] = useState({
    id: 0,
    name: "",
    address: "",
    city: "",
    state: "",
    phone: "",
    email: "",
    insured_id: "",
  });

  const [newInsurance, setNewInsurance] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    phone: "",
    email: "",
    insured_id: "",
  });

  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "Address", accessorKey: "address" },
    { header: "City", accessorKey: "city" },
    { header: "State", accessorKey: "state" },
    { header: "Phone", accessorKey: "phone" },
    { header: "Email", accessorKey: "email" },
    { header: "Insured ID", accessorKey: "insured_id" },
  ];

  const handleEdit = (id, row) => {
    setEditId(id);
    setEditedData({ ...row });
  };

  const handleInputChange = (e, field) => {
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  const handleNewInsuranceChange = (e, field) => {
    setNewInsurance({ ...newInsurance, [field]: e.target.value });
  };

  const handleAddInsurance = () => {
    const newId = Math.max(...data.map(item => item.id), 0) + 1;
    const newData = { ...newInsurance, id: newId };
    setData([...data, newData]);
    setNewInsurance({
      name: "",
      address: "",
      city: "",
      state: "",
      phone: "",
      email: "",
      insured_id: "",
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
    if (window.confirm("Are you sure you want to delete this insurance?")) {
      setData(data.filter(item => item.id !== id));
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Insurance Table</CardTitle>
            <Modal
              trigger={
                <Button className="bg-primary hover:bg-primary/90">
                  <FaPlus className="mr-2 h-4 w-4" /> Add Insurance
                </Button>
              }
              title="Add New Insurance"
              className="sm:max-w-[600px]"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                {Object.keys(newInsurance).filter(key => key !== 'id').map((key) => (
                  <div key={key} className="flex flex-col gap-2">
                    <label htmlFor={key} className="text-sm font-medium">
                      {key.replace(/_/g, " ").toUpperCase()}
                    </label>
                    <Input
                      id={key}
                      placeholder={`Enter ${key.replace(/_/g, " ")}`}
                      value={newInsurance[key]}
                      onChange={(e) => handleNewInsuranceChange(e, key)}
                    />
                  </div>
                ))}
                <div className="col-span-full flex justify-end mt-4">
                  <Button onClick={handleAddInsurance}>
                    Save Insurance
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

export default InsuranceTable;
