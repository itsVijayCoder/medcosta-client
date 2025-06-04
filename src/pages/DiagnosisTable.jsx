import React, { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaPlus } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";

const DiagnosisTable = () => {
  const [data, setData] = useState([
    {
      id: 1,
      diagnosis_code: "D001",
      description: "Sample Diagnosis",
      diagnosis_type: "Type A",
      preferred_bit: "True",
      type: "Primary"
    }
  ]);

  const [editId, setEditId] = useState(null);
  const [editedData, setEditedData] = useState({
    id: 0,
    diagnosis_code: "",
    description: "",
    diagnosis_type: "",
    preferred_bit: "",
    type: "",
  });

  const [newDiagnosis, setNewDiagnosis] = useState({
    diagnosis_code: "",
    description: "",
    diagnosis_type: "",
    preferred_bit: "",
    type: "",
  });

  const columns = [
    { header: "Diagnosis Code", accessorKey: "diagnosis_code" },
    { header: "Description", accessorKey: "description" },
    { header: "Diagnosis Type", accessorKey: "diagnosis_type" },
    { header: "Preferred Bit", accessorKey: "preferred_bit" },
    { header: "Type", accessorKey: "type" },
  ];

  const handleEdit = (id, row) => {
    setEditId(id);
    setEditedData({ ...row });
  };

  const handleInputChange = (e, field) => {
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  const handleNewDiagnosisChange = (e, field) => {
    setNewDiagnosis({ ...newDiagnosis, [field]: e.target.value });
  };

  const handleAddDiagnosis = () => {
    const newId = Math.max(...data.map(item => item.id), 0) + 1;
    const newData = { ...newDiagnosis, id: newId };
    setData([...data, newData]);
    setNewDiagnosis({
      diagnosis_code: "",
      description: "",
      diagnosis_type: "",
      preferred_bit: "",
      type: "",
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
    if (window.confirm("Are you sure you want to delete this diagnosis?")) {
      setData(data.filter(item => item.id !== id));
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Diagnosis Table</CardTitle>
            <Modal
              trigger={
                <Button className="bg-primary hover:bg-primary/90">
                  <FaPlus className="mr-2 h-4 w-4" /> Add Diagnosis
                </Button>
              }
              title="Add New Diagnosis"
              className="sm:max-w-[600px]"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                {Object.keys(newDiagnosis).map((key) => (
                  <div key={key} className="flex flex-col gap-2">
                    <label htmlFor={key} className="text-sm font-medium">
                      {key.replace(/_/g, " ").toUpperCase()}
                    </label>
                    <Input
                      id={key}
                      placeholder={`Enter ${key.replace(/_/g, " ")}`}
                      value={newDiagnosis[key]}
                      onChange={(e) => handleNewDiagnosisChange(e, key)}
                    />
                  </div>
                ))}
                <div className="col-span-full flex justify-end mt-4">
                  <Button onClick={handleAddDiagnosis}>
                    Save Diagnosis
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

export default DiagnosisTable;
