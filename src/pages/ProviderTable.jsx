import React, { useState, useEffect } from "react";
import GenericTable from "@/components/ui/generic-table";
import { tableConfigs } from "@/data/tableConfigs";
import { masterDataService } from "@/services/masterDataService";
import { supabase } from "@/lib/supabaseClient";

const ProviderTable = () => {
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(true);
   const config = tableConfigs.provider;

   // Fetch real-time data from Supabase
   useEffect(() => {
      const fetchData = async () => {
         try {
            const { data: providers, error } =
               await masterDataService.getProviders();
            if (error) {
               console.error("Error fetching providers:", error);
               setLoading(false);
               return;
            }
            console.log("Providers from API:", providers);
            setData(providers || []);
         } catch (error) {
            console.error("Error:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchData();

      // Set up real-time subscription
      const subscription = supabase
         .channel("providers")
         .on(
            "postgres_changes",
            {
               event: "*",
               schema: "public",
               table: "providers",
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

   // Handle add new provider
   const handleAdd = async (providerData) => {
      try {
         const { data: newProvider, error } =
            await masterDataService.createProvider(providerData);
         if (error) {
            alert(`Error: ${error}`);
            return;
         }
         // Data will be updated automatically via real-time subscription
         alert("Provider added successfully");
      } catch (error) {
         console.error("Error adding provider:", error);
         alert("Error occurred while adding provider");
      }
   };

   // Handle edit provider
   const handleEdit = async (id, providerData) => {
      try {
         const { data: updatedProvider, error } =
            await masterDataService.updateProvider(id, providerData);
         if (error) {
            alert(`Error: ${error}`);
            return;
         }
         // Data will be updated automatically via real-time subscription
         alert("Provider updated successfully");
      } catch (error) {
         console.error("Error updating provider:", error);
         alert("Error occurred while updating provider");
      }
   };

   // Handle delete provider
   const handleDelete = async (id) => {
      if (!confirm("Are you sure you want to delete this provider?")) {
         return;
      }

      try {
         // If id is an object, extract the actual id value
         const actualId = typeof id === "object" && id !== null ? id.id : id;
         console.log("Deleting provider with ID:", actualId);

         const { error } = await masterDataService.deleteProvider(actualId);
         if (error) {
            console.error("Error from deleteProvider:", error);
            alert(`Error: ${error.message || JSON.stringify(error)}`);
            return;
         }
         // Data will be updated automatically via real-time subscription
         alert("Provider deleted successfully");
      } catch (error) {
         console.error("Error deleting provider:", error);
         alert("Error occurred while deleting provider");
      }
   };

   // Enhanced config with real-time operations
   const enhancedConfig = {
      ...config,
      onAdd: handleAdd,
      onEdit: handleEdit,
      onDelete: handleDelete,
      loading,
   };

   return <GenericTable {...enhancedConfig} data={data} />;
};

export default ProviderTable;
