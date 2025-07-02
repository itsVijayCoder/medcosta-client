import React, { useState, useEffect } from "react";
import GenericTable from "@/components/ui/generic-table";
import { tableConfigs } from "@/data/tableConfigs";
import { masterDataService } from "@/services/masterDataService";
import { supabase } from "@/lib/supabaseClient";
import { getTableDataWithFallback } from "@/lib/utils";

const DiagnosisTable = () => {
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(true);
   const config = tableConfigs.diagnosis;

   // Fetch real-time data from Supabase
   useEffect(() => {
      const fetchData = async () => {
         try {
            const { data: diagnosisCodes, error } =
               await masterDataService.getDiagnosisCodes();
            if (error) {
               console.error("Error fetching diagnosis codes:", error);
               setLoading(false);
               return;
            }
            console.log("Diagnosis codes from API:", diagnosisCodes);

            // Correctly map the backend data if it matches the key structure in api-response.js
            const formattedData =
               diagnosisCodes && diagnosisCodes.length > 0
                  ? diagnosisCodes
                  : [];

            setData(formattedData);
         } catch (error) {
            console.error("Error:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchData();

      // Set up real-time subscription
      const subscription = supabase
         .channel("diagnosis-codes")
         .on(
            "postgres_changes",
            {
               event: "*",
               schema: "public",
               table: "diagnosis_codes",
            },
            () => {
               fetchData(); // Refresh data when changes occur
            }
         )
         .subscribe();

      return () => {
         subscription.unsubscribe();
      };
   }, []);

   // Handle add new diagnosis code
   const handleAdd = async (diagnosisData) => {
      try {
         const { data: newDiagnosis, error } =
            await masterDataService.createDiagnosisCode(diagnosisData);
         if (error) {
            alert(`Error: ${error}`);
            return;
         }
         // Data will be updated automatically via real-time subscription
         alert("Diagnosis code added successfully");
      } catch (error) {
         console.error("Error adding diagnosis code:", error);
         alert("Error occurred while adding diagnosis code");
      }
   };

   // Handle edit diagnosis code
   const handleEdit = async (id, diagnosisData) => {
      try {
         const { data: updatedDiagnosis, error } =
            await masterDataService.updateDiagnosisCode(id, diagnosisData);
         if (error) {
            alert(`Error: ${error}`);
            return;
         }
         // Data will be updated automatically via real-time subscription
         alert("Diagnosis code updated successfully");
      } catch (error) {
         console.error("Error updating diagnosis code:", error);
         alert("Error occurred while updating diagnosis code");
      }
   };

   // Handle delete diagnosis code
   const handleDelete = async (id) => {
      if (!confirm("Are you sure you want to delete this diagnosis code?")) {
         return;
      }

      try {
         // If id is an object, extract the actual id value
         const actualId = typeof id === "object" && id !== null ? id.id : id;
         console.log("Deleting diagnosis code with ID:", actualId);

         const { error } = await masterDataService.deleteDiagnosisCode(
            actualId
         );
         if (error) {
            console.error("Error from deleteDiagnosisCode:", error);
            alert(`Error: ${error.message || JSON.stringify(error)}`);
            return;
         }
         // Data will be updated automatically via real-time subscription
         alert("Diagnosis code deleted successfully");
      } catch (error) {
         console.error("Error deleting diagnosis code:", error);
         alert("Error occurred while deleting diagnosis code");
      }
   };

   // Enhanced config with real-time operations using Supabase
   const enhancedConfig = {
      ...config,
      onDelete: handleDelete,
      loading,
      dataSource: "diagnosis_codes", // Connect to Supabase diagnosis_codes table
      refreshData: () => {
         setLoading(true);
         masterDataService
            .getDiagnosisCodes()
            .then(({ data: diagnosisCodes }) => {
               console.log("Refreshed diagnosis codes:", diagnosisCodes);
               setData(diagnosisCodes || []);
            })
            .catch((error) =>
               console.error("Error refreshing diagnosis codes:", error)
            )
            .finally(() => setLoading(false));
      },
   };

   return <GenericTable {...enhancedConfig} data={data} />;
};

export default DiagnosisTable;
