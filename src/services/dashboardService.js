// Dashboard analytics service for Supabase
import { supabase, handleSupabaseError } from "../lib/supabaseClient";

export const dashboardService = {
   /**
    * Get main dashboard statistics
    */
   async getDashboardStats(dateRange = {}) {
      try {
         const today = new Date().toISOString().split("T")[0];
         const startOfWeek = new Date();
         startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
         const endOfWeek = new Date(startOfWeek);
         endOfWeek.setDate(endOfWeek.getDate() + 6);

         // Today's appointments
         const { count: todayAppointments, error: todayError } = await supabase
            .from("appointments")
            .select("*", { count: "exact", head: true })
            .eq("appointment_date", today)
            .neq("status", "Cancelled");

         if (todayError) throw todayError;

         // Total active patients
         const { count: totalPatients, error: patientsError } = await supabase
            .from("patients")
            .select("*", { count: "exact", head: true })
            .eq("is_active", true);

         if (patientsError) throw patientsError;

         // This week's completed appointments
         const { count: weeklyCompletedAppointments, error: weeklyError } =
            await supabase
               .from("appointments")
               .select("*", { count: "exact", head: true })
               .gte("appointment_date", startOfWeek.toISOString().split("T")[0])
               .lte("appointment_date", endOfWeek.toISOString().split("T")[0])
               .eq("status", "Completed");

         if (weeklyError) throw weeklyError;

         // Total active providers
         const { count: totalProviders, error: providersError } = await supabase
            .from("providers")
            .select("*", { count: "exact", head: true })
            .eq("is_active", true);

         if (providersError) throw providersError;

         return {
            data: {
               todayAppointments: todayAppointments || 0,
               totalPatients: totalPatients || 0,
               weeklyCompletedAppointments: weeklyCompletedAppointments || 0,
               totalProviders: totalProviders || 0,
            },
            error: null,
         };
      } catch (error) {
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Get recent appointments for dashboard
    */
   async getRecentAppointments(limit = 10) {
      try {
         const { data, error } = await supabase
            .from("appointments")
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
            .order("created_at", { ascending: false })
            .limit(limit);

         if (error) throw error;

         return { data: data || [], error: null };
      } catch (error) {
         return { data: [], error: handleSupabaseError(error) };
      }
   },

   /**
    * Get appointment trends for the last N days
    */
   async getAppointmentTrends(days = 30) {
      try {
         const endDate = new Date();
         const startDate = new Date();
         startDate.setDate(endDate.getDate() - days);

         const { data, error } = await supabase
            .from("appointments")
            .select("appointment_date, status")
            .gte("appointment_date", startDate.toISOString().split("T")[0])
            .lte("appointment_date", endDate.toISOString().split("T")[0])
            .order("appointment_date");

         if (error) throw error;

         // Group by date and count appointments
         const trends = {};
         data.forEach((appointment) => {
            const date = appointment.appointment_date;
            if (!trends[date]) {
               trends[date] = {
                  date,
                  total: 0,
                  completed: 0,
                  cancelled: 0,
                  noShow: 0,
                  scheduled: 0,
               };
            }
            trends[date].total++;

            switch (appointment.status) {
               case "Completed":
                  trends[date].completed++;
                  break;
               case "Cancelled":
                  trends[date].cancelled++;
                  break;
               case "No Show":
                  trends[date].noShow++;
                  break;
               case "Scheduled":
               case "Confirmed":
                  trends[date].scheduled++;
                  break;
            }
         });

         const trendsArray = Object.values(trends).sort(
            (a, b) => new Date(a.date) - new Date(b.date)
         );

         return { data: trendsArray, error: null };
      } catch (error) {
         return { data: [], error: handleSupabaseError(error) };
      }
   },

   /**
    * Get provider performance metrics
    */
   async getProviderMetrics(dateRange = {}) {
      try {
         const defaultStartDate = new Date();
         defaultStartDate.setDate(defaultStartDate.getDate() - 30);

         const startDate =
            dateRange.startDate || defaultStartDate.toISOString().split("T")[0];
         const endDate =
            dateRange.endDate || new Date().toISOString().split("T")[0];

         const { data, error } = await supabase
            .from("appointments")
            .select(
               `
          provider_id,
          status,
          providers (
            name,
            specialty
          )
        `
            )
            .gte("appointment_date", startDate)
            .lte("appointment_date", endDate);

         if (error) throw error;

         // Group by provider and calculate metrics
         const providerMetrics = {};
         data.forEach((appointment) => {
            const providerId = appointment.provider_id;
            if (!providerMetrics[providerId]) {
               providerMetrics[providerId] = {
                  providerId,
                  providerName: appointment.providers?.name || "Unknown",
                  specialty: appointment.providers?.specialty || "N/A",
                  totalAppointments: 0,
                  completedAppointments: 0,
                  cancelledAppointments: 0,
                  noShowAppointments: 0,
                  completionRate: 0,
               };
            }

            const metrics = providerMetrics[providerId];
            metrics.totalAppointments++;

            switch (appointment.status) {
               case "Completed":
                  metrics.completedAppointments++;
                  break;
               case "Cancelled":
                  metrics.cancelledAppointments++;
                  break;
               case "No Show":
                  metrics.noShowAppointments++;
                  break;
            }

            metrics.completionRate =
               metrics.totalAppointments > 0
                  ? (metrics.completedAppointments /
                       metrics.totalAppointments) *
                    100
                  : 0;
         });

         const metricsArray = Object.values(providerMetrics).sort(
            (a, b) => b.totalAppointments - a.totalAppointments
         );

         return { data: metricsArray, error: null };
      } catch (error) {
         return { data: [], error: handleSupabaseError(error) };
      }
   },

   /**
    * Get patient demographics
    */
   async getPatientDemographics() {
      try {
         const { data: patients, error } = await supabase
            .from("patients")
            .select("gender, date_of_birth, case_type, state")
            .eq("is_active", true);

         if (error) throw error;

         // Calculate demographics
         const demographics = {
            genderDistribution: {},
            ageGroups: {
               "0-18": 0,
               "19-30": 0,
               "31-50": 0,
               "51-70": 0,
               "70+": 0,
            },
            caseTypeDistribution: {},
            stateDistribution: {},
         };

         const currentYear = new Date().getFullYear();

         patients.forEach((patient) => {
            // Gender distribution
            const gender = patient.gender || "Unknown";
            demographics.genderDistribution[gender] =
               (demographics.genderDistribution[gender] || 0) + 1;

            // Age groups
            if (patient.date_of_birth) {
               const birthYear = new Date(patient.date_of_birth).getFullYear();
               const age = currentYear - birthYear;

               if (age <= 18) demographics.ageGroups["0-18"]++;
               else if (age <= 30) demographics.ageGroups["19-30"]++;
               else if (age <= 50) demographics.ageGroups["31-50"]++;
               else if (age <= 70) demographics.ageGroups["51-70"]++;
               else demographics.ageGroups["70+"]++;
            }

            // Case type distribution
            const caseType = patient.case_type || "Unknown";
            demographics.caseTypeDistribution[caseType] =
               (demographics.caseTypeDistribution[caseType] || 0) + 1;

            // State distribution
            const state = patient.state || "Unknown";
            demographics.stateDistribution[state] =
               (demographics.stateDistribution[state] || 0) + 1;
         });

         return { data: demographics, error: null };
      } catch (error) {
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Get revenue metrics (if procedure amounts are tracked)
    */
   async getRevenueMetrics(dateRange = {}) {
      try {
         const defaultStartDate = new Date();
         defaultStartDate.setDate(defaultStartDate.getDate() - 30);

         const startDate =
            dateRange.startDate || defaultStartDate.toISOString().split("T")[0];
         const endDate =
            dateRange.endDate || new Date().toISOString().split("T")[0];

         const { data, error } = await supabase
            .from("appointment_procedures")
            .select(
               `
          quantity,
          amount,
          appointments!inner (
            appointment_date,
            status
          )
        `
            )
            .gte("appointments.appointment_date", startDate)
            .lte("appointments.appointment_date", endDate)
            .eq("appointments.status", "Completed");

         if (error) throw error;

         let totalRevenue = 0;
         let totalProcedures = 0;

         data.forEach((procedure) => {
            const revenue = (procedure.quantity || 1) * (procedure.amount || 0);
            totalRevenue += revenue;
            totalProcedures += procedure.quantity || 1;
         });

         return {
            data: {
               totalRevenue,
               totalProcedures,
               averageRevenuePerProcedure:
                  totalProcedures > 0 ? totalRevenue / totalProcedures : 0,
            },
            error: null,
         };
      } catch (error) {
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Get top diagnosis codes
    */
   async getTopDiagnosisCodes(limit = 10, dateRange = {}) {
      try {
         const defaultStartDate = new Date();
         defaultStartDate.setDate(defaultStartDate.getDate() - 30);

         const startDate =
            dateRange.startDate || defaultStartDate.toISOString().split("T")[0];
         const endDate =
            dateRange.endDate || new Date().toISOString().split("T")[0];

         const { data, error } = await supabase
            .from("appointment_diagnoses")
            .select(
               `
          diagnosis_codes (
            diagnosis_code,
            description
          ),
          appointments!inner (
            appointment_date
          )
        `
            )
            .gte("appointments.appointment_date", startDate)
            .lte("appointments.appointment_date", endDate);

         if (error) throw error;

         // Count diagnosis usage
         const diagnosisCounts = {};
         data.forEach((item) => {
            const diagnosis = item.diagnosis_codes;
            if (diagnosis) {
               const key = diagnosis.diagnosis_code;
               if (!diagnosisCounts[key]) {
                  diagnosisCounts[key] = {
                     code: diagnosis.diagnosis_code,
                     description: diagnosis.description,
                     count: 0,
                  };
               }
               diagnosisCounts[key].count++;
            }
         });

         const topDiagnoses = Object.values(diagnosisCounts)
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);

         return { data: topDiagnoses, error: null };
      } catch (error) {
         return { data: [], error: handleSupabaseError(error) };
      }
   },

   /**
    * Get top procedures
    */
   async getTopProcedures(limit = 10, dateRange = {}) {
      try {
         const defaultStartDate = new Date();
         defaultStartDate.setDate(defaultStartDate.getDate() - 30);

         const startDate =
            dateRange.startDate || defaultStartDate.toISOString().split("T")[0];
         const endDate =
            dateRange.endDate || new Date().toISOString().split("T")[0];

         const { data, error } = await supabase
            .from("appointment_procedures")
            .select(
               `
          quantity,
          amount,
          procedures (
            procedure_code,
            description
          ),
          appointments!inner (
            appointment_date
          )
        `
            )
            .gte("appointments.appointment_date", startDate)
            .lte("appointments.appointment_date", endDate);

         if (error) throw error;

         // Count procedure usage
         const procedureCounts = {};
         data.forEach((item) => {
            const procedure = item.procedures;
            if (procedure) {
               const key = procedure.procedure_code;
               if (!procedureCounts[key]) {
                  procedureCounts[key] = {
                     code: procedure.procedure_code,
                     description: procedure.description,
                     count: 0,
                     totalRevenue: 0,
                  };
               }
               procedureCounts[key].count += item.quantity || 1;
               procedureCounts[key].totalRevenue +=
                  (item.quantity || 1) * (item.amount || 0);
            }
         });

         const topProcedures = Object.values(procedureCounts)
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);

         return { data: topProcedures, error: null };
      } catch (error) {
         return { data: [], error: handleSupabaseError(error) };
      }
   },

   /**
    * Get appointment no-show rate
    */
   async getNoShowRate(dateRange = {}) {
      try {
         const defaultStartDate = new Date();
         defaultStartDate.setDate(defaultStartDate.getDate() - 30);

         const startDate =
            dateRange.startDate || defaultStartDate.toISOString().split("T")[0];
         const endDate =
            dateRange.endDate || new Date().toISOString().split("T")[0];

         const { count: totalScheduled, error: totalError } = await supabase
            .from("appointments")
            .select("*", { count: "exact", head: true })
            .gte("appointment_date", startDate)
            .lte("appointment_date", endDate)
            .in("status", ["Completed", "No Show"]);

         if (totalError) throw totalError;

         const { count: noShows, error: noShowError } = await supabase
            .from("appointments")
            .select("*", { count: "exact", head: true })
            .gte("appointment_date", startDate)
            .lte("appointment_date", endDate)
            .eq("status", "No Show");

         if (noShowError) throw noShowError;

         const noShowRate =
            totalScheduled > 0 ? (noShows / totalScheduled) * 100 : 0;

         return {
            data: {
               totalScheduled: totalScheduled || 0,
               noShows: noShows || 0,
               noShowRate: Math.round(noShowRate * 100) / 100,
            },
            error: null,
         };
      } catch (error) {
         return { data: null, error: handleSupabaseError(error) };
      }
   },

   /**
    * Get comprehensive dashboard data
    */
   async getCompleteDashboardData(dateRange = {}) {
      try {
         const [
            statsResult,
            recentAppointmentsResult,
            trendsResult,
            providerMetricsResult,
            demographicsResult,
            noShowRateResult,
         ] = await Promise.all([
            this.getDashboardStats(dateRange),
            this.getRecentAppointments(5),
            this.getAppointmentTrends(7), // Last 7 days
            this.getProviderMetrics(dateRange),
            this.getPatientDemographics(),
            this.getNoShowRate(dateRange),
         ]);

         return {
            data: {
               stats: statsResult.data,
               recentAppointments: recentAppointmentsResult.data,
               trends: trendsResult.data,
               providerMetrics: providerMetricsResult.data,
               demographics: demographicsResult.data,
               noShowRate: noShowRateResult.data,
            },
            error: null,
         };
      } catch (error) {
         return { data: null, error: handleSupabaseError(error) };
      }
   },
};
