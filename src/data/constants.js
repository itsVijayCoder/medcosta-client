// Application constants
export const ROUTES = {
   DASHBOARD: "/",
   LOGIN: "/login",
   PATIENT_REGISTRATION: "/dataentry/patient-entry",
   NEW_APPOINTMENT: "/appointments/new",
   DATA_ENTRY: {
      INSURANCE: "/dataentry/insurance",
      LOCATION: "/dataentry/location",
      DIAGNOSIS: "/dataentry/diagnosis-code",
      PROCEDURE: "/dataentry/procedure-master",
      PROVIDER: "/dataentry/provider-master",
      MODIFIER: "/dataentry/modifier-master",
      DELETE_VISIT: "/dataentry/delete-visit",
   },
};

export const API_ENDPOINTS = {
   BASE_URL: "http://localhost/medcosta",
   AUTH: {
      LOGIN: "/index.php/login",
   },
   PATIENT: {
      SAVE: "/index.php/save_patient",
   },
   APPOINTMENT: {
      GET_ALL: "/newappointment/get_all_appointments",
      ADD: "/newappointment/add_appointment",
      GET_VISIT_NUMBER: "/newappointment/get_visit_number",
      GET_STATES: "/newappointment/get_states",
   },
   DATA_ENTRY: {
      PROVIDER: {
         GET: "/index.php/provider/get_provider_data",
         ADD: "/index.php/provider/add_provider",
         UPDATE: "/index.php/provider/update_provider",
         DELETE: "/index.php/provider/delete_provider",
      },
      MODIFIER: {
         GET: "/index.php/modifier/get_modifier_data",
         ADD: "/index.php/modifier/add_modifier",
         UPDATE: "/index.php/modifier/update_modifier",
         DELETE: "/index.php/modifier/delete_modifier",
      },
      PROCEDURE: {
         GET: "/index.php/Procedure/get_procedure_data",
      },
      DELETE_VISIT: {
         GET: "/index.php/deletevisit/get_deletevisit_data",
         DELETE: "/index.php/deletevisit/delete_permanently",
      },
   },
};

export const PATIENT_STATUS = {
   STABLE: "Stable",
   CRITICAL: "Critical",
   RECOVERING: "Recovering",
   DISCHARGED: "Discharged",
};

export const FORM_VALIDATION = {
   REQUIRED_FIELDS: {
      PATIENT: ["first_name", "last_name", "dob", "ssn"],
      APPOINTMENT: ["firstName", "lastName", "dateOfBirth"],
   },
};

export const UI_CONSTANTS = {
   ITEMS_PER_PAGE: 10,
   DEBOUNCE_DELAY: 300,
   CHART_COLORS: {
      PRIMARY: "#2563eb",
      SUCCESS: "#16a34a",
      DANGER: "#dc2626",
      WARNING: "#f59e0b",
   },
};
