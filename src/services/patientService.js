// Patient management service for Supabase
import { supabase, handleSupabaseError } from "../lib/supabaseClient";

export const patientService = {
   /**
    * Create a new patient
    */
   async createPatient(patientData) {
      try {
         // Generate patient number if not provided
         if (!patientData.patient_number) {
            const { data: numberData } = await this.generatePatientNumber();
            patientData.patient_number = numberData;
         }

         const { data, error } = await supabase
            .from("patients")
            .insert([
               {
                  ...patientData,
                  created_at: new Date().toISOString(),
               },
            ])
            .select()
            .single();

         if (error) throw error;

         return { data, error: null };
      } catch (error) {
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Get all patients with optional filters
    */
   async getPatients(filters = {}) {
      try {
         let query = supabase
            .from("patients")
            .select(
               `
          *,
          patient_insurance (
            *,
            insurance_companies (
              id,
              name
            )
          ),
          patient_employers (*)
        `
            )
            .eq("is_active", true);

         // Apply filters
         if (filters.search) {
            query = query.or(
               `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,patient_number.ilike.%${filters.search}%`
            );
         }

         if (filters.case_type) {
            query = query.eq("case_type", filters.case_type);
         }

         if (filters.state) {
            query = query.eq("state", filters.state);
         }

         // Sorting
         const sortBy = filters.sortBy || "created_at";
         const sortOrder = filters.sortOrder || "desc";
         query = query.order(sortBy, { ascending: sortOrder === "asc" });

         // Pagination
         if (filters.page && filters.pageSize) {
            const from = (filters.page - 1) * filters.pageSize;
            const to = from + filters.pageSize - 1;
            query = query.range(from, to);
         }

         const { data, error, count } = await query;

         if (error) throw error;

         return { data: data || [], error: null, count };
      } catch (error) {
         return { data: [], error: handleSupabaseError(error), count: 0 };
      }
   },

   /**
    * Get a single patient by ID
    */
   async getPatient(id) {
      try {
         const { data, error } = await supabase
            .from("patients")
            .select(
               `
          *,
          patient_insurance (
            *,
            insurance_companies (*)
          ),
          patient_employers (*),
          appointments (
            *,
            providers (name),
            locations (location_name)
          )
        `
            )
            .eq("id", id)
            .single();

         if (error) throw error;

         return { data, error: null };
      } catch (error) {
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Update patient information
    */
   async updatePatient(id, updates) {
      try {
         const { data, error } = await supabase
            .from("patients")
            .update({
               ...updates,
               updated_at: new Date().toISOString(),
            })
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
    * Soft delete a patient
    */
   async deletePatient(id) {
      try {
         const { data, error } = await supabase
            .from("patients")
            .update({
               is_active: false,
               updated_at: new Date().toISOString(),
            })
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
    * Search patients by name and DOB for visit number generation
    */
   async findPatientByDetails(firstName, lastName, dateOfBirth) {
      try {
         const { data, error } = await supabase
            .from("patients")
            .select("id, patient_number, first_name, last_name")
            .eq("first_name", firstName)
            .eq("last_name", lastName)
            .eq("date_of_birth", dateOfBirth)
            .eq("is_active", true)
            .single();

         if (error) throw error;

         return { data, error: null };
      } catch (error) {
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Generate visit number for patient
    */
   async generateVisitNumber(patientId) {
      try {
         // Get patient info
         const { data: patient, error: patientError } = await supabase
            .from("patients")
            .select("patient_number")
            .eq("id", patientId)
            .single();

         if (patientError) throw patientError;

         // Count existing appointments for this patient
         const { count, error: countError } = await supabase
            .from("appointments")
            .select("*", { count: "exact", head: true })
            .eq("patient_id", patientId);

         if (countError) throw countError;

         const visitNumber = `${patient.patient_number}-${(count || 0) + 1}`;

         return { data: visitNumber, error: null };
      } catch (error) {
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Generate new patient number
    */
   async generatePatientNumber() {
      try {
         // Call the PostgreSQL function to generate patient number
         const { data, error } = await supabase.rpc("generate_patient_number");

         if (error) throw error;

         return { data, error: null };
      } catch (error) {
         // Fallback: get max patient number and increment
         try {
            const { data: patients, error: fetchError } = await supabase
               .from("patients")
               .select("patient_number")
               .order("created_at", { ascending: false })
               .limit(1);

            if (fetchError) throw fetchError;

            let nextNumber = 1;
            if (patients && patients.length > 0) {
               const lastNumber = parseInt(patients[0].patient_number) || 0;
               nextNumber = lastNumber + 1;
            }

            const patientNumber = nextNumber.toString().padStart(6, "0");
            return { data: patientNumber, error: null };
         } catch (fallbackError) {
            return { data: null, error: handleSupabaseError(fallbackError) };
         }
      }
   },

   /**
    * Add insurance information for a patient
    */
   async addPatientInsurance(insuranceData) {
      try {
         const { data, error } = await supabase
            .from("patient_insurance")
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
    * Update patient insurance
    */
   async updatePatientInsurance(id, updates) {
      try {
         const { data, error } = await supabase
            .from("patient_insurance")
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
    * Add employer information for a patient
    */
   async addPatientEmployer(employerData) {
      try {
         const { data, error } = await supabase
            .from("patient_employers")
            .insert([employerData])
            .select()
            .single();

         if (error) throw error;

         return { data, error: null };
      } catch (error) {
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Get patient statistics
    */
   async getPatientStats() {
      try {
         // Total active patients
         const { count: totalPatients, error: totalError } = await supabase
            .from("patients")
            .select("*", { count: "exact", head: true })
            .eq("is_active", true);

         if (totalError) throw totalError;

         // New patients this month
         const startOfMonth = new Date();
         startOfMonth.setDate(1);
         startOfMonth.setHours(0, 0, 0, 0);

         const { count: newThisMonth, error: monthError } = await supabase
            .from("patients")
            .select("*", { count: "exact", head: true })
            .eq("is_active", true)
            .gte("created_at", startOfMonth.toISOString());

         if (monthError) throw monthError;

         // Patients by case type
         const { data: caseTypeStats, error: caseError } = await supabase
            .from("patients")
            .select("case_type")
            .eq("is_active", true);

         if (caseError) throw caseError;

         const caseTypeCounts = caseTypeStats.reduce((acc, patient) => {
            acc[patient.case_type] = (acc[patient.case_type] || 0) + 1;
            return acc;
         }, {});

         return {
            data: {
               totalPatients: totalPatients || 0,
               newThisMonth: newThisMonth || 0,
               caseTypeCounts,
            },
            error: null,
         };
      } catch (error) {
         return { data: null, error: handleSupabaseError(error) };
      }
   },
};
