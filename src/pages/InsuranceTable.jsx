import React, { useState, useEffect } from "react";
import GenericTable from "@/components/ui/generic-table";
import { tableConfigs } from "@/data/tableConfigs";
import { insuranceData } from "@/data";
import { masterDataService } from "@/services/masterDataService";
import { supabase } from "@/lib/supabaseClient";

const InsuranceTable = () => {
   const [data, setData] = useState(insuranceData);
   const [loading, setLoading] = useState(true);
   const config = tableConfigs.insurance;

   // Fetch real-time data from Supabase
   useEffect(() => {
      const fetchData = async () => {
         try {
            const { data: insuranceCompanies, error } =
               await masterDataService.getInsuranceCompanies();
            if (error) {
               console.error("Error fetching insurance companies:", error);
               setLoading(false);
               return;
            }
            setData(insuranceCompanies || []);
         } catch (error) {
            console.error("Error:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchData();

      // Set up real-time subscription
      const subscription = supabase
         .channel("insurance-companies")
         .on(
            "postgres_changes",
            {
               event: "*",
               schema: "public",
               table: "insurance_companies",
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

   // Handle add new insurance company
   const handleAdd = async (insuranceData) => {
      try {
         const { data: newInsurance, error } =
            await masterDataService.createInsuranceCompany(insuranceData);
         if (error) {
            alert(`Error: ${error}`);
            return;
         }
         // Data will be updated automatically via real-time subscription
         alert("Insurance company added successfully");
      } catch (error) {
         console.error("Error adding insurance company:", error);
         alert("Error occurred while adding insurance company");
      }
   };

   // Handle edit insurance company
   const handleEdit = async (id, insuranceData) => {
      try {
         const { data: updatedInsurance, error } =
            await masterDataService.updateInsuranceCompany(id, insuranceData);
         if (error) {
            alert(`Error: ${error}`);
            return;
         }
         // Data will be updated automatically via real-time subscription
         alert("Insurance company updated successfully");
      } catch (error) {
         console.error("Error updating insurance company:", error);
         alert("Error occurred while updating insurance company");
      }
   };

   // Handle delete insurance company
   const handleDelete = async (id) => {
      if (!confirm("Are you sure you want to delete this insurance company?")) {
         return;
      }

      try {
         const { error } = await masterDataService.deleteInsuranceCompany(id);
         if (error) {
            alert(`Error: ${error}`);
            return;
         }
         // Data will be updated automatically via real-time subscription
         alert("Insurance company deleted successfully");
      } catch (error) {
         console.error("Error deleting insurance company:", error);
         alert("Error occurred while deleting insurance company");
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

export default InsuranceTable;
