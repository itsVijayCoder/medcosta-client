import React, { useState, useEffect } from "react";
import GenericTable from "@/components/ui/generic-table";
import { tableConfigs } from "@/data/tableConfigs";
import { masterDataService } from "@/services/masterDataService";
import { supabase } from "@/lib/supabaseClient";

const LocationTable = () => {
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(true);
   const config = tableConfigs.location;

   // Fetch real-time data from Supabase
   useEffect(() => {
      const fetchData = async () => {
         try {
            const { data: locations, error } =
               await masterDataService.getLocations();
            if (error) {
               console.error("Error fetching locations:", error);
               setLoading(false);
               return;
            }
            console.log("Locations from API:", locations);
            setData(locations || []);
         } catch (error) {
            console.error("Error:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchData();

      // Set up real-time subscription
      const subscription = supabase
         .channel("locations")
         .on(
            "postgres_changes",
            {
               event: "*",
               schema: "public",
               table: "locations",
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

   // Handle add new location
   const handleAdd = async (locationData) => {
      try {
         const { data: newLocation, error } =
            await masterDataService.createLocation(locationData);
         if (error) {
            alert(`Error: ${error}`);
            return;
         }
         // Data will be updated automatically via real-time subscription
         alert("Location added successfully");
      } catch (error) {
         console.error("Error adding location:", error);
         alert("Error occurred while adding location");
      }
   };

   // Handle edit location
   const handleEdit = async (id, locationData) => {
      try {
         const { data: updatedLocation, error } =
            await masterDataService.updateLocation(id, locationData);
         if (error) {
            alert(`Error: ${error}`);
            return;
         }
         // Data will be updated automatically via real-time subscription
         alert("Location updated successfully");
      } catch (error) {
         console.error("Error updating location:", error);
         alert("Error occurred while updating location");
      }
   };

   // Handle delete location
   const handleDelete = async (id) => {
      try {
         // If id is an object, extract the actual id value
         const actualId = typeof id === "object" && id !== null ? id.id : id;
         console.log("Deleting location with ID:", actualId);

         const { error } = await masterDataService.deleteLocation(actualId);
         if (error) {
            console.error("Error from deleteLocation:", error);
            alert(`Error: ${error.message || JSON.stringify(error)}`);
            return;
         }
         // Data will be updated automatically via real-time subscription
         alert("Location deleted successfully");
      } catch (error) {
         console.error("Error deleting location:", error);
         alert("Error occurred while deleting location");
      }
   };

   // Enhanced config with real-time operations
   const enhancedConfig = {
      ...config,
      // Don't provide onDelete, let the generic table handle confirmation
      // onDelete: handleDelete,
      loading,
      dataSource: "locations", // Connect to Supabase locations table
      refreshData: () => {
         setLoading(true);
         masterDataService
            .getLocations()
            .then(({ data: locations }) => {
               console.log("Refreshed locations:", locations);
               setData(locations || []);
            })
            .catch((error) =>
               console.error("Error refreshing locations:", error)
            )
            .finally(() => setLoading(false));
      },
   };

   return <GenericTable {...enhancedConfig} data={data} />;
};

export default LocationTable;
