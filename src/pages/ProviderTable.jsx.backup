import React, { useState } from "react";
import { ModernDataTable } from "@/components/ui/modern-data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaPlus, FaUserMd } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { providerData } from "@/data";

const ProviderTable = () => {
  const [data, setData] = useState(providerData);
  const [selectedRows, setSelectedRows] = useState([]);

  const [editedData, setEditedData] = useState({
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
    { 
      header: "Provider Name", 
      accessorKey: "name",
      cell: ({ row }) => (
        <div className="font-semibold text-cyan-700">{row.getValue("name")}</div>
      )
    },
    { 
      header: "Location", 
      accessorKey: "location",
      cell: ({ row }) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
          {row.getValue("location")}
        </span>
      )
    },
    { 
      header: "City, State", 
      accessorKey: "city",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {row.getValue("city")}, {row.original.state}
        </div>
      )
    },
    { 
      header: "Phone", 
      accessorKey: "phone",
      cell: ({ row }) => (
        <div className="font-medium text-blue-600">{row.getValue("phone")}</div>
      )
    },
    { 
      header: "NPI", 
      accessorKey: "npi",
      cell: ({ row }) => (
        <div className="font-mono text-sm text-gray-700">{row.getValue("npi")}</div>
      )
    },
    { 
      header: "State License", 
      accessorKey: "state_lic",
      cell: ({ row }) => (
        <div className="font-mono text-sm text-gray-700">{row.getValue("state_lic")}</div>
      )
    },
  ];
  const handleEdit = (id, row) => {
    setEditedData({ ...row });
  };

  const handleInputChange = (e, field) => {
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  const handleNewProviderChange = (e, field) => {
    setNewProvider({ ...newProvider, [field]: e.target.value });
  };

  const handleAddProvider = () => {
    const newId = Math.max(...data.map(item => item.id), 0) + 1;
    const newData = { ...newProvider, id: newId };
    setData([...data, newData]);
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
    document.querySelector('[role="dialog"]')?.close();
  };

  const handleUpdate = (updatedData) => {
    setData(data.map(item => 
      item.id === updatedData.id ? updatedData : item
    ));
  };

  const handleDelete = (ids) => {
    if (window.confirm(`Are you sure you want to delete ${ids.length} provider record(s)?`)) {
      setData(data.filter(item => !ids.includes(item.id)));
      setSelectedRows([]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return;
    handleDelete(selectedRows);
  };

  const handleExport = () => {
    const csvContent = [
      Object.keys(columns.reduce((acc, col) => ({ ...acc, [col.accessorKey]: '' }), {})).join(','),
      ...data.map(row => Object.values(columns.reduce((acc, col) => ({ ...acc, [col.accessorKey]: row[col.accessorKey] || '' }), {})).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'providers_data.csv';
    a.click();  };
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
