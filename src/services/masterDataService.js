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
         const { data, error } = await supabase
            .from("locations")
            .insert([locationData])
            .select()
            .single();

         if (error) throw error;

         return { data, error: null };
      } catch (error) {
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Update location
    */
   async updateLocation(id, updates) {
      try {
         const { data, error } = await supabase
            .from("locations")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

         if (error) throw error;

         return { data, error: null };
      } catch (error) {
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Delete location
    */
   async deleteLocation(id) {
      try {
         const { data, error } = await supabase
            .from("locations")
            .update({ is_active: false })
            .eq("id", id)
            .select()
            .single();

         if (error) throw error;

         return { data, error: null };
      } catch (error) {
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
         const { data, error } = await supabase
            .from("insurance_companies")
            .insert([insuranceData])
            .select()
            .single();

         if (error) throw error;

         return { data, error: null };
      } catch (error) {
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Update insurance company
    */
   async updateInsuranceCompany(id, updates) {
      try {
         const { data, error } = await supabase
            .from("insurance_companies")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

         if (error) throw error;

         return { data, error: null };
      } catch (error) {
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Delete insurance company
    */
   async deleteInsuranceCompany(id) {
      try {
         const { data, error } = await supabase
            .from("insurance_companies")
            .update({ is_active: false })
            .eq("id", id)
            .select()
            .single();

         if (error) throw error;

         return { data, error: null };
      } catch (error) {
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
         const { data, error } = await supabase
            .from("providers")
            .insert([providerData])
            .select(
               `
          *,
          locations (
            id,
            location_name
          )
        `
            )
            .single();

         if (error) throw error;

         return { data, error: null };
      } catch (error) {
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Update provider
    */
   async updateProvider(id, updates) {
      try {
         const { data, error } = await supabase
            .from("providers")
            .update(updates)
            .eq("id", id)
            .select(
               `
          *,
          locations (
            id,
            location_name
          )
        `
            )
            .single();

         if (error) throw error;

         return { data, error: null };
      } catch (error) {
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Delete provider
    */
   async deleteProvider(id) {
      try {
         const { data, error } = await supabase
            .from("providers")
            .update({ is_active: false })
            .eq("id", id)
            .select()
            .single();

         if (error) throw error;

         return { data, error: null };
      } catch (error) {
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
         const { data, error } = await supabase
            .from("diagnosis_codes")
            .insert([diagnosisData])
            .select()
            .single();

         if (error) throw error;

         return { data, error: null };
      } catch (error) {
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Update diagnosis code
    */
   async updateDiagnosisCode(id, updates) {
      try {
         const { data, error } = await supabase
            .from("diagnosis_codes")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

         if (error) throw error;

         return { data, error: null };
      } catch (error) {
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Delete diagnosis code
    */
   async deleteDiagnosisCode(id) {
      try {
         const { data, error } = await supabase
            .from("diagnosis_codes")
            .update({ is_active: false })
            .eq("id", id)
            .select()
            .single();

         if (error) throw error;

         return { data, error: null };
      } catch (error) {
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
         const { data, error } = await supabase
            .from("procedures")
            .insert([procedureData])
            .select(
               `
          *,
          locations (
            id,
            location_name
          )
        `
            )
            .single();

         if (error) throw error;

         return { data, error: null };
      } catch (error) {
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Update procedure
    */
   async updateProcedure(id, updates) {
      try {
         const { data, error } = await supabase
            .from("procedures")
            .update(updates)
            .eq("id", id)
            .select(
               `
          *,
          locations (
            id,
            location_name
          )
        `
            )
            .single();

         if (error) throw error;

         return { data, error: null };
      } catch (error) {
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Delete procedure
    */
   async deleteProcedure(id) {
      try {
         const { data, error } = await supabase
            .from("procedures")
            .update({ is_active: false })
            .eq("id", id)
            .select()
            .single();

         if (error) throw error;

         return { data, error: null };
      } catch (error) {
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   // ==================== MODIFIERS ====================

   /**
    * Get all modifiers
    */
   async getModifiers(filters = {}) {
      try {
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

         const { data, error } = await query.order("modifier_name");

         if (error) throw error;

         return { data: data || [], error: null };
      } catch (error) {
         return { data: [], error: handleSupabaseError(error) };
      }
   },

   /**
    * Create new modifier
    */
   async createModifier(modifierData) {
      try {
         const { data, error } = await supabase
            .from("modifiers")
            .insert([modifierData])
            .select()
            .single();

         if (error) throw error;

         return { data, error: null };
      } catch (error) {
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Update modifier
    */
   async updateModifier(id, updates) {
      try {
         const { data, error } = await supabase
            .from("modifiers")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

         if (error) throw error;

         return { data, error: null };
      } catch (error) {
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Delete modifier
    */
   async deleteModifier(id) {
      try {
         const { data, error } = await supabase
            .from("modifiers")
            .update({ is_active: false })
            .eq("id", id)
            .select()
            .single();

         if (error) throw error;

         return { data, error: null };
      } catch (error) {
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
