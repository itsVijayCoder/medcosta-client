// Master data management service for Supabase
import { supabase, handleSupabaseError } from "../lib/supabaseClient";

export const masterDataService = {
   // ==================== LOCATIONS ====================

   /**
    * Get all locations
    */
   async getLocations(filters = {}) {
      try {
         let query = supabase
            .from("locations")
            .select("*")
            .eq("is_active", true);

         if (filters.search) {
            query = query.ilike("location_name", `%${filters.search}%`);
         }

         if (filters.state) {
            query = query.eq("state", filters.state);
         }

         const { data, error } = await query.order("location_name");

         if (error) throw error;

         return { data: data || [], error: null };
      } catch (error) {
         return { data: [], error: handleSupabaseError(error) };
      }
   },

   /**
    * Create new location
    */
   async createLocation(locationData) {
      try {
         console.log("Creating location with data:", locationData);

         // Make sure location_name is provided
         if (!locationData.location_name) {
            console.error("Location name is required");
            return { data: null, error: "Location name is required" };
         }

         // Ensure is_active is set to true for new records
         const dataToInsert = { ...locationData, is_active: true };

         const { data, error } = await supabase
            .from("locations")
            .insert([dataToInsert])
            .select();

         console.log("Create location result:", { data, error });

         if (error) {
            console.error("Error creating location:", error);
            throw error;
         }

         return { data: data[0], error: null };
      } catch (error) {
         console.error("Exception in createLocation:", error);
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Update location
    */
   async updateLocation(id, updates) {
      try {
         console.log("Updating location with ID:", id, "Updates:", updates);

         if (!id) {
            console.error("Invalid ID provided for location update");
            return { data: null, error: "Invalid ID provided" };
         }

         const { data, error } = await supabase
            .from("locations")
            .update(updates)
            .eq("id", id)
            .select();

         console.log("Update location result:", { data, error });

         if (error) {
            console.error("Error updating location:", error);
            throw error;
         }

         return { data: data && data.length > 0 ? data[0] : null, error: null };
      } catch (error) {
         console.error("Exception in updateLocation:", error);
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Delete location
    */
   async deleteLocation(id) {
      try {
         console.log("deleteLocation called with ID:", id);

         // Perform soft delete by updating is_active to false
         const { data, error } = await supabase
            .from("locations")
            .update({
               is_active: false,
               updated_at: new Date().toISOString(),
            })
            .eq("id", id);

         if (error) {
            console.error("Error in deleteLocation:", error);
            throw error;
         }

         // Success response
         return { data: true, error: null };
      } catch (error) {
         console.error("Error in deleteLocation:", error);
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   // ==================== INSURANCE COMPANIES ====================

   /**
    * Get all insurance companies
    */
   async getInsuranceCompanies(filters = {}) {
      try {
         let query = supabase
            .from("insurance_companies")
            .select("*")
            .eq("is_active", true);

         if (filters.search) {
            query = query.ilike("name", `%${filters.search}%`);
         }

         if (filters.state) {
            query = query.eq("state", filters.state);
         }

         const { data, error } = await query.order("name");

         if (error) throw error;

         return { data: data || [], error: null };
      } catch (error) {
         return { data: [], error: handleSupabaseError(error) };
      }
   },

   /**
    * Create new insurance company
    */
   async createInsuranceCompany(insuranceData) {
      try {
         console.log("Creating insurance company with data:", insuranceData);

         // Make sure name is provided
         if (!insuranceData.name) {
            console.error("Insurance company name is required");
            return { data: null, error: "Insurance company name is required" };
         }

         // Ensure is_active is set to true for new records
         const dataToInsert = { ...insuranceData, is_active: true };

         const { data, error } = await supabase
            .from("insurance_companies")
            .insert([dataToInsert])
            .select();

         console.log("Create insurance company result:", { data, error });

         if (error) {
            console.error("Error creating insurance company:", error);
            throw error;
         }

         return { data: data[0], error: null };
      } catch (error) {
         console.error("Exception in createInsuranceCompany:", error);
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Update insurance company
    */
   async updateInsuranceCompany(id, updates) {
      try {
         console.log(
            "Updating insurance company with ID:",
            id,
            "Updates:",
            updates
         );

         if (!id) {
            console.error("Invalid ID provided for insurance company update");
            return { data: null, error: "Invalid ID provided" };
         }

         const { data, error } = await supabase
            .from("insurance_companies")
            .update(updates)
            .eq("id", id)
            .select();

         console.log("Update insurance company result:", { data, error });

         if (error) {
            console.error("Error updating insurance company:", error);
            throw error;
         }

         return { data: data && data.length > 0 ? data[0] : null, error: null };
      } catch (error) {
         console.error("Exception in updateInsuranceCompany:", error);
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Delete insurance company
    */
   async deleteInsuranceCompany(id) {
      try {
         console.log("deleteInsuranceCompany called with ID:", id);

         // Perform soft delete by updating is_active to false
         const { data, error } = await supabase
            .from("insurance_companies")
            .update({
               is_active: false,
               updated_at: new Date().toISOString(),
            })
            .eq("id", id);

         if (error) {
            console.error("Error in deleteInsuranceCompany:", error);
            throw error;
         }

         // Success response
         return { data: true, error: null };
      } catch (error) {
         console.error("Error in deleteInsuranceCompany:", error);
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   // ==================== PROVIDERS ====================

   /**
    * Get all providers
    */
   async getProviders(filters = {}) {
      try {
         let query = supabase
            .from("providers")
            .select(
               `
          *,
          locations (
            id,
            location_name
          )
        `
            )
            .eq("is_active", true);

         if (filters.search) {
            query = query.or(
               `name.ilike.%${filters.search}%,npi.ilike.%${filters.search}%`
            );
         }

         if (filters.specialty) {
            query = query.eq("specialty", filters.specialty);
         }

         if (filters.locationId) {
            query = query.eq("location_id", filters.locationId);
         }

         const { data, error } = await query.order("name");

         if (error) throw error;

         return { data: data || [], error: null };
      } catch (error) {
         return { data: [], error: handleSupabaseError(error) };
      }
   },

   /**
    * Create new provider
    */
   async createProvider(providerData) {
      try {
         console.log("Creating provider with data:", providerData);

         // Make sure name is provided
         if (!providerData.name) {
            console.error("Provider name is required");
            return { data: null, error: "Provider name is required" };
         }

         // Validate location_id if provided (should be a UUID)
         if (providerData.location_id) {
            const uuidRegex =
               /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(providerData.location_id)) {
               console.error(
                  "Invalid location_id format:",
                  providerData.location_id
               );
               return {
                  data: null,
                  error: "Invalid location selected. Please select a valid location.",
               };
            }
         }

         // Ensure is_active is set to true for new records
         const dataToInsert = { ...providerData, is_active: true };

         const { data, error } = await supabase
            .from("providers")
            .insert([dataToInsert]).select(`
               *,
               locations (
                 id,
                 location_name
               )
             `);

         console.log("Create provider result:", { data, error });

         if (error) {
            console.error("Error creating provider:", error);
            throw error;
         }

         return { data: data[0], error: null };
      } catch (error) {
         console.error("Exception in createProvider:", error);
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Update provider
    */
   async updateProvider(id, updates) {
      try {
         console.log("Updating provider with ID:", id, "Updates:", updates);

         if (!id) {
            console.error("Invalid ID provided for provider update");
            return { data: null, error: "Invalid ID provided" };
         }

         const { data, error } = await supabase
            .from("providers")
            .update(updates)
            .eq("id", id).select(`
               *,
               locations (
                 id,
                 location_name
               )
             `);

         console.log("Update provider result:", { data, error });

         if (error) {
            console.error("Error updating provider:", error);
            throw error;
         }

         return { data: data && data.length > 0 ? data[0] : null, error: null };
      } catch (error) {
         console.error("Exception in updateProvider:", error);
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Delete provider
    */
   async deleteProvider(id) {
      try {
         console.log("deleteProvider called with ID:", id);

         // Perform soft delete by updating is_active to false
         const { data, error } = await supabase
            .from("providers")
            .update({
               is_active: false,
               updated_at: new Date().toISOString(),
            })
            .eq("id", id);

         if (error) {
            console.error("Error in deleteProvider:", error);
            throw error;
         }

         // Success response
         return { data: true, error: null };
      } catch (error) {
         console.error("Error in deleteProvider:", error);
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   // ==================== DIAGNOSIS CODES ====================

   /**
    * Get all diagnosis codes
    */
   async getDiagnosisCodes(filters = {}) {
      try {
         let query = supabase
            .from("diagnosis_codes")
            .select("*")
            .eq("is_active", true);

         if (filters.search) {
            query = query.or(
               `diagnosis_code.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
            );
         }

         if (filters.category) {
            query = query.eq("category", filters.category);
         }

         if (filters.preferred) {
            query = query.eq("is_preferred", true);
         }

         const { data, error } = await query.order("diagnosis_code");

         if (error) throw error;

         return { data: data || [], error: null };
      } catch (error) {
         return { data: [], error: handleSupabaseError(error) };
      }
   },

   /**
    * Create new diagnosis code
    */
   async createDiagnosisCode(diagnosisData) {
      try {
         console.log("Creating diagnosis code with data:", diagnosisData);

         // Make sure diagnosis_code is provided
         if (!diagnosisData.diagnosis_code) {
            console.error("Diagnosis code is required");
            return { data: null, error: "Diagnosis code is required" };
         }

         // Ensure is_active is set to true for new records
         const dataToInsert = { ...diagnosisData, is_active: true };

         // Handle booleans properly
         if (dataToInsert.is_preferred !== undefined) {
            dataToInsert.is_preferred = Boolean(dataToInsert.is_preferred);
         }

         const { data, error } = await supabase
            .from("diagnosis_codes")
            .insert([dataToInsert])
            .select();

         console.log("Create diagnosis code result:", { data, error });

         if (error) {
            console.error("Error creating diagnosis code:", error);
            throw error;
         }

         return { data: data[0], error: null };
      } catch (error) {
         console.error("Exception in createDiagnosisCode:", error);
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Update diagnosis code
    */
   async updateDiagnosisCode(id, updates) {
      try {
         console.log(
            "Updating diagnosis code with ID:",
            id,
            "Updates:",
            updates
         );

         if (!id) {
            console.error("Invalid ID provided for diagnosis code update");
            return { data: null, error: "Invalid ID provided" };
         }

         // Handle booleans properly
         if (updates.is_preferred !== undefined) {
            updates.is_preferred = Boolean(updates.is_preferred);
         }

         const { data, error } = await supabase
            .from("diagnosis_codes")
            .update(updates)
            .eq("id", id)
            .select();

         console.log("Update diagnosis code result:", { data, error });

         if (error) {
            console.error("Error updating diagnosis code:", error);
            throw error;
         }

         return { data: data && data.length > 0 ? data[0] : null, error: null };
      } catch (error) {
         console.error("Exception in updateDiagnosisCode:", error);
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Delete diagnosis code
    */
   async deleteDiagnosisCode(id) {
      try {
         console.log("deleteDiagnosisCode called with ID:", id);

         // Perform soft delete by updating is_active to false
         const { data, error } = await supabase
            .from("diagnosis_codes")
            .update({
               is_active: false,
               updated_at: new Date().toISOString(),
            })
            .eq("id", id);

         if (error) {
            console.error("Error in deleteDiagnosisCode:", error);
            throw error;
         }

         // Success response
         return { data: true, error: null };
      } catch (error) {
         console.error("Error in deleteDiagnosisCode:", error);
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   // ==================== PROCEDURES ====================

   /**
    * Get all procedures
    */
   async getProcedures(filters = {}) {
      try {
         let query = supabase
            .from("procedures")
            .select(
               `
          *,
          locations (
            id,
            location_name
          )
        `
            )
            .eq("is_active", true);

         if (filters.search) {
            query = query.or(
               `procedure_code.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
            );
         }

         if (filters.specialty) {
            query = query.eq("specialty", filters.specialty);
         }

         if (filters.category) {
            query = query.eq("category", filters.category);
         }

         if (filters.preferred) {
            query = query.eq("is_preferred", true);
         }

         const { data, error } = await query.order("procedure_code");

         if (error) throw error;

         return { data: data || [], error: null };
      } catch (error) {
         return { data: [], error: handleSupabaseError(error) };
      }
   },

   /**
    * Create new procedure
    */
   async createProcedure(procedureData) {
      try {
         console.log("Creating procedure with data:", procedureData);

         // Make sure procedure_code is provided
         if (!procedureData.procedure_code) {
            console.error("Procedure code is required");
            return { data: null, error: "Procedure code is required" };
         }

         // Ensure is_active is set to true for new records
         const dataToInsert = { ...procedureData, is_active: true };

         // Handle booleans properly
         if (dataToInsert.is_preferred !== undefined) {
            dataToInsert.is_preferred = Boolean(dataToInsert.is_preferred);
         }

         const { data, error } = await supabase
            .from("procedures")
            .insert([dataToInsert]).select(`
               *,
               locations (
                 id,
                 location_name
               )
             `);

         console.log("Create procedure result:", { data, error });

         if (error) {
            console.error("Error creating procedure:", error);
            throw error;
         }

         return { data: data[0], error: null };
      } catch (error) {
         console.error("Exception in createProcedure:", error);
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Update procedure
    */
   async updateProcedure(id, updates) {
      try {
         console.log("Updating procedure with ID:", id, "Updates:", updates);

         if (!id) {
            console.error("Invalid ID provided for procedure update");
            return { data: null, error: "Invalid ID provided" };
         }

         // Handle booleans properly
         if (updates.is_preferred !== undefined) {
            updates.is_preferred = Boolean(updates.is_preferred);
         }

         const { data, error } = await supabase
            .from("procedures")
            .update(updates)
            .eq("id", id).select(`
               *,
               locations (
                 id,
                 location_name
               )
             `);

         console.log("Update procedure result:", { data, error });

         if (error) {
            console.error("Error updating procedure:", error);
            throw error;
         }

         return { data: data && data.length > 0 ? data[0] : null, error: null };
      } catch (error) {
         console.error("Exception in updateProcedure:", error);
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Delete procedure
    */
   async deleteProcedure(id) {
      try {
         console.log("deleteProcedure called with ID:", id);

         // Perform soft delete by updating is_active to false
         const { data, error } = await supabase
            .from("procedures")
            .update({
               is_active: false,
               updated_at: new Date().toISOString(),
            })
            .eq("id", id);

         if (error) {
            console.error("Error in deleteProcedure:", error);
            throw error;
         }

         // Success response
         return { data: true, error: null };
      } catch (error) {
         console.error("Error in deleteProcedure:", error);
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   // ==================== MODIFIERS ====================

   /**
    * Get all modifiers
    */
   async getModifiers(filters = {}) {
      try {
         console.log(
            "masterDataService.getModifiers called with filters:",
            filters
         );
         let query = supabase
            .from("modifiers")
            .select("*")
            .eq("is_active", true);

         if (filters.specialty) {
            query = query.eq("specialty", filters.specialty);
         }

         if (filters.search) {
            query = query.or(
               `modifier_name.ilike.%${filters.search}%,modifier_code.ilike.%${filters.search}%`
            );
         }

         if (filters.defaultOnly) {
            query = query.eq("is_default", true);
         }

         console.log("About to execute Supabase query for modifiers");
         const { data, error } = await query.order("modifier_name");
         console.log("Supabase modifier query results:", { data, error });

         if (error) throw error;

         return { data: data || [], error: null };
      } catch (error) {
         console.error("Error in masterDataService.getModifiers:", error);
         return { data: [], error: handleSupabaseError(error) };
      }
   },

   /**
    * Create new modifier
    */
   async createModifier(modifierData) {
      try {
         console.log("Creating modifier with data:", modifierData);

         // Make sure modifier_code is provided
         if (!modifierData.modifier_code) {
            console.error("Modifier code is required");
            return { data: null, error: "Modifier code is required" };
         }

         // Ensure is_active is set to true for new records
         const dataToInsert = { ...modifierData, is_active: true };

         // Handle booleans properly
         if (dataToInsert.is_default !== undefined) {
            dataToInsert.is_default = Boolean(dataToInsert.is_default);
         }

         const { data, error } = await supabase
            .from("modifiers")
            .insert([dataToInsert])
            .select();

         console.log("Create modifier result:", { data, error });

         if (error) {
            console.error("Error creating modifier:", error);
            throw error;
         }

         return { data: data[0], error: null };
      } catch (error) {
         console.error("Exception in createModifier:", error);
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Update modifier
    */
   async updateModifier(id, updates) {
      try {
         console.log("Updating modifier with ID:", id, "Updates:", updates);

         if (!id) {
            console.error("Invalid ID provided for modifier update");
            return { data: null, error: "Invalid ID provided" };
         }

         // Handle booleans properly
         if (updates.is_default !== undefined) {
            updates.is_default = Boolean(updates.is_default);
         }

         const { data, error } = await supabase
            .from("modifiers")
            .update(updates)
            .eq("id", id)
            .select();

         console.log("Update modifier result:", { data, error });

         if (error) {
            console.error("Error updating modifier:", error);
            throw error;
         }

         return { data: data && data.length > 0 ? data[0] : null, error: null };
      } catch (error) {
         console.error("Exception in updateModifier:", error);
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Delete modifier
    */
   async deleteModifier(id) {
      try {
         console.log("deleteModifier called with ID:", id);

         // Perform soft delete by updating is_active to false
         const { data, error } = await supabase
            .from("modifiers")
            .update({
               is_active: false,
               updated_at: new Date().toISOString(),
            })
            .eq("id", id);

         if (error) {
            console.error("Error in deleteModifier:", error);
            throw error;
         }

         // Success response
         return { data: true, error: null };
      } catch (error) {
         console.error("Error in deleteModifier:", error);
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   // ==================== DELETED RECORDS (SOFT DELETE) ====================

   /**
    * Get deleted records from any table (where is_active = false)
    */
   async getDeletedRecords(tableName, filters = {}) {
      try {
         console.log(
            `getDeletedRecords called for ${tableName} with filters:`,
            filters
         );

         let query = supabase
            .from(tableName)
            .select("*")
            .eq("is_active", false);

         // Apply search filters based on table type
         if (filters.search) {
            switch (tableName) {
               case "locations":
                  query = query.ilike("location_name", `%${filters.search}%`);
                  break;
               case "insurance_companies":
                  query = query.ilike("name", `%${filters.search}%`);
                  break;
               case "providers":
                  query = query.or(
                     `name.ilike.%${filters.search}%,npi.ilike.%${filters.search}%`
                  );
                  break;
               case "diagnosis_codes":
                  query = query.or(
                     `diagnosis_code.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
                  );
                  break;
               case "procedures":
                  query = query.or(
                     `procedure_code.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
                  );
                  break;
               case "modifiers":
                  query = query.or(
                     `modifier_name.ilike.%${filters.search}%,modifier_code.ilike.%${filters.search}%`
                  );
                  break;
            }
         }

         // Apply other filters
         if (
            filters.specialty &&
            (tableName === "providers" ||
               tableName === "procedures" ||
               tableName === "modifiers")
         ) {
            query = query.eq("specialty", filters.specialty);
         }

         if (
            filters.category &&
            (tableName === "diagnosis_codes" || tableName === "procedures")
         ) {
            query = query.eq("category", filters.category);
         }

         if (
            filters.state &&
            (tableName === "locations" || tableName === "insurance_companies")
         ) {
            query = query.eq("state", filters.state);
         }

         const { data, error } = await query.order("updated_at", {
            ascending: false,
         });

         if (error) throw error;

         console.log(`getDeletedRecords result for ${tableName}:`, {
            recordCount: data ? data.length : 0,
            hasError: !!error,
         });

         return { data: data || [], error: null };
      } catch (error) {
         console.error(`Error in getDeletedRecords for ${tableName}:`, error);
         return { data: [], error: handleSupabaseError(error) };
      }
   },

   /**
    * Restore a record (set is_active = true)
    */
   async restoreRecord(tableName, id) {
      try {
         console.log(`restoreRecord called for ${tableName} with ID:`, id);

         const { data, error } = await supabase
            .from(tableName)
            .update({
               is_active: true,
               updated_at: new Date().toISOString(),
            })
            .eq("id", id)
            .select();

         if (error) {
            console.error("Error restoring record:", error);
            throw error;
         }

         console.log("Record restored successfully:", data);
         return { data: data && data.length > 0 ? data[0] : null, error: null };
      } catch (error) {
         console.error("Error in restoreRecord:", error);
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Permanently delete a record (complete removal from database)
    */
   async permanentlyDeleteRecord(tableName, id) {
      try {
         console.log(
            `permanentlyDeleteRecord called for ${tableName} with ID:`,
            id
         );

         const { data, error } = await supabase
            .from(tableName)
            .delete()
            .eq("id", id)
            .select();

         if (error) {
            console.error("Error permanently deleting record:", error);
            throw error;
         }

         console.log("Record permanently deleted successfully:", data);
         return { data: data && data.length > 0 ? data[0] : null, error: null };
      } catch (error) {
         console.error("Error in permanentlyDeleteRecord:", error);
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   // ==================== UTILITY FUNCTIONS ====================

   /**
    * Get all specialties (from providers and procedures)
    */
   async getSpecialties() {
      try {
         const { data: providerSpecialties, error: providerError } =
            await supabase
               .from("providers")
               .select("specialty")
               .not("specialty", "is", null)
               .eq("is_active", true);

         if (providerError) throw providerError;

         const { data: procedureSpecialties, error: procedureError } =
            await supabase
               .from("procedures")
               .select("specialty")
               .not("specialty", "is", null)
               .eq("is_active", true);

         if (procedureError) throw procedureError;

         // Combine and deduplicate specialties
         const allSpecialties = [
            ...new Set([
               ...providerSpecialties.map((p) => p.specialty),
               ...procedureSpecialties.map((p) => p.specialty),
            ]),
         ]
            .filter(Boolean)
            .sort();

         return { data: allSpecialties, error: null };
      } catch (error) {
         return { data: [], error: handleSupabaseError(error) };
      }
   },

   /**
    * Get all diagnosis categories
    */
   async getDiagnosisCategories() {
      try {
         const { data, error } = await supabase
            .from("diagnosis_codes")
            .select("category")
            .not("category", "is", null)
            .eq("is_active", true);

         if (error) throw error;

         const categories = [...new Set(data.map((d) => d.category))]
            .filter(Boolean)
            .sort();

         return { data: categories, error: null };
      } catch (error) {
         return { data: [], error: handleSupabaseError(error) };
      }
   },

   /**
    * Get all procedure categories
    */
   async getProcedureCategories() {
      try {
         const { data, error } = await supabase
            .from("procedures")
            .select("category")
            .not("category", "is", null)
            .eq("is_active", true);

         if (error) throw error;

         const categories = [...new Set(data.map((p) => p.category))]
            .filter(Boolean)
            .sort();

         return { data: categories, error: null };
      } catch (error) {
         return { data: [], error: handleSupabaseError(error) };
      }
   },

   /**
    * Get system states list
    */
   async getStates() {
      try {
         // This could be a static list or stored in the database
         const states = [
            { id: 1, name: "Alabama", code: "AL" },
            { id: 2, name: "Alaska", code: "AK" },
            { id: 3, name: "Arizona", code: "AZ" },
            { id: 4, name: "Arkansas", code: "AR" },
            { id: 5, name: "California", code: "CA" },
            { id: 6, name: "Colorado", code: "CO" },
            { id: 7, name: "Connecticut", code: "CT" },
            { id: 8, name: "Delaware", code: "DE" },
            { id: 9, name: "Florida", code: "FL" },
            { id: 10, name: "Georgia", code: "GA" },
            { id: 11, name: "Hawaii", code: "HI" },
            { id: 12, name: "Idaho", code: "ID" },
            { id: 13, name: "Illinois", code: "IL" },
            { id: 14, name: "Indiana", code: "IN" },
            { id: 15, name: "Iowa", code: "IA" },
            { id: 16, name: "Kansas", code: "KS" },
            { id: 17, name: "Kentucky", code: "KY" },
            { id: 18, name: "Louisiana", code: "LA" },
            { id: 19, name: "Maine", code: "ME" },
            { id: 20, name: "Maryland", code: "MD" },
            { id: 21, name: "Massachusetts", code: "MA" },
            { id: 22, name: "Michigan", code: "MI" },
            { id: 23, name: "Minnesota", code: "MN" },
            { id: 24, name: "Mississippi", code: "MS" },
            { id: 25, name: "Missouri", code: "MO" },
            { id: 26, name: "Montana", code: "MT" },
            { id: 27, name: "Nebraska", code: "NE" },
            { id: 28, name: "Nevada", code: "NV" },
            { id: 29, name: "New Hampshire", code: "NH" },
            { id: 30, name: "New Jersey", code: "NJ" },
            { id: 31, name: "New Mexico", code: "NM" },
            { id: 32, name: "New York", code: "NY" },
            { id: 33, name: "North Carolina", code: "NC" },
            { id: 34, name: "North Dakota", code: "ND" },
            { id: 35, name: "Ohio", code: "OH" },
            { id: 36, name: "Oklahoma", code: "OK" },
            { id: 37, name: "Oregon", code: "OR" },
            { id: 38, name: "Pennsylvania", code: "PA" },
            { id: 39, name: "Rhode Island", code: "RI" },
            { id: 40, name: "South Carolina", code: "SC" },
            { id: 41, name: "South Dakota", code: "SD" },
            { id: 42, name: "Tennessee", code: "TN" },
            { id: 43, name: "Texas", code: "TX" },
            { id: 44, name: "Utah", code: "UT" },
            { id: 45, name: "Vermont", code: "VT" },
            { id: 46, name: "Virginia", code: "VA" },
            { id: 47, name: "Washington", code: "WA" },
            { id: 48, name: "West Virginia", code: "WV" },
            { id: 49, name: "Wisconsin", code: "WI" },
            { id: 50, name: "Wyoming", code: "WY" },
         ];

         return { data: states, error: null };
      } catch (error) {
         return { data: [], error: handleSupabaseError(error) };
      }
   },
};
