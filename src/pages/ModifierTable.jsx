import React, { useState, useEffect } from "react";
import GenericTable from "@/components/ui/generic-table";
import { tableConfigs } from "@/data/tableConfigs";
import { masterDataService } from "@/services/masterDataService";
import { supabase } from "@/lib/supabaseClient";
import { getTableDataWithFallback } from "@/lib/utils";
import { fallbackData } from "@/data/static/fallbackData";

const ModifierTable = () => {
   console.log("ModifierTable component rendering");
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(true);
   const config = tableConfigs.modifier;
   console.log("Table config:", config);

   // Debug helper function
   const logDataDetails = (data, label) => {
      console.log(`${label} - Type:`, typeof data);
      console.log(`${label} - Is Array:`, Array.isArray(data));
      console.log(
         `${label} - Length:`,
         Array.isArray(data) ? data.length : "N/A"
      );
      console.log(`${label} - Content:`, data);
      if (Array.isArray(data) && data.length > 0) {
         console.log(`${label} - First item keys:`, Object.keys(data[0]));
      }
   };

   // Add a function to normalize the modifier data to match expected schema
   const normalizeModifierData = (data) => {
      if (!Array.isArray(data)) return [];

      return data.map((item) => ({
         id: item.id,
         modifier_code: item.modifier_code || "",
         modifier_name: item.modifier_name || "",
         specialty: item.specialty || "",
         description: item.description || "",
         is_default:
            typeof item.is_default === "boolean" ? item.is_default : false,
         is_active: typeof item.is_active === "boolean" ? item.is_active : true,
         created_at: item.created_at || new Date().toISOString(),
         updated_at: item.updated_at || new Date().toISOString(),
      }));
   };

   // Fetch real-time data from Supabase
   useEffect(() => {
      const fetchData = async () => {
         try {
            setLoading(true);

            // Get data from API with fallback to static data
            console.log("Fetching modifiers from API...");
            const modifiersResponse = await masterDataService.getModifiers();
            logDataDetails(modifiersResponse, "Raw API response object");

            // Extract and normalize data from the response
            let modifiersData = [];
            if (modifiersResponse && modifiersResponse.data) {
               logDataDetails(modifiersResponse.data, "API response data");
               modifiersData = modifiersResponse.data;
            } else if (modifiersResponse && Array.isArray(modifiersResponse)) {
               // Handle case where response might be the array directly
               logDataDetails(modifiersResponse, "API response as array");
               modifiersData = modifiersResponse;
            }

            // If no data, try to get fallback data
            if (!modifiersData.length) {
               console.log("No data in API response, trying fallback");
               const fallbackData = await getTableDataWithFallback(
                  modifiersResponse,
                  "modifier"
               );
               logDataDetails(fallbackData, "Fallback data");
               modifiersData = fallbackData || [];
            }

            // Normalize the data to ensure it has the expected structure
            const normalizedData = normalizeModifierData(modifiersData);
            logDataDetails(normalizedData, "Normalized data");

            // Set the normalized data to state
            setData(normalizedData);

            console.log("Component data state after setting:", normalizedData);
            console.log("Is data empty?", normalizedData.length === 0);
         } catch (error) {
            console.error("Error fetching modifiers:", error);

            // On error, use the directly imported static data
            console.log("Using imported fallback data after error");
            const staticData = normalizeModifierData(
               fallbackData.modifier || []
            );
            logDataDetails(staticData, "Static data after error");
            setData(staticData);
         } finally {
            setLoading(false);
         }
      };

      fetchData();

      // Set up real-time subscription
      const subscription = supabase
         .channel("modifiers")
         .on(
            "postgres_changes",
            {
               event: "*",
               schema: "public",
               table: "modifiers",
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

   // Handle add new modifier
   const handleAdd = async (modifierData) => {
      try {
         const { data: newModifier, error } =
            await masterDataService.createModifier(modifierData);
         if (error) {
            alert(`Error: ${error}`);
            return;
         }
         // Data will be updated automatically via real-time subscription
         alert("Modifier added successfully");
      } catch (error) {
         console.error("Error adding modifier:", error);
         alert("Error occurred while adding modifier");
      }
   };

   // Handle edit modifier
   const handleEdit = async (id, modifierData) => {
      try {
         const { data: updatedModifier, error } =
            await masterDataService.updateModifier(id, modifierData);
         if (error) {
            alert(`Error: ${error}`);
            return;
         }
         // Data will be updated automatically via real-time subscription
         alert("Modifier updated successfully");
      } catch (error) {
         console.error("Error updating modifier:", error);
         alert("Error occurred while updating modifier");
      }
   };

   // Handle delete modifier
   const handleDelete = async (id) => {
      console.log("ModifierTable handleDelete called with id:", id);
      console.log("Type of id:", typeof id);

      if (!confirm("Are you sure you want to delete this modifier?")) {
         return;
      }

      try {
         // If id is an object, extract the actual id value
         const actualId = typeof id === "object" && id !== null ? id.id : id;
         console.log("Using actualId for deletion:", actualId);

         const { error } = await masterDataService.deleteModifier(actualId);
         if (error) {
            console.error("Error from deleteModifier:", error);
            alert(`Error: ${error.message || JSON.stringify(error)}`);
            return;
         }
         // Data will be updated automatically via real-time subscription
         alert("Modifier deleted successfully");
      } catch (error) {
         console.error("Exception deleting modifier:", error);
         alert("Error occurred while deleting modifier");
      }
   };

   // Enhanced config with real-time operations using Supabase
   const enhancedConfig = {
      ...config,
      onDelete: handleDelete,
      loading,
      dataSource: "modifiers", // Connect to Supabase modifiers table
      refreshData: () => {
         setLoading(true);
         masterDataService
            .getModifiers()
            .then(({ data: modifiers }) => {
               console.log("Refreshed modifiers:", modifiers);
               const normalizedData = normalizeModifierData(modifiers || []);
               setData(normalizedData);
            })
            .catch((error) => {
               console.error("Error refreshing modifiers:", error);
               // Use fallback data on error
               const staticData = normalizeModifierData(
                  fallbackData.modifier || []
               );
               setData(staticData);
            })
            .finally(() => setLoading(false));
      },
   };

   console.log("ModifierTable rendering with data:", data);
   console.log("ModifierTable data length:", data.length);
   console.log("ModifierTable is data empty?", data.length === 0);

   return <GenericTable {...enhancedConfig} data={data} />;
};

export default ModifierTable;
