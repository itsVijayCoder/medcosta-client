import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaPlus } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Modal } from "@/components/ui/modal";
// import "datatables.net";

const ProcedureTable = () => {
  // Add initial data array
  const [data, setData] = useState([
    {
      id: 1,
      procedure_code: "P001",
      description: "General Checkup",
      amount: "150.00",
      specialty: "General",
      modifier: "None",
      rev_code: "RC001",
      value_code: "VC001",
      preferred_list: "False",
      full_description: "Complete general medical examination",
      rvu: "1.5",
      location: "Main Clinic"
    },
    {
      id: 2,
      procedure_code: "P002",
      description: "Blood Test",
      amount: "75.00",
      specialty: "Laboratory",
      modifier: "Lab",
      rev_code: "RC002",
      value_code: "VC002",
      preferred_list: "False",
      full_description: "Complete blood count analysis",
      rvu: "1.0",
      location: "Lab Room"
    }
  ]);
  const [editId, setEditId] = useState(null);
  const [editedData, setEditedData] = useState({
    id: 0,
    procedure_code: "",
    description: "",
    amount: "",
    specialty: "",
    modifier: "",
    rev_code: "",
    value_code: "",
    preferred_list: "False",
    full_description: "",
    rvu: "",
    location: "",
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newProcedure, setNewProcedure] = useState({
    procedure_code: "",
    description: "",
    amount: "",
    specialty: "",
    modifier: "",
    rev_code: "",
    value_code: "",
    preferred_list: "False",
    full_description: "",
    rvu: "",
    location: "",
  });

  const columns = [
    { header: "Code", accessorKey: "procedure_code" },
    { header: "Description", accessorKey: "description" },
    { header: "Amount", accessorKey: "amount" },
    { header: "Specialty", accessorKey: "specialty" },
    { header: "Modifier", accessorKey: "modifier" },
    { header: "Rev Code", accessorKey: "rev_code" },
    { header: "Value Code", accessorKey: "value_code" },
    { header: "Preferred List", accessorKey: "preferred_list" },
    { header: "Full Description", accessorKey: "full_description" },
    { header: "RVU", accessorKey: "rvu" },
    { header: "Location", accessorKey: "location" },
  ];

//   useEffect(() => {
//     fetchProcedureData();
//   }, []);

  // Update the API URL to match your backend configuration
  const API_BASE_URL = "http://localhost/medcosta/index.php";
  
  const fetchProcedureData = () => {
    fetch(`${API_BASE_URL}/Procedure/get_procedure_data`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Error fetching procedure data:", err));
  };

  // Remove all API-related code and duplicates, keep only these handler functions
  const handleEdit = (id, row) => {
    setEditId(id);
    setEditedData({ ...row });
  };

  const handleInputChange = (e, field) => {
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  const handleNewProcedureChange = (e, field) => {
    setNewProcedure({ ...newProcedure, [field]: e.target.value });
  };

  // Keep only one version of each handler
  const handleAddProcedure = () => {
    const newId = Math.max(...data.map(item => item.id), 0) + 1;
    const newData = { ...newProcedure, id: newId };
    setData([...data, newData]);
    setNewProcedure({
      procedure_code: "",
      description: "",
      amount: "",
      specialty: "",
      modifier: "",
      rev_code: "",
      value_code: "",
      preferred_list: "False",
      full_description: "",
      rvu: "",
      location: "",
    });
    // Close modal after adding
    document.querySelector('[role="dialog"]')?.close();
  };

  // Remove showAddForm state and related UI since we're using Modal
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Procedure Table</CardTitle>
            <Modal
              trigger={
                <Button className="bg-primary hover:bg-primary/90">
                  <FaPlus className="mr-2 h-4 w-4" /> Add Procedure
                </Button>
              }
              title="Add New Procedure"
              className="sm:max-w-[600px]"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                {Object.keys(newProcedure).filter(key => key !== 'id').map((key) => (
                  <div key={key} className="flex flex-col gap-2">
                    <label htmlFor={key} className="text-sm font-medium">
                      {key.replace(/_/g, " ").toUpperCase()}
                    </label>
                    <Input
                      id={key}
                      placeholder={`Enter ${key.replace(/_/g, " ")}`}
                      value={newProcedure[key]}
                      onChange={(e) => handleNewProcedureChange(e, key)}
                    />
                  </div>
                ))}
                <div className="col-span-full flex justify-end mt-4">
                  <Button onClick={handleAddProcedure}>
                    Save Procedure
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

export default ProcedureTable;

const handleSave = () => {
    setData(data.map(item => 
      item.id === editedData.id ? editedData : item
    ));
    setEditId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this procedure?")) {
      setData(data.filter(item => item.id !== id));
    }
  };
