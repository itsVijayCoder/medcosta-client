import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaPlus } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";

const ProviderTable = () => {
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editedData, setEditedData] = useState({
    id: 0,
    name: "",
    location: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    npi: "",
    taxonomy_code: "",
    state_lic: "",
  });

  const [newProvider, setNewProvider] = useState({
    name: "",
    location: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    npi: "",
    taxonomy_code: "",
    state_lic: "",
  });

  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "Location", accessorKey: "location" },
    { header: "Address", accessorKey: "address" },
    { header: "City", accessorKey: "city" },
    { header: "State", accessorKey: "state" },
    { header: "ZIP", accessorKey: "zip" },
    { header: "Phone", accessorKey: "phone" },
    { header: "NPI", accessorKey: "npi" },
    { header: "Taxonomy Code", accessorKey: "taxonomy_code" },
    { header: "State License", accessorKey: "state_lic" },
  ];

  useEffect(() => {
    fetchProviderData();
  }, []);

  const fetchProviderData = () => {
    fetch("http://localhost/medcosta/index.php/provider/get_provider_data")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handleEdit = (id, row) => {
    setEditId(id);
    setEditedData({ ...row });
  };

  const handleInputChange = (e, field) => {
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  const handleNewProviderChange = (e, field) => {
    setNewProvider({ ...newProvider, [field]: e.target.value });
  };

  const handleAddProvider = () => {
    fetch("http://localhost/medcosta/index.php/provider/add_provider", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProvider),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "success") {
          alert("Provider added successfully");
          setNewProvider({
            name: "",
            location: "",
            address: "",
            city: "",
            state: "",
            zip: "",
            phone: "",
            npi: "",
            taxonomy_code: "",
            state_lic: "",
          });
          fetchProviderData();
          document.querySelector('[role="dialog"]')?.close();
        } else {
          alert("Failed to add provider");
        }
      })
      .catch((error) => console.error("Error adding provider:", error));
  };

  const handleSave = () => {
    fetch("http://localhost/medcosta/index.php/provider/update_provider", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editId, ...editedData }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "success") {
          alert("Provider updated successfully");
          setEditId(null);
          fetchProviderData();
        } else {
          alert("Failed to update provider");
        }
      })
      .catch((error) => console.error("Error updating provider:", error));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this provider?")) {
      fetch("http://localhost/medcosta/index.php/provider/delete_provider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "success") {
            alert("Provider deleted successfully");
            fetchProviderData();
          } else {
            alert(result.message || "Failed to delete provider");
          }
        })
        .catch((error) => console.error("Error deleting provider:", error));
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Provider Table</CardTitle>
            <Modal
              trigger={
                <Button className="bg-primary hover:bg-primary/90">
                  <FaPlus className="mr-2 h-4 w-4" /> Add Provider
                </Button>
              }
              title="Add New Provider"
              className="sm:max-w-[600px]"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                {Object.keys(newProvider).map((key) => (
                  <div key={key} className="flex flex-col gap-2">
                    <label htmlFor={key} className="text-sm font-medium">
                      {key.replace(/_/g, " ").toUpperCase()}
                    </label>
                    <Input
                      id={key}
                      placeholder={`Enter ${key.replace(/_/g, " ")}`}
                      value={newProvider[key]}
                      onChange={(e) => handleNewProviderChange(e, key)}
                    />
                  </div>
                ))}
                <div className="col-span-full flex justify-end mt-4">
                  <Button onClick={handleAddProvider}>
                    Save Provider
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

export default ProviderTable;
