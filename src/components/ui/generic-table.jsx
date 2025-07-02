import React, { useState, useEffect } from "react";
import { ModernDataTable } from "@/components/ui/modern-data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { FaPlus } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { masterDataService } from "@/services/masterDataService";
import { yesNoOptions } from "@/data/tableConfigs";

const GenericTable = ({
   title,
   subtitle,
   icon: Icon,
   data: initialData,
   columns,
   formFields,
   gradientColors,
   backgroundColor,
   searchPlaceholder = "Search records...",
   emptyMessage = "No records found",
   modalWidth = "sm:max-w-[700px]",
   loading = false,
   onDelete: customOnDelete,
   showAddButton = true,
   showEditButton = true,
   deleteButtonText = "Delete",
   deleteButtonVariant = "outline",
   dataSource = "", // "locations", "insurance_companies", "providers", "diagnosis_codes", "procedures", "modifiers"
   onDataChange, // Callback when data changes (create, update, delete)
   refreshData, // Function to refresh data from the parent
}) => {
   console.log("GenericTable rendering with initialData:", initialData);
   console.log("GenericTable loading state:", loading);
   console.log("GenericTable emptyMessage:", emptyMessage);

   const [data, setData] = useState(initialData);
   const [selectedRows, setSelectedRows] = useState([]);
   const [addStatus, setAddStatus] = useState({ loading: false, error: null });
   const [updateStatus, setUpdateStatus] = useState({
      loading: false,
      error: null,
   });

   // Update data when initialData prop changes
   useEffect(() => {
      console.log("initialData changed:", initialData);
      setData(initialData);
   }, [initialData]);

   // Create initial form state from form fields
   const createInitialFormState = () => {
      const state = {};
      if (formFields && Array.isArray(formFields)) {
         formFields.forEach((field) => {
            state[field.key] = field.defaultValue || "";
         });
      }
      return state;
   };

   const [newRecord, setNewRecord] = useState(createInitialFormState());

   const handleNewRecordChange = (e, field) => {
      setNewRecord({ ...newRecord, [field]: e.target.value });
   };

   const handleAddRecord = async () => {
      if (!dataSource) {
         console.error("No data source specified for adding records");
         return;
      }

      try {
         setAddStatus({ loading: true, error: null });

         // Prepare the form data - don't include ID as Supabase will generate one
         // Handle boolean values properly for fields with Yes/No options
         const formData = { ...newRecord };

         // Convert boolean string values to actual booleans if needed
         formFields?.forEach((field) => {
            if (
               field.type === "select" &&
               field.options === yesNoOptions &&
               formData[field.key] !== undefined
            ) {
               if (
                  formData[field.key] === "true" ||
                  formData[field.key] === true
               ) {
                  formData[field.key] = true;
               } else if (
                  formData[field.key] === "false" ||
                  formData[field.key] === false
               ) {
                  formData[field.key] = false;
               }
            }
         });

         // Ensure is_active is true for new records
         formData.is_active = true;

         console.log(`Adding new ${dataSource} record:`, formData);

         let result;

         // Call the appropriate service method based on dataSource
         switch (dataSource) {
            case "locations":
               result = await masterDataService.createLocation(formData);
               break;
            case "insurance_companies":
               result = await masterDataService.createInsuranceCompany(
                  formData
               );
               break;
            case "providers":
               result = await masterDataService.createProvider(formData);
               break;
            case "diagnosis_codes":
               result = await masterDataService.createDiagnosisCode(formData);
               break;
            case "procedures":
               result = await masterDataService.createProcedure(formData);
               break;
            case "modifiers":
               result = await masterDataService.createModifier(formData);
               break;
            default:
               console.error(`Unknown data source: ${dataSource}`);
               setAddStatus({
                  loading: false,
                  error: `Unknown data source: ${dataSource}`,
               });
               return;
         }

         console.log(`Add ${dataSource} result:`, result);

         if (result.error) {
            console.error(`Error adding ${dataSource}:`, result.error);
            setAddStatus({ loading: false, error: result.error });
            alert(
               `Error adding record: ${
                  result.error.message || JSON.stringify(result.error)
               }`
            );
            return;
         }

         // Refresh data from the parent component or add the new record to local state
         if (refreshData) {
            refreshData();
         } else {
            setData([...data, result.data]);
         }

         // Call the onDataChange callback if provided
         if (onDataChange) {
            onDataChange("create", result.data);
         }

         // Clear the form and close the modal
         setNewRecord(createInitialFormState());
         document.querySelector('[role="dialog"]')?.close();

         // Show success message
         alert(`${title.split(" ")[0]} added successfully!`);
         setAddStatus({ loading: false, error: null });
      } catch (error) {
         console.error(`Error in handleAddRecord for ${dataSource}:`, error);
         setAddStatus({ loading: false, error: error });
         alert(`Error adding record: ${error.message || "Unknown error"}`);
      }
   };

   const handleUpdate = async (updatedData) => {
      if (!dataSource) {
         console.error("No data source specified for updating records");
         return;
      }

      try {
         setUpdateStatus({ loading: true, error: null });

         const id = updatedData.id;

         if (!id) {
            console.error("No ID provided for update");
            setUpdateStatus({
               loading: false,
               error: "No ID provided for update",
            });
            return;
         }

         console.log(
            `Updating ${dataSource} record with ID ${id}:`,
            updatedData
         );

         // Handle boolean values properly
         const dataToUpdate = { ...updatedData };
         if (dataToUpdate.is_preferred !== undefined) {
            dataToUpdate.is_preferred = Boolean(dataToUpdate.is_preferred);
         }
         if (dataToUpdate.is_default !== undefined) {
            dataToUpdate.is_default = Boolean(dataToUpdate.is_default);
         }
         if (dataToUpdate.is_active !== undefined) {
            dataToUpdate.is_active = Boolean(dataToUpdate.is_active);
         }

         let result;

         // Call the appropriate service method based on dataSource
         switch (dataSource) {
            case "locations":
               result = await masterDataService.updateLocation(
                  id,
                  dataToUpdate
               );
               break;
            case "insurance_companies":
               result = await masterDataService.updateInsuranceCompany(
                  id,
                  dataToUpdate
               );
               break;
            case "providers":
               result = await masterDataService.updateProvider(
                  id,
                  dataToUpdate
               );
               break;
            case "diagnosis_codes":
               result = await masterDataService.updateDiagnosisCode(
                  id,
                  dataToUpdate
               );
               break;
            case "procedures":
               result = await masterDataService.updateProcedure(
                  id,
                  dataToUpdate
               );
               break;
            case "modifiers":
               result = await masterDataService.updateModifier(
                  id,
                  dataToUpdate
               );
               break;
            default:
               console.error(`Unknown data source: ${dataSource}`);
               setUpdateStatus({
                  loading: false,
                  error: `Unknown data source: ${dataSource}`,
               });
               return;
         }

         console.log(`Update ${dataSource} result:`, result);

         if (result.error) {
            console.error(`Error updating ${dataSource}:`, result.error);
            setUpdateStatus({ loading: false, error: result.error });
            alert(
               `Error updating record: ${
                  result.error.message || JSON.stringify(result.error)
               }`
            );
            return;
         }

         // Refresh data from the parent component or update the record in local state
         if (refreshData) {
            refreshData();
         } else {
            setData(data.map((item) => (item.id === id ? result.data : item)));
         }

         // Call the onDataChange callback if provided
         if (onDataChange) {
            onDataChange("update", result.data);
         }

         // Show success message
         alert(`${title.split(" ")[0]} updated successfully!`);
         setUpdateStatus({ loading: false, error: null });
      } catch (error) {
         console.error(`Error in handleUpdate for ${dataSource}:`, error);
         setUpdateStatus({ loading: false, error: error });
         alert(`Error updating record: ${error.message || "Unknown error"}`);
      }
   };

   const handleDelete = (ids) => {
      if (customOnDelete) {
         // Use custom delete handler if provided
         if (Array.isArray(ids)) {
            // For bulk delete, we get an array of IDs
            const rowsToDelete = data.filter((item) => ids.includes(item.id));
            // For each row, call customOnDelete with just the ID
            rowsToDelete.forEach((row) => customOnDelete(row.id));
         } else {
            // For single delete from ModernDataTable, we get a single ID
            customOnDelete(ids);
         }
      } else {
         // Default delete behavior - make sure to call the appropriate Supabase delete method
         if (
            window.confirm(
               `Are you sure you want to delete ${
                  Array.isArray(ids) ? ids.length : 1
               } record(s)?`
            )
         ) {
            if (dataSource) {
               try {
                  if (Array.isArray(ids)) {
                     // Handle bulk delete
                     Promise.all(
                        ids.map((id) => {
                           switch (dataSource) {
                              case "locations":
                                 return masterDataService.deleteLocation(id);
                              case "insurance_companies":
                                 return masterDataService.deleteInsuranceCompany(
                                    id
                                 );
                              case "providers":
                                 return masterDataService.deleteProvider(id);
                              case "diagnosis_codes":
                                 return masterDataService.deleteDiagnosisCode(
                                    id
                                 );
                              case "procedures":
                                 return masterDataService.deleteProcedure(id);
                              case "modifiers":
                                 return masterDataService.deleteModifier(id);
                              default:
                                 console.error(
                                    `Unknown data source: ${dataSource}`
                                 );
                                 return Promise.reject(
                                    `Unknown data source: ${dataSource}`
                                 );
                           }
                        })
                     ).then(() => {
                        // Refresh data
                        if (refreshData) {
                           refreshData();
                        } else {
                           setData(
                              data.filter((item) => !ids.includes(item.id))
                           );
                        }

                        // Call onDataChange if provided
                        if (onDataChange) {
                           onDataChange("delete", ids);
                        }

                        setSelectedRows([]);
                     });
                  } else {
                     // Handle single delete
                     let deletePromise;

                     switch (dataSource) {
                        case "locations":
                           deletePromise =
                              masterDataService.deleteLocation(ids);
                           break;
                        case "insurance_companies":
                           deletePromise =
                              masterDataService.deleteInsuranceCompany(ids);
                           break;
                        case "providers":
                           deletePromise =
                              masterDataService.deleteProvider(ids);
                           break;
                        case "diagnosis_codes":
                           deletePromise =
                              masterDataService.deleteDiagnosisCode(ids);
                           break;
                        case "procedures":
                           deletePromise =
                              masterDataService.deleteProcedure(ids);
                           break;
                        case "modifiers":
                           deletePromise =
                              masterDataService.deleteModifier(ids);
                           break;
                        default:
                           console.error(`Unknown data source: ${dataSource}`);
                           return;
                     }

                     deletePromise.then((result) => {
                        if (result.error) {
                           console.error(
                              `Error deleting ${dataSource}:`,
                              result.error
                           );
                           alert(
                              `Error deleting record: ${
                                 result.error.message ||
                                 JSON.stringify(result.error)
                              }`
                           );
                           return;
                        }

                        // Refresh data
                        if (refreshData) {
                           refreshData();
                        } else {
                           setData(data.filter((item) => item.id !== ids));
                        }

                        // Call onDataChange if provided
                        if (onDataChange) {
                           onDataChange("delete", ids);
                        }
                     });
                  }
               } catch (error) {
                  console.error(`Error deleting ${dataSource}:`, error);
                  alert(
                     `Error deleting record: ${
                        error.message || "Unknown error"
                     }`
                  );
               }
            } else {
               // Fallback to local-only delete if no dataSource provided
               if (Array.isArray(ids)) {
                  setData(data.filter((item) => !ids.includes(item.id)));
               } else {
                  setData(data.filter((item) => item.id !== ids));
               }
               setSelectedRows([]);
            }
         }
      }
   };

   const handleBulkDelete = () => {
      if (selectedRows.length === 0) return;
      handleDelete(selectedRows);
   };

   const handleExport = () => {
      const csvContent = [
         Object.keys(
            columns.reduce(
               (acc, col) => ({ ...acc, [col.accessorKey]: "" }),
               {}
            )
         ).join(","),
         ...data.map((row) =>
            Object.values(
               columns.reduce(
                  (acc, col) => ({
                     ...acc,
                     [col.accessorKey]: row[col.accessorKey] || "",
                  }),
                  {}
               )
            ).join(",")
         ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.toLowerCase().replace(/\s+/g, "_")}_data.csv`;
      a.click();
   };

   const renderFormField = (field) => {
      const { key, label, type, options, placeholder, className } = field;

      switch (type) {
         case "select":
            return (
               <Select
                  value={newRecord[key]}
                  onValueChange={(value) =>
                     handleNewRecordChange({ target: { value } }, key)
                  }
               >
                  <SelectTrigger
                     className={`border-opacity-20 focus:border-opacity-50 ${
                        className || ""
                     }`}
                  >
                     <SelectValue
                        placeholder={
                           placeholder || `Select ${label.toLowerCase()}`
                        }
                     />
                  </SelectTrigger>
                  <SelectContent>
                     {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                           {option.label}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            );
         case "date":
            return (
               <Input
                  type='date'
                  value={newRecord[key]}
                  onChange={(e) => handleNewRecordChange(e, key)}
                  className={`border-opacity-20 focus:border-opacity-50 ${
                     className || ""
                  }`}
               />
            );
         default:
            return (
               <Input
                  placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                  value={newRecord[key]}
                  onChange={(e) => handleNewRecordChange(e, key)}
                  className={`border-opacity-20 focus:border-opacity-50 ${
                     className || ""
                  }`}
               />
            );
      }
   };

   return (
      <div className='min-h-screen  dark:bg-gray-950 p-6'>
         <div className='container mx-auto max-w-7xl'>
            <Card className='shadow-2xl border-0 backdrop-blur-sm bg-primary/10  dark:bg-gray-950'>
               <CardHeader className={` text-primary rounded-t-lg`}>
                  <div className='flex items-center justify-between'>
                     <div className='flex items-center gap-3'>
                        <div className='p-2 bg-white/20 rounded-lg'>
                           <Icon className='h-6 w-6' />
                        </div>
                        <div>
                           <CardTitle className='text-2xl font-bold'>
                              {title}
                           </CardTitle>
                           <p className='text-primary/80 mt-1'>{subtitle}</p>
                        </div>
                     </div>
                     {showAddButton && (
                        <Modal
                           trigger={
                              <Button className='bg-primary/80 hover:bg-primary/90 text-primary-foreground border-primary-foreground/30 backdrop-blur-sm'>
                                 <FaPlus className='mr-2 h-4 w-4' /> Add{" "}
                                 {title.split(" ")[0]}
                              </Button>
                           }
                           title={`Add New ${title.split(" ")[0]}`}
                           className={modalWidth}
                        >
                           <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 max-h-[70vh] overflow-y-auto'>
                              {formFields &&
                                 formFields.map((field) => (
                                    <div
                                       key={field.key}
                                       className={
                                          field.fullWidth ? "col-span-full" : ""
                                       }
                                    >
                                       <label className='block text-sm font-medium text-foreground mb-2'>
                                          {field.label}
                                       </label>
                                       {renderFormField(field)}
                                    </div>
                                 ))}
                              <div className='col-span-full flex justify-end mt-4'>
                                 <Button
                                    onClick={handleAddRecord}
                                    className={`hover:opacity-90`}
                                    disabled={addStatus.loading}
                                 >
                                    {addStatus.loading
                                       ? "Saving..."
                                       : `Save ${title.split(" ")[0]}`}
                                 </Button>
                              </div>
                           </div>
                        </Modal>
                     )}
                  </div>
               </CardHeader>
               <ModernDataTable
                  data={data}
                  columns={columns}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                  onBulkDelete={handleBulkDelete}
                  onExport={handleExport}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  searchPlaceholder={searchPlaceholder}
                  emptyMessage={loading ? "Loading..." : emptyMessage}
                  addButton={showAddButton}
                  actions={showEditButton}
               />
            </Card>
         </div>
      </div>
   );
};

export default GenericTable;
