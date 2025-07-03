import React, { useState, useEffect } from "react";
import GenericTable from "@/components/ui/generic-table";
import { tableConfigs } from "@/data/tableConfigs";
import { masterDataService } from "@/services/masterDataService";
import { supabase } from "@/lib/supabaseClient";

const ProcedureTable = () => {
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(true);
   const config = tableConfigs.procedure;

   // Fetch real-time data from Supabase
   useEffect(() => {
      const fetchData = async () => {
         try {
            const { data: procedures, error } =
               await masterDataService.getProcedures();
            if (error) {
               console.error("Error fetching procedures:", error);
               setLoading(false);
               return;
            }
            console.log("Procedures from API:", procedures);
            setData(procedures || []);
         } catch (error) {
            console.error("Error:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchData();

      // Set up real-time subscription
      const subscription = supabase
         .channel("procedures")
         .on(
            "postgres_changes",
            {
               event: "*",
               schema: "public",
               table: "procedures",
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

   // Handle add new procedure
   const handleAdd = async (procedureData) => {
      try {
         const { data: newProcedure, error } =
            await masterDataService.createProcedure(procedureData);
         if (error) {
            alert(`Error: ${error}`);
            return;
         }
         // Data will be updated automatically via real-time subscription
         alert("Procedure added successfully");
      } catch (error) {
         console.error("Error adding procedure:", error);
         alert("Error occurred while adding procedure");
      }
   };

   // Handle edit procedure
   const handleEdit = async (id, procedureData) => {
      try {
         const { data: updatedProcedure, error } =
            await masterDataService.updateProcedure(id, procedureData);
         if (error) {
            alert(`Error: ${error}`);
            return;
         }
         // Data will be updated automatically via real-time subscription
         alert("Procedure updated successfully");
      } catch (error) {
         console.error("Error updating procedure:", error);
         alert("Error occurred while updating procedure");
      }
   };

   // Handle delete procedure
   const handleDelete = async (id) => {
      try {
         // If id is an object, extract the actual id value
         const actualId = typeof id === "object" && id !== null ? id.id : id;
         console.log("Deleting procedure with ID:", actualId);

         const { error } = await masterDataService.deleteProcedure(actualId);
         if (error) {
            console.error("Error from deleteProcedure:", error);
            alert(`Error: ${error.message || JSON.stringify(error)}`);
            return;
         }
         // Data will be updated automatically via real-time subscription
         alert("Procedure deleted successfully");
      } catch (error) {
         console.error("Error deleting procedure:", error);
         alert("Error occurred while deleting procedure");
      }
   };

   // Enhanced config with real-time operations using Supabase
   const enhancedConfig = {
      ...config,
      // Don't provide onDelete, let the generic table handle confirmation
      // onDelete: handleDelete,
      loading,
      dataSource: "procedures", // Connect to Supabase procedures table
      refreshData: () => {
         setLoading(true);
         masterDataService
            .getProcedures()
            .then(({ data: procedures }) => {
               console.log("Refreshed procedures:", procedures);
               setData(procedures || []);
            })
            .catch((error) =>
               console.error("Error refreshing procedures:", error)
            )
            .finally(() => setLoading(false));
      },
   };

   return <GenericTable {...enhancedConfig} data={data} />;
};

export default ProcedureTable;
