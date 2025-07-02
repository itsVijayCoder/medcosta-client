// Patient management service for Supabase
import { supabase, handleSupabaseError } from "../lib/supabaseClient";

export const patientService = {
   /**
    * Test user permissions
    */
   async testPermissions() {
      try {
         console.log("=== TESTING USER PERMISSIONS ===");

         // Get current session
         const {
            data: { session },
            error: sessionError,
         } = await supabase.auth.getSession();
         if (sessionError) {
            console.error("Session error:", sessionError);
            return { hasPermission: false, error: sessionError };
         }

         if (!session?.user) {
            console.log("No user session found");
            return { hasPermission: false, error: "No user session" };
         }

         console.log(
            "Current user:",
            session.user.email,
            "ID:",
            session.user.id
         );

         // Direct profile check (more reliable than SQL function)
         const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

         if (profileError) {
            console.error("Profile lookup error:", profileError);
            return { hasPermission: false, error: profileError };
         }

         console.log("Profile found:", profile);
         const hasRole =
            profile &&
            [
               "super_admin",
               "admin",
               "doctor",
               "nurse",
               "receptionist",
            ].includes(profile.role);
         console.log("Has healthcare role:", hasRole);

         return {
            hasPermission: hasRole,
            profile,
            error: hasRole ? null : "User does not have required role",
         };
      } catch (error) {
         console.error("Permission test error:", error);
         return { hasPermission: false, error: handleSupabaseError(error) };
      }
   },

   /**
    * Create a new patient
    */
   async createPatient(formData) {
      try {
         console.log("=== CREATING PATIENT ===");
         console.log("Form data:", formData);

         // Test permissions first
         const permissionResult = await this.testPermissions();
         console.log("Permission check result:", permissionResult);

         if (!permissionResult.hasPermission) {
            throw new Error(
               `Permission denied: ${
                  permissionResult.error || "User not authorized"
               }`
            );
         }

         // Check current user session
         const {
            data: { session },
         } = await supabase.auth.getSession();
         console.log("Current session:", session?.user?.email);

         // Check user profile
         if (session?.user) {
            const { data: profile } = await supabase
               .from("profiles")
               .select("*")
               .eq("id", session.user.id)
               .single();
            console.log("User profile:", profile);
         }

         // Generate patient number if not provided
         if (!formData.patient_number) {
            const { data: numberData } = await this.generatePatientNumber();
            formData.patient_number = numberData;
         }

         // Separate patient data from related data
         const patientData = {
            patient_number: formData.patient_number,
            first_name: formData.first_name,
            last_name: formData.last_name,
            date_of_birth: formData.dob || formData.date_of_birth,
            ssn: formData.ssn,
            gender: formData.gender,
            address: formData.address,
            city: formData.city,
            state: formData.state || formData.state_filed,
            zip: formData.zip || formData.pincode,
            home_phone: formData.home_phone || formData.phone,
            mobile_phone: formData.mobile_phone,
            email: formData.email,
            emergency_contact_name: formData.emergency_contact_name,
            emergency_contact_phone: formData.emergency_contact_phone,
            emergency_contact_relationship:
               formData.emergency_contact_relationship,
            case_type: formData.case_type,
            date_filed: formData.date_filed,
            state_filed: formData.state_filed,
            is_active: true,
            created_at: new Date().toISOString(),
         };

         // Create the patient record
         const { data: patient, error: patientError } = await supabase
            .from("patients")
            .insert([patientData])
            .select()
            .single();

         if (patientError) throw patientError;

         // Create employer record if employer data exists
         if (formData.employer_name || formData.adjuster_name) {
            const employerData = {
               patient_id: patient.id,
               employer_name: formData.employer_name,
               employer_address: formData.employer_address,
               employer_city: formData.employer_city,
               employer_state: formData.employer_state,
               employer_zip: formData.employer_zip,
               employer_phone: formData.employer_phone,
               adjuster_name: formData.adjuster_name,
               adjuster_phone: formData.adjuster_phone,
               adjuster_email: formData.adjuster_email,
               claim_number: formData.claim_number || formData.claim,
               date_of_injury: formData.date_of_injury,
               is_current: true,
               created_at: new Date().toISOString(),
            };

            const { error: employerError } = await supabase
               .from("patient_employers")
               .insert([employerData]);

            if (employerError) {
               console.error("Error creating employer record:", employerError);
               // Don't fail the whole operation for employer data
            }
         }

         // Create insurance record if insurance data exists
         if (formData.insurance_name || formData.policy_number) {
            // First, try to find the insurance company by name
            let insuranceCompanyId = null;
            if (formData.insurance_name) {
               const { data: insuranceCompanies } = await supabase
                  .from("insurance_companies")
                  .select("id")
                  .ilike("name", formData.insurance_name)
                  .limit(1);

               if (insuranceCompanies && insuranceCompanies.length > 0) {
                  insuranceCompanyId = insuranceCompanies[0].id;
               }
            }

            const insuranceData = {
               patient_id: patient.id,
               insurance_company_id: insuranceCompanyId,
               policy_number: formData.policy_number,
               group_number: formData.group_number,
               subscriber_name:
                  formData.subscriber_name ||
                  `${formData.first_name} ${formData.last_name}`,
               subscriber_dob: formData.subscriber_dob || formData.dob,
               relationship: formData.relationship || "Self",
               effective_date: formData.effective_date,
               termination_date: formData.termination_date,
               copay_amount: formData.copay_amount,
               deductible_amount: formData.deductible_amount,
               is_primary: true,
               is_active: true,
               created_at: new Date().toISOString(),
            };

            const { error: insuranceError } = await supabase
               .from("patient_insurance")
               .insert([insuranceData]);

            if (insuranceError) {
               console.error(
                  "Error creating insurance record:",
                  insuranceError
               );
               // Don't fail the whole operation for insurance data
            }
         }

         return { data: patient, error: null };
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
