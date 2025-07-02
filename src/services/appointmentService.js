// Appointment management service for Supabase
import { supabase, handleSupabaseError } from "../lib/supabaseClient";

export const appointmentService = {
   /**
    * Create a new appointment
    */
   async createAppointment(appointmentData) {
      try {
         const { data, error } = await supabase
            .from("appointments")
            .insert([
               {
                  ...appointmentData,
                  created_at: new Date().toISOString(),
               },
            ])
            .select(
               `
          *,
          patients (
            id,
            first_name,
            last_name,
            phone: home_phone
          ),
          providers (
            id,
            name,
            specialty
          ),
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
    * Get appointments with optional date range and filters
    */
   async getAppointments(filters = {}) {
      try {
         let query = supabase.from("appointments").select(`
          *,
          patients (
            first_name,
            last_name,
            home_phone,
            mobile_phone
          ),
          providers (
            name,
            specialty
          ),
          locations (
            location_name
          )
        `);

         // Date range filter
         if (filters.startDate && filters.endDate) {
            query = query
               .gte("appointment_date", filters.startDate)
               .lte("appointment_date", filters.endDate);
         } else if (filters.date) {
            query = query.eq("appointment_date", filters.date);
         }

         // Provider filter
         if (filters.providerId) {
            query = query.eq("provider_id", filters.providerId);
         }

         // Status filter
         if (filters.status) {
            query = query.eq("status", filters.status);
         }

         // Patient filter
         if (filters.patientId) {
            query = query.eq("patient_id", filters.patientId);
         }

         // Search filter
         if (filters.search) {
            // This requires a more complex query - you might want to implement full-text search
            // For now, we'll filter by patient name on the client side
         }

         // Sorting
         query = query
            .order("appointment_date", { ascending: true })
            .order("appointment_time", { ascending: true });

         const { data, error } = await query;

         if (error) throw error;

         return { data: data || [], error: null };
      } catch (error) {
         return { data: [], error: handleSupabaseError(error) };
      }
   },

   /**
    * Get a single appointment by ID
    */
   async getAppointment(id) {
      try {
         const { data, error } = await supabase
            .from("appointments")
            .select(
               `
          *,
          patients (*),
          providers (*),
          locations (*),
          appointment_procedures (
            *,
            procedures (*)
          ),
          appointment_diagnoses (
            *,
            diagnosis_codes (*)
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
    * Update appointment
    */
   async updateAppointment(id, updates) {
      try {
         const { data, error } = await supabase
            .from("appointments")
            .update({
               ...updates,
               updated_at: new Date().toISOString(),
            })
            .eq("id", id)
            .select(
               `
          *,
          patients (
            first_name,
            last_name,
            home_phone
          ),
          providers (
            name,
            specialty
          ),
          locations (
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
    * Update appointment status
    */
   async updateAppointmentStatus(id, status, notes = "") {
      try {
         const { data, error } = await supabase
            .from("appointments")
            .update({
               status,
               notes: notes || null,
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
    * Cancel appointment
    */
   async cancelAppointment(id, reason) {
      try {
         const { data, error } = await supabase
            .from("appointments")
            .update({
               status: "Cancelled",
               notes: reason,
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
    * Delete appointment (move to deleted_visits table)
    */
   async deleteAppointment(id, reason) {
      try {
         // First get the appointment data
         const { data: appointment, error: fetchError } =
            await this.getAppointment(id);
         if (fetchError) throw new Error(fetchError);

         // Insert into deleted_visits table
         const { error: insertError } = await supabase
            .from("deleted_visits")
            .insert([
               {
                  original_appointment_id: appointment.id,
                  patient_name: `${appointment.patients.first_name} ${appointment.patients.last_name}`,
                  patient_id: appointment.patient_id,
                  provider_name: appointment.providers.name,
                  appointment_date: appointment.appointment_date,
                  appointment_time: appointment.appointment_time,
                  deletion_reason: reason,
                  backup_data: appointment,
               },
            ]);

         if (insertError) throw insertError;

         // Then delete the appointment
         const { error: deleteError } = await supabase
            .from("appointments")
            .delete()
            .eq("id", id);

         if (deleteError) throw deleteError;

         return { error: null };
      } catch (error) {
         return { error: handleSupabaseError(error) };
      }
   },

   /**
    * Get today's appointments
    */
   async getTodaysAppointments() {
      const today = new Date().toISOString().split("T")[0];
      return this.getAppointments({ date: today });
   },

   /**
    * Get upcoming appointments for a patient
    */
   async getUpcomingAppointments(patientId, limit = 5) {
      try {
         const today = new Date().toISOString().split("T")[0];

         const { data, error } = await supabase
            .from("appointments")
            .select(
               `
          *,
          providers (name, specialty),
          locations (location_name)
        `
            )
            .eq("patient_id", patientId)
            .gte("appointment_date", today)
            .in("status", ["Scheduled", "Confirmed"])
            .order("appointment_date", { ascending: true })
            .order("appointment_time", { ascending: true })
            .limit(limit);

         if (error) throw error;

         return { data: data || [], error: null };
      } catch (error) {
         return { data: [], error: handleSupabaseError(error) };
      }
   },

   /**
    * Check for appointment conflicts
    */
   async checkAppointmentConflicts(providerId, date, time, excludeId = null) {
      try {
         let query = supabase
            .from("appointments")
            .select("id, appointment_time, duration_minutes")
            .eq("provider_id", providerId)
            .eq("appointment_date", date)
            .in("status", ["Scheduled", "Confirmed", "In Progress"]);

         if (excludeId) {
            query = query.neq("id", excludeId);
         }

         const { data, error } = await query;

         if (error) throw error;

         // Check for time conflicts
         const appointmentTime = new Date(`1970-01-01T${time}:00`);
         const conflicts = data.filter((apt) => {
            const existingTime = new Date(`1970-01-01T${apt.appointment_time}`);
            const existingEndTime = new Date(
               existingTime.getTime() + (apt.duration_minutes || 30) * 60000
            );
            const newEndTime = new Date(appointmentTime.getTime() + 30 * 60000); // Assuming 30 min default

            return (
               appointmentTime < existingEndTime && newEndTime > existingTime
            );
         });

         return { data: conflicts, error: null };
      } catch (error) {
         return { data: [], error: handleSupabaseError(error) };
      }
   },

   /**
    * Get appointment statistics
    */
   async getAppointmentStats(dateRange = {}) {
      try {
         const today = new Date().toISOString().split("T")[0];

         // Today's appointments
         const { count: todayCount, error: todayError } = await supabase
            .from("appointments")
            .select("*", { count: "exact", head: true })
            .eq("appointment_date", today)
            .neq("status", "Cancelled");

         if (todayError) throw todayError;

         // This week's completed appointments
         const startOfWeek = new Date();
         startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
         const endOfWeek = new Date(startOfWeek);
         endOfWeek.setDate(endOfWeek.getDate() + 6);

         const { count: weeklyCount, error: weeklyError } = await supabase
            .from("appointments")
            .select("*", { count: "exact", head: true })
            .gte("appointment_date", startOfWeek.toISOString().split("T")[0])
            .lte("appointment_date", endOfWeek.toISOString().split("T")[0])
            .eq("status", "Completed");

         if (weeklyError) throw weeklyError;

         // No-show rate
         const { count: totalScheduled, error: scheduledError } = await supabase
            .from("appointments")
            .select("*", { count: "exact", head: true })
            .gte("appointment_date", startOfWeek.toISOString().split("T")[0])
            .lte("appointment_date", endOfWeek.toISOString().split("T")[0])
            .in("status", ["Completed", "No Show"]);

         if (scheduledError) throw scheduledError;

         const { count: noShowCount, error: noShowError } = await supabase
            .from("appointments")
            .select("*", { count: "exact", head: true })
            .gte("appointment_date", startOfWeek.toISOString().split("T")[0])
            .lte("appointment_date", endOfWeek.toISOString().split("T")[0])
            .eq("status", "No Show");

         if (noShowError) throw noShowError;

         const noShowRate =
            totalScheduled > 0 ? (noShowCount / totalScheduled) * 100 : 0;

         return {
            data: {
               todayAppointments: todayCount || 0,
               weeklyCompleted: weeklyCount || 0,
               noShowRate: Math.round(noShowRate * 100) / 100,
            },
            error: null,
         };
      } catch (error) {
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Add procedures to appointment
    */
   async addAppointmentProcedures(appointmentId, procedures) {
      try {
         const procedureData = procedures.map((proc) => ({
            appointment_id: appointmentId,
            procedure_id: proc.procedure_id,
            quantity: proc.quantity || 1,
            amount: proc.amount,
            notes: proc.notes || null,
         }));

         const { data, error } = await supabase
            .from("appointment_procedures")
            .insert(procedureData).select(`
          *,
          procedures (*)
        `);

         if (error) throw error;

         return { data, error: null };
      } catch (error) {
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Add diagnoses to appointment
    */
   async addAppointmentDiagnoses(appointmentId, diagnoses) {
      try {
         const diagnosisData = diagnoses.map((diag) => ({
            appointment_id: appointmentId,
            diagnosis_id: diag.diagnosis_id,
            is_primary: diag.is_primary || false,
            notes: diag.notes || null,
         }));

         const { data, error } = await supabase
            .from("appointment_diagnoses")
            .insert(diagnosisData).select(`
          *,
          diagnosis_codes (*)
        `);

         if (error) throw error;

         return { data, error: null };
      } catch (error) {
         return { data: null, error: handleSupabaseError(error) };
      }
   },
};
