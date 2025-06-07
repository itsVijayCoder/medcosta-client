import React, { useState, useEffect } from "react";
import GenericTable from "@/components/ui/generic-table";
import { tableConfigs } from "@/data/tableConfigs";

const DeleteTable = () => {
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(false);
   const config = tableConfigs.deleteVisit;

   useEffect(() => {
      fetchDeleteData();
   }, []);

   const fetchDeleteData = async () => {
      setLoading(true);
      try {
         const response = await fetch(
            "http://localhost/medcosta/index.php/deletevisit/get_deletevisit_data"
         );
         const result = await response.json();
         setData(result || []);
      } catch (err) {
         console.error("Error fetching deletevisit data:", err);
         setData([]);
      } finally {
         setLoading(false);
      }
   };

   const handleDelete = async (selectedRows) => {
      if (!selectedRows || selectedRows.length === 0) {
         alert("Please select at least one record to delete permanently.");
         return;
      }

      const confirmMessage =
         selectedRows.length === 1
            ? "Are you sure you want to permanently delete this visit?"
            : `Are you sure you want to permanently delete ${selectedRows.length} visits?`;

      if (window.confirm(confirmMessage)) {
         setLoading(true);
         try {
            const deletePromises = selectedRows.map(async (row) => {
               const response = await fetch(
                  "http://localhost/medcosta/index.php/deletevisit/delete_permanently",
                  {
                     method: "POST",
                     headers: {
                        "Content-Type": "application/json",
                     },
                     body: JSON.stringify({
                        id: row.original.EventID || row.original.id,
                     }),
                  }
               );
               return response.json();
            });

            const results = await Promise.all(deletePromises);
            const successCount = results.filter(
               (result) => result.status === "success"
            ).length;

            if (successCount === selectedRows.length) {
               alert(`${successCount} record(s) deleted permanently`);
            } else {
               alert(
                  `${successCount} out of ${selectedRows.length} records deleted successfully`
               );
            }

            fetchDeleteData();
         } catch (err) {
            console.error("Delete error:", err);
            alert("Failed to delete records");
         } finally {
            setLoading(false);
         }
      }
   };

   return (
      <GenericTable
         {...config}
         data={data}
         loading={loading}
         onDelete={handleDelete}
         showAddButton={false}
         showEditButton={false}
         deleteButtonText='Delete Permanently'
         deleteButtonVariant='destructive'
      />
   );
};

export default DeleteTable;
