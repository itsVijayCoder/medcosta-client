import React, { useState, useEffect } from "react";
import GenericTable from "@/components/ui/generic-table";
import { tableConfigs } from "@/data/tableConfigs";
import { supabase } from "@/lib/supabaseClient";
import { masterDataService } from "@/services/masterDataService";

const DeleteTable = () => {
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(false);
   const config = tableConfigs.deleteVisit;

   useEffect(() => {
      fetchDeleteData();

      // Set up real-time subscription
      const subscription = supabase
         .channel("deleted-visits")
         .on(
            "postgres_changes",
            {
               event: "*",
               schema: "public",
               table: "deleted_visits",
            },
            () => {
               fetchDeleteData(); // Refresh data when changes occur
            }
         )
         .subscribe();

      return () => {
         subscription.unsubscribe();
      };
   }, []);

   const fetchDeleteData = async () => {
      setLoading(true);
      try {
         const { data: deletedVisits, error } =
            await masterDataService.getDeletedVisits();

         if (error) {
            console.error("Error fetching deleted visits:", error);
            setData([]);
         } else {
            console.log("Deleted visits from API:", deletedVisits);
            setData(deletedVisits || []);
         }
      } catch (err) {
         console.error("Error fetching deleted visits data:", err);
         setData([]);
      } finally {
         setLoading(false);
      }
   };

   const handleDelete = async (selectedRowsOrId) => {
      // Handle both single ID case and array of rows case
      let selectedRows = [];

      if (
         typeof selectedRowsOrId === "string" ||
         typeof selectedRowsOrId === "number"
      ) {
         // Single ID case - find the row with this ID
         const row = data.find(
            (item) =>
               item.id === selectedRowsOrId || item.EventID === selectedRowsOrId
         );
         if (row) selectedRows = [{ original: row }];
      } else if (Array.isArray(selectedRowsOrId)) {
         // Array of row IDs case
         selectedRows = selectedRowsOrId;
      } else if (selectedRowsOrId && typeof selectedRowsOrId === "object") {
         // Single row object case
         selectedRows = [{ original: selectedRowsOrId }];
      }

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
               // Get the ID from the row - make sure it's a string
               let visitId = row.original?.EventID || row.original?.id;

               // Ensure the ID is a string
               if (typeof visitId === "object" && visitId !== null) {
                  visitId = visitId.toString();
               }

               console.log(
                  "Deleting visit with ID:",
                  visitId,
                  "Type:",
                  typeof visitId
               );

               // Delete from Supabase using the service
               const { data, error } =
                  await masterDataService.deleteVisitPermanently(visitId);

               console.log("Delete operation result:", {
                  data,
                  error,
                  visitId,
               });

               if (error) {
                  console.error(
                     "Error deleting visit with ID:",
                     visitId,
                     error
                  );
                  throw error;
               }
               return { status: "success", id: visitId };
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

            // Explicitly refresh the data to ensure UI is up to date
            await fetchDeleteData();
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
