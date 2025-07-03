/**
 * Static fallback data for tables when API calls fail or return empty results
 * This is a copy of the data in /Docs/api-response.js but made available directly to avoid import issues
 */

export const fallbackData = {
   // Modifier data
   modifier: [
      {
         id: "b8d2123b-295e-4ca1-a24f-19c848bd74b9",
         specialty: "General Medicine",
         modifier_name: "Bilateral Procedure",
         modifier_code: "50",
         description: "Bilateral procedure",
         is_default: false,
         is_active: true,
         created_at: "2025-07-02T03:08:03.964859+00:00",
         updated_at: "2025-07-02T03:08:03.964859+00:00",
         modified_by: null,
         created_by: null,
      },
      {
         id: "4608e924-2a5d-4f43-ade3-78cb70b514b8",
         specialty: "General Medicine",
         modifier_name: "Distinct Procedural Service",
         modifier_code: "59",
         description: "Distinct procedural service",
         is_default: false,
         is_active: true,
         created_at: "2025-07-02T03:08:03.964859+00:00",
         updated_at: "2025-07-02T03:08:03.964859+00:00",
         modified_by: null,
         created_by: null,
      },
      {
         id: "081c9416-fe56-42da-91c8-3b7e1c1cacb9",
         specialty: "Surgery",
         modifier_name: "Multiple Procedures",
         modifier_code: "51",
         description: "Multiple procedures",
         is_default: false,
         is_active: true,
         created_at: "2025-07-02T03:08:03.964859+00:00",
         updated_at: "2025-07-02T03:08:03.964859+00:00",
         modified_by: null,
         created_by: null,
      },
      {
         id: "f6709582-4335-4720-9774-d81d173ebf9c",
         specialty: "Radiology",
         modifier_name: "Professional Component",
         modifier_code: "26",
         description: "Professional component",
         is_default: false,
         is_active: true,
         created_at: "2025-07-02T03:08:03.964859+00:00",
         updated_at: "2025-07-02T03:08:03.964859+00:00",
         modified_by: null,
         created_by: null,
      },
      {
         id: "8842745d-cece-41ac-a4d4-6b791dd60235",
         specialty: "Laboratory",
         modifier_name: "Reference Laboratory",
         modifier_code: "90",
         description: "Reference (outside) laboratory",
         is_default: false,
         is_active: true,
         created_at: "2025-07-02T03:08:03.964859+00:00",
         updated_at: "2025-07-02T03:08:03.964859+00:00",
         modified_by: null,
         created_by: null,
      },
   ],

   // Add other static data as needed
   // locations: [...],
   // diagnosis: [...],
   // etc.
};
