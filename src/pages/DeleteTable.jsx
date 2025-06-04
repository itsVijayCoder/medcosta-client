import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DeleteTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchDeleteData();
  }, []);

  const fetchDeleteData = () => {
    fetch("http://localhost/medcosta/index.php/deletevisit/get_deletevisit_data")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Error fetching deletevisit data:", err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to permanently delete this visit?")) {
      fetch("http://localhost/medcosta/index.php/deletevisit/delete_permanently", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.status === "success") {
            alert("Deleted permanently");
            fetchDeleteData();
          } else {
            alert("Failed to delete");
          }
        })
        .catch((err) => console.error("Delete error:", err));
    }
  };

  const columns = [
    { header: "Case Number", accessorKey: "CaseNumber" },
    { header: "Event Date", accessorKey: "EventDate" },
    { header: "Doctor Name", accessorKey: "DoctorName" },
    { header: "Speciality", accessorKey: "speciality" },
    { header: "Event ID", accessorKey: "EventID" },
  ];

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-red-500">Deleted Visit Records</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={data}
            columns={columns}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DeleteTable;


