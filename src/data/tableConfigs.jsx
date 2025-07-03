import {
   FaUserMd,
   FaCode,
   FaStethoscope,
   FaShieldAlt,
   FaMapMarkerAlt,
   FaClipboardList,
} from "react-icons/fa";
import { Trash2 } from "lucide-react";
import { masterDataService } from "@/services/masterDataService";

// Common form field options
export const yesNoOptions = [
   { value: true, label: "Yes" },
   { value: false, label: "No" },
];

export const stateOptions = [
   { value: "NY", label: "New York" },
   { value: "CA", label: "California" },
   { value: "IL", label: "Illinois" },
   { value: "TX", label: "Texas" },
   { value: "FL", label: "Florida" },
];

export const specialtyOptions = [
   { value: "Orthopedics", label: "Orthopedics" },
   { value: "Cardiology", label: "Cardiology" },
   { value: "Neurology", label: "Neurology" },
   { value: "Gastroenterology", label: "Gastroenterology" },
   { value: "General Surgery", label: "General Surgery" },
   { value: "Anesthesiology", label: "Anesthesiology" },
   { value: "Radiology", label: "Radiology" },
   { value: "Emergency Medicine", label: "Emergency Medicine" },
];

export const diagnosisTypeOptions = [
   { value: "Primary", label: "Primary" },
   { value: "Secondary", label: "Secondary" },
   { value: "Tertiary", label: "Tertiary" },
];

export const statusOptions = [
   { value: "Active", label: "Active" },
   { value: "Inactive", label: "Inactive" },
   { value: "Pending", label: "Pending" },
];

// Dynamic options loaders
export const getLocationOptions = async () => {
   try {
      const { data: locations, error } = await masterDataService.getLocations();
      if (error) {
         console.error("Error fetching locations:", error);
         return [];
      }
      return locations.map((location) => ({
         value: location.id,
         label: location.location_name,
      }));
   } catch (error) {
      console.error("Error loading location options:", error);
      return [];
   }
};

