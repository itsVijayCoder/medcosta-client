import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaPlus } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";

const ModifierTable = () => {
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editedData, setEditedData] = useState({
    id: 0,
    specialty: "",
    modifier_name: "",
    is_default: "No",
    is_active: "Yes",
    created_date: "",
    modified_date: "",
    modified_by: "",
  });

  const [newModifier, setNewModifier] = useState({
    specialty: "",
    modifier_name: "",
    is_default: "No",
    is_active: "Yes",
    created_date: "",
    modified_date: "",
    modified_by: "",
  });

  const columns = [
    { header: "Specialty", accessorKey: "specialty" },
    { header: "Modifier Name", accessorKey: "modifier_name" },
    { header: "Default", accessorKey: "is_default" },
    { header: "Active", accessorKey: "is_active" },
    { header: "Created Date", accessorKey: "created_date" },
    { header: "Modified Date", accessorKey: "modified_date" },
    { header: "Modified By", accessorKey: "modified_by" },
  ];

  useEffect(() => {
    fetchModifierData();
  }, []);

  const fetchModifierData = () => {
    fetch("http://localhost/medcosta/index.php/modifier/get_modifier_data")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Error fetching modifier data:", err));
  };

  const handleEdit = (id, row) => {
    setEditId(id);
    setEditedData({ ...row });
  };

  const handleInputChange = (e, field) => {
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  const handleNewModifierChange = (e, field) => {
    setNewModifier({ ...newModifier, [field]: e.target.value });
  };

  const handleAddModifier = () => {
    fetch("http://localhost/medcosta/index.php/modifier/add_modifier", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newModifier),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "success") {
          alert("Modifier added successfully");
          setNewModifier({
            specialty: "",
            modifier_name: "",
            is_default: "No",
            is_active: "Yes",
            created_date: "",
            modified_date: "",
            modified_by: "",
          });
          fetchModifierData();
          document.querySelector('[role="dialog"]')?.close();
        } else {
          alert("Failed to add modifier");
        }
      })
      .catch((err) => console.error("Add error:", err));
  };

  const handleSave = () => {
    fetch("http://localhost/medcosta/index.php/modifier/update_modifier", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedData),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "success") {
          alert("Modifier updated successfully");
          setEditId(null);
          fetchModifierData();
        } else {
          alert("Failed to update modifier");
        }
      })
      .catch((err) => console.error("Update error:", err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this modifier?")) {
      fetch("http://localhost/medcosta/index.php/modifier/delete_modifier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.status === "success") {
            alert("Modifier deleted successfully");
            fetchModifierData();
          } else {
            alert("Failed to delete modifier");
          }
        })
        .catch((err) => console.error("Delete error:", err));
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Modifier Table</CardTitle>
            <Modal
              trigger={
                <Button className="bg-primary hover:bg-primary/90">
                  <FaPlus className="mr-2 h-4 w-4" /> Add Modifier
                </Button>
              }
              title="Add New Modifier"
              className="sm:max-w-[600px]"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Specialty</label>
                  <Input
                    placeholder="Enter specialty"
                    value={newModifier.specialty}
                    onChange={(e) => handleNewModifierChange(e, "specialty")}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Modifier Name</label>
                  <Input
                    placeholder="Enter modifier name"
                    value={newModifier.modifier_name}
                    onChange={(e) => handleNewModifierChange(e, "modifier_name")}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Is Default</label>
                  <Select
                    value={newModifier.is_default}
                    onValueChange={(value) => handleNewModifierChange({ target: { value } }, "is_default")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select default status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Is Active</label>
                  <Select
                    value={newModifier.is_active}
                    onValueChange={(value) => handleNewModifierChange({ target: { value } }, "is_active")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select active status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Created Date</label>
                  <Input
                    type="date"
                    value={newModifier.created_date}
                    onChange={(e) => handleNewModifierChange(e, "created_date")}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Modified Date</label>
                  <Input
                    type="date"
                    value={newModifier.modified_date}
                    onChange={(e) => handleNewModifierChange(e, "modified_date")}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Modified By</label>
                  <Input
                    placeholder="Enter modified by"
                    value={newModifier.modified_by}
                    onChange={(e) => handleNewModifierChange(e, "modified_by")}
                  />
                </div>
                <div className="col-span-full flex justify-end mt-4">
                  <Button onClick={handleAddModifier}>
                    Save Modifier
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

export default ModifierTable;