// Table configurations
export const tableConfigs = {
   provider: {
      title: "Provider Management",
      subtitle: "Manage healthcare providers and their credentials",
      icon: FaUserMd,
      gradientColors: "bg-primary-gradient",
      backgroundColor: "",
      searchPlaceholder: "Search providers...",
      emptyMessage: "No provider records found",
      columns: [
         {
            header: "Provider Name",
            accessorKey: "name",
            cell: ({ row }) => (
               <div className='font-semibold text-primary-700'>
                  {row.getValue("name")}
               </div>
            ),
         },
         {
            header: "Location",
            accessorKey: "locations.location_name",
            cell: ({ row }) => {
               const locations = row.original.locations;
               return (
                  <span className='px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800'>
                     {locations ? locations.location_name : "N/A"}
                  </span>
               );
            },
         },
         {
            header: "City, State",
            accessorKey: "city",
            cell: ({ row }) => (
               <div className='text-sm text-gray-600'>
                  {row.getValue("city") || "N/A"}, {row.original.state || "N/A"}
               </div>
            ),
         },
         {
            header: "Phone",
            accessorKey: "phone",
            cell: ({ row }) => (
               <div className='font-medium text-blue-600'>
                  {row.getValue("phone") || "N/A"}
               </div>
            ),
         },
         {
            header: "NPI",
            accessorKey: "npi",
            cell: ({ row }) => (
               <div className='font-mono text-sm text-gray-700'>
                  {row.getValue("npi") || "N/A"}
               </div>
            ),
         },
         {
            header: "State License",
            accessorKey: "state_license",
            cell: ({ row }) => (
               <div className='font-mono text-sm text-gray-700'>
                  {row.getValue("state_license") || "N/A"}
               </div>
            ),
         },
         {
            header: "Specialty",
            accessorKey: "specialty",
            cell: ({ row }) => (
               <div className='font-medium text-primary-600'>
                  {row.getValue("specialty") || "N/A"}
               </div>
            ),
         },
      ],
      formFields: [
         { key: "name", label: "Provider Name", type: "text" },
         {
            key: "location_id",
            label: "Location",
            type: "select",
            loadOptions: getLocationOptions,
            placeholder: "Select a location...",
         },
         { key: "address", label: "Address", type: "text", fullWidth: true },
         { key: "city", label: "City", type: "text" },
         {
            key: "state",
            label: "State",
            type: "select",
            options: stateOptions,
         },
         { key: "zip", label: "ZIP Code", type: "text" },
         { key: "phone", label: "Phone", type: "text" },
         { key: "email", label: "Email", type: "text" },
         { key: "npi", label: "NPI", type: "text", className: "font-mono" },
         { key: "taxonomy_code", label: "Taxonomy Code", type: "text" },
         {
            key: "state_license",
            label: "State License",
            type: "text",
            className: "font-mono",
         },
         {
            key: "specialty",
            label: "Specialty",
            type: "select",
            options: specialtyOptions,
         },
      ],
   },

   modifier: {
      title: "Modifier Management",
      subtitle: "Manage medical procedure modifiers and codes",
      icon: FaCode,
      gradientColors: "bg-primary-gradient",
      backgroundColor: "",
      searchPlaceholder: "Search modifiers...",
      emptyMessage: "No modifier records found",
      columns: [
         {
            header: "Modifier Code",
            accessorKey: "modifier_code",
            cell: ({ row }) => (
               <div className='font-mono font-semibold text-secondary-700 bg-secondary-50 px-2 py-1 rounded'>
                  {row.getValue("modifier_code")}
               </div>
            ),
         },
         {
            header: "Modifier Name",
            accessorKey: "modifier_name",
            cell: ({ row }) => (
               <div className='font-medium text-gray-900'>
                  {row.getValue("modifier_name")}
               </div>
            ),
         },
         {
            header: "Specialty",
            accessorKey: "specialty",
            cell: ({ row }) => (
               <span className='px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                  {row.getValue("specialty")}
               </span>
            ),
         },
         {
            header: "Description",
            accessorKey: "description",
            cell: ({ row }) => (
               <div
                  className='text-sm text-gray-600 max-w-xs truncate'
                  title={row.getValue("description")}
               >
                  {row.getValue("description")}
               </div>
            ),
         },
         {
            header: "Default",
            accessorKey: "is_default",
            cell: ({ row }) => {
               const isDefault = row.getValue("is_default");
               const displayValue = isDefault === true ? "Yes" : "No";
               return (
                  <span
                     className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isDefault
                           ? "bg-warning-100 text-warning-800"
                           : "bg-gray-100 text-gray-600"
                     }`}
                  >
                     {displayValue}
                  </span>
               );
            },
         },
         {
            header: "Active",
            accessorKey: "is_active",
            cell: ({ row }) => {
               const isActive = row.getValue("is_active");
               const displayValue = isActive === true ? "Yes" : "No";
               return (
                  <span
                     className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isActive
                           ? "bg-green-100 text-green-800"
                           : "bg-red-100 text-red-800"
                     }`}
                  >
                     {displayValue}
                  </span>
               );
            },
         },
      ],
      formFields: [
         {
            key: "modifier_code",
            label: "Modifier Code",
            type: "text",
            placeholder: "Enter modifier code (e.g., 22, 24, 25)",
            className: "font-mono",
         },
         { key: "modifier_name", label: "Modifier Name", type: "text" },
         {
            key: "specialty",
            label: "Specialty",
            type: "select",
            options: specialtyOptions,
         },
         {
            key: "description",
            label: "Description",
            type: "text",
            fullWidth: true,
         },
         {
            key: "is_default",
            label: "Is Default",
            type: "select",
            options: yesNoOptions,
            defaultValue: "No",
         },
         {
            key: "is_active",
            label: "Is Active",
            type: "select",
            options: yesNoOptions,
            defaultValue: "Yes",
         },
      ],
   },

   procedure: {
      title: "Procedure Management",
      subtitle: "Manage medical procedures and billing codes",
      icon: FaStethoscope,
      gradientColors: "bg-primary-gradient",
      backgroundColor:
         "bg-gradient-to-br from-orange-50 via-red-50 to-pink-100",
      searchPlaceholder: "Search procedures...",
      emptyMessage: "No procedure records found",
      columns: [
         {
            header: "CPT Code",
            accessorKey: "procedure_code",
            cell: ({ row }) => (
               <div className='font-mono font-semibold text-accent-700 bg-accent-50 px-2 py-1 rounded'>
                  {row.getValue("procedure_code")}
               </div>
            ),
         },
         {
            header: "Description",
            accessorKey: "description",
            cell: ({ row }) => (
               <div className='font-medium text-gray-900'>
                  {row.getValue("description")}
               </div>
            ),
         },
         {
            header: "Fee",
            accessorKey: "amount",
            cell: ({ row }) => (
               <div className='font-semibold text-green-600'>
                  ${parseFloat(row.getValue("amount") || 0).toFixed(2)}
               </div>
            ),
         },
         {
            header: "Specialty",
            accessorKey: "specialty",
            cell: ({ row }) => (
               <span className='px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800'>
                  {row.getValue("specialty")}
               </span>
            ),
         },
      ],
      formFields: [
         {
            key: "procedure_code",
            label: "CPT Code",
            type: "text",
            className: "font-mono",
         },
         {
            key: "description",
            label: "Description",
            type: "text",
            fullWidth: true,
         },
         {
            key: "amount",
            label: "Fee Amount",
            type: "text",
            placeholder: "Enter fee amount",
         },
         {
            key: "specialty",
            label: "Specialty",
            type: "select",
            options: specialtyOptions,
         },
         {
            key: "category",
            label: "Category",
            type: "text",
         },
         {
            key: "is_preferred",
            label: "Is Preferred",
            type: "select",
            options: yesNoOptions,
            defaultValue: "Yes",
         },
      ],
   },

   diagnosis: {
      title: "Diagnosis Management",
      subtitle: "Manage medical diagnoses and ICD codes",
      icon: FaClipboardList,
      gradientColors: "bg-primary-gradient",
      backgroundColor:
         "bg-gradient-to-br from-purple-50 via-pink-50 to-rose-100",
      searchPlaceholder: "Search diagnoses...",
      emptyMessage: "No diagnosis records found",
      columns: [
         {
            header: "ICD Code",
            accessorKey: "diagnosis_code",
            cell: ({ row }) => (
               <div className='font-mono font-semibold text-primary-700 bg-primary-50 px-2 py-1 rounded'>
                  {row.getValue("diagnosis_code")}
               </div>
            ),
         },
         {
            header: "Description",
            accessorKey: "description",
            cell: ({ row }) => (
               <div className='font-medium text-gray-900'>
                  {row.getValue("description")}
               </div>
            ),
         },
         {
            header: "Type",
            accessorKey: "diagnosis_type",
            cell: ({ row }) => (
               <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                     row.getValue("diagnosis_type") === "Primary"
                        ? "bg-primary-100 text-primary-800"
                        : row.getValue("diagnosis_type") === "Secondary"
                        ? "bg-pink-100 text-pink-800"
                        : "bg-gray-100 text-gray-700"
                  }`}
               >
                  {row.getValue("diagnosis_type")}
               </span>
            ),
         },
         {
            header: "Category",
            accessorKey: "category",
            cell: ({ row }) => (
               <span className='px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800'>
                  {row.getValue("category")}
               </span>
            ),
         },
         {
            header: "Status",
            accessorKey: "is_active",
            cell: ({ row }) => {
               const isActive = row.getValue("is_active");
               const displayValue = isActive === true ? "Active" : "Inactive";
               return (
                  <span
                     className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isActive
                           ? "bg-green-100 text-green-800"
                           : "bg-red-100 text-red-800"
                     }`}
                  >
                     {displayValue}
                  </span>
               );
            },
         },
         {
            header: "Preferred",
            accessorKey: "is_preferred",
            cell: ({ row }) => {
               const isPreferred = row.getValue("is_preferred");
               const displayValue = isPreferred === true ? "Yes" : "No";
               return (
                  <span
                     className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isPreferred
                           ? "bg-warning-100 text-warning-800"
                           : "bg-gray-100 text-gray-600"
                     }`}
                  >
                     {displayValue}
                  </span>
               );
            },
         },
      ],
      formFields: [
         {
            key: "diagnosis_code",
            label: "ICD Code",
            type: "text",
            className: "font-mono",
         },
         {
            key: "description",
            label: "Description",
            type: "text",
            fullWidth: true,
         },
         {
            key: "diagnosis_type",
            label: "Diagnosis Type",
            type: "select",
            options: diagnosisTypeOptions,
            defaultValue: "Primary",
         },
         {
            key: "category",
            label: "Category",
            type: "text",
         },
         {
            key: "is_preferred",
            label: "Is Preferred",
            type: "select",
            options: yesNoOptions,
            defaultValue: "Yes",
         },
         {
            key: "icd_version",
            label: "ICD Version",
            type: "text",
            defaultValue: "ICD-10",
         },
         {
            key: "is_active",
            label: "Is Active",
            type: "select",
            options: yesNoOptions,
            defaultValue: "Yes",
         },
      ],
   },

   insurance: {
      title: "Insurance Management",
      subtitle: "Manage insurance providers and coverage details",
      icon: FaShieldAlt,
      gradientColors: "bg-primary-gradient",
      backgroundColor: "",
      searchPlaceholder: "Search insurance providers...",
      emptyMessage: "No insurance records found",
      columns: [
         {
            header: "Insurance Name",
            accessorKey: "name",
            cell: ({ row }) => (
               <div className='font-semibold text-primary-700'>
                  {row.getValue("name")}
               </div>
            ),
         },
         {
            header: "Address",
            accessorKey: "address",
            cell: ({ row }) => (
               <div className='text-sm text-gray-600'>
                  {row.getValue("address")}
               </div>
            ),
         },
         {
            header: "City, State",
            accessorKey: "city",
            cell: ({ row }) => (
               <div className='text-sm text-gray-600'>
                  {row.getValue("city")}, {row.original.state}
               </div>
            ),
         },
         {
            header: "Phone",
            accessorKey: "phone",
            cell: ({ row }) => (
               <div className='font-medium text-blue-600'>
                  {row.getValue("phone")}
               </div>
            ),
         },
         {
            header: "Email",
            accessorKey: "email",
            cell: ({ row }) => (
               <div className='text-sm text-gray-600'>
                  {row.getValue("email")}
               </div>
            ),
         },
      ],
      formFields: [
         { key: "name", label: "Insurance Name", type: "text" },
         { key: "address", label: "Address", type: "text", fullWidth: true },
         { key: "city", label: "City", type: "text" },
         {
            key: "state",
            label: "State",
            type: "select",
            options: stateOptions,
         },
         { key: "phone", label: "Phone", type: "text" },
         { key: "email", label: "Email", type: "text" },
         { key: "insured_id", label: "Insured ID", type: "text" },
      ],
   },

   location: {
      title: "Location Management",
      subtitle: "Manage medical facility locations and details",
      icon: FaMapMarkerAlt,
      gradientColors: "bg-primary-gradient",
      backgroundColor:
         "bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50",
      searchPlaceholder: "Search locations...",
      emptyMessage: "No locations found",
      columns: [
         {
            header: "Location Name",
            accessorKey: "location_name",
            cell: ({ row }) => (
               <div className='font-medium text-gray-900 flex items-center'>
                  <FaMapMarkerAlt className='h-4 w-4 text-red-500 mr-2' />
                  {row.original.location_name}
               </div>
            ),
         },
         {
            header: "NPI",
            accessorKey: "npi",
            cell: ({ row }) => (
               <div className='text-sm font-mono bg-primary-100 px-2 py-1 rounded'>
                  {row.original.npi}
               </div>
            ),
         },
         {
            header: "CLIA #",
            accessorKey: "clia_number",
            cell: ({ row }) => (
               <div className='text-sm font-mono bg-green-100 px-2 py-1 rounded'>
                  {row.original.clia_number}
               </div>
            ),
         },
         {
            header: "Address",
            accessorKey: "address",
            cell: ({ row }) => (
               <div className='text-sm text-gray-600'>
                  {row.original.address}
               </div>
            ),
         },
         {
            header: "City, State",
            accessorKey: "city",
            cell: ({ row }) => (
               <div className='text-sm text-gray-600'>
                  {row.original.city}, {row.original.state}
               </div>
            ),
         },
         {
            header: "ZIP",
            accessorKey: "zip",
            cell: ({ row }) => (
               <div className='text-sm font-mono'>{row.original.zip}</div>
            ),
         },
      ],
      formFields: [
         { key: "location_name", label: "Location Name", type: "text" },
         { key: "npi", label: "NPI", type: "text", className: "font-mono" },
         {
            key: "clia_number",
            label: "CLIA Number",
            type: "text",
            className: "font-mono",
         },
         { key: "address", label: "Address", type: "text", fullWidth: true },
         { key: "city", label: "City", type: "text" },
         {
            key: "state",
            label: "State",
            type: "select",
            options: stateOptions,
         },
         { key: "zip", label: "ZIP Code", type: "text" },
      ],
   },

   deleteVisit: {
      title: "Delete Visit Management",
      subtitle: "Manage deleted visit records and permanent deletion",
      icon: Trash2,
      gradientColors: "bg-primary-gradient",
      backgroundColor: "",
      searchPlaceholder: "Search deleted visits...",
      emptyMessage: "No deleted visit records found",
      columns: [
         {
            header: "Case Number",
            accessorKey: "CaseNumber",
            cell: ({ row }) => (
               <div className='font-mono font-semibold text-red-700 bg-red-50 px-2 py-1 rounded'>
                  {row.getValue("CaseNumber")}
               </div>
            ),
         },
         {
            header: "Event Date",
            accessorKey: "EventDate",
            cell: ({ row }) => (
               <div className='font-medium text-gray-900'>
                  {new Date(row.getValue("EventDate")).toLocaleDateString()}
               </div>
            ),
         },
         {
            header: "Doctor Name",
            accessorKey: "DoctorName",
            cell: ({ row }) => (
               <div className='font-semibold text-gray-800'>
                  {row.getValue("DoctorName")}
               </div>
            ),
         },
         {
            header: "Speciality",
            accessorKey: "speciality",
            cell: ({ row }) => (
               <span className='px-2 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800'>
                  {row.getValue("speciality")}
               </span>
            ),
         },
         {
            header: "Event ID",
            accessorKey: "EventID",
            cell: ({ row }) => (
               <div className='font-mono text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded'>
                  {row.getValue("EventID")}
               </div>
            ),
         },
      ],
      formFields: [
         {
            key: "CaseNumber",
            label: "Case Number",
            type: "text",
            className: "font-mono",
            disabled: true,
         },
         {
            key: "EventDate",
            label: "Event Date",
            type: "date",
            disabled: true,
         },
         {
            key: "DoctorName",
            label: "Doctor Name",
            type: "text",
            disabled: true,
         },
         {
            key: "speciality",
            label: "Speciality",
            type: "text",
            disabled: true,
         },
         {
            key: "EventID",
            label: "Event ID",
            type: "text",
            className: "font-mono",
            disabled: true,
         },
      ],
   },
};
