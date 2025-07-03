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
import { FaPlus, FaEdit } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { masterDataService } from "@/services/masterDataService";
import { yesNoOptions } from "@/data/tableConfigs";
import NotificationDialog from "@/components/ui/notification-dialog";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";

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
   customActions = [], // Custom action buttons for each row
   onSelectedRowsChange, // Callback to get selected rows
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
   const [dynamicOptions, setDynamicOptions] = useState({});

   // New state variables for edit functionality
   const [editModalOpen, setEditModalOpen] = useState(false);
   const [editRecord, setEditRecord] = useState(null);

   // New state variables for dialogs
   const [notificationDialog, setNotificationDialog] = useState({
      open: false,
      title: "",
      message: "",
      type: "info", // success, error, warning, info
   });

   const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({
      open: false,
      ids: null,
      title: "Confirm Delete",
      description: "Are you sure you want to delete this record?",
   });

   const [bulkDeleteConfirmDialog, setBulkDeleteConfirmDialog] = useState({
      open: false,
      title: "Confirm Bulk Delete",
      description: "Are you sure you want to delete the selected records?",
   });

   // Update data when initialData prop changes
   useEffect(() => {
      console.log("initialData changed:", initialData);
      setData(initialData);
   }, [initialData]);

   // Notify parent of selected rows changes
   useEffect(() => {
      if (onSelectedRowsChange) {
         onSelectedRowsChange(selectedRows);
      }
   }, [selectedRows, onSelectedRowsChange]);

   // Load dynamic options for select fields
   useEffect(() => {
      const loadDynamicOptions = async () => {
         const fieldsWithLoaders =
            formFields?.filter((field) => field.loadOptions) || [];

         for (const field of fieldsWithLoaders) {
            try {
               const options = await field.loadOptions();
               setDynamicOptions((prev) => ({
                  ...prev,
                  [field.key]: options,
               }));
            } catch (error) {
               console.error(`Error loading options for ${field.key}:`, error);
               setDynamicOptions((prev) => ({
                  ...prev,
                  [field.key]: [],
               }));
            }
         }
      };

      loadDynamicOptions();
   }, [formFields]);

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

   // Function to open edit modal with pre-filled data
   const handleEditClick = (record) => {
      setEditRecord({ ...record });
      setEditModalOpen(true);
   };

   // Function to handle changes in edit form
   const handleEditRecordChange = (e, field) => {
      setEditRecord({ ...editRecord, [field]: e.target.value });
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

            // Show error notification
            setNotificationDialog({
               open: true,
               title: "Error Adding Record",
               message: result.error.message || JSON.stringify(result.error),
               type: "error",
            });
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

         // Show success notification
         setNotificationDialog({
            open: true,
            title: "Success",
            message: `${title.split(" ")[0]} added successfully!`,
            type: "success",
         });
         setAddStatus({ loading: false, error: null });
      } catch (error) {
         console.error(`Error in handleAddRecord for ${dataSource}:`, error);
         setAddStatus({ loading: false, error: error });
         // Show error notification
         setNotificationDialog({
            open: true,
            title: "Error Adding Record",
            message: error.message || "Unknown error",
            type: "error",
         });
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

            // Show error notification
            setNotificationDialog({
               open: true,
               title: "Error Updating Record",
               message: result.error.message || JSON.stringify(result.error),
               type: "error",
            });
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

         // Close edit modal if it was used for this update
         if (editModalOpen) {
            setEditModalOpen(false);
            setEditRecord(null);
         }

         // Show success notification
         setNotificationDialog({
            open: true,
            title: "Success",
            message: `${title.split(" ")[0]} updated successfully!`,
            type: "success",
         });
         setUpdateStatus({ loading: false, error: null });
      } catch (error) {
         console.error(`Error in handleUpdate for ${dataSource}:`, error);
         setUpdateStatus({ loading: false, error: error });
         // Show error notification
         setNotificationDialog({
            open: true,
            title: "Error Updating Record",
            message: error.message || "Unknown error",
            type: "error",
         });
      }
   };

   const handleEditSave = () => {
      if (!editRecord || !editRecord.id) {
         console.error("No edit record or ID provided for update");
         return;
      }

      // Remove any nested objects (like locations) to prevent API errors
      const {
         locations,
         insurance_companies,
         providers,
         diagnosis_codes,
         procedures,
         modifiers,
         ...baseData
      } = editRecord;

      // Handle boolean values properly
      const dataToUpdate = { ...baseData };
      if (dataToUpdate.is_preferred !== undefined) {
         dataToUpdate.is_preferred = Boolean(
            dataToUpdate.is_preferred === true ||
               dataToUpdate.is_preferred === "true"
         );
      }
      if (dataToUpdate.is_default !== undefined) {
         dataToUpdate.is_default = Boolean(
            dataToUpdate.is_default === true ||
               dataToUpdate.is_default === "true"
         );
      }
      if (dataToUpdate.is_active !== undefined) {
         dataToUpdate.is_active = Boolean(
            dataToUpdate.is_active === true || dataToUpdate.is_active === "true"
         );
      }

      console.log("Prepared data for update:", dataToUpdate);
      handleUpdate(dataToUpdate);
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
         // Default delete behavior - open confirmation dialog
         if (Array.isArray(ids)) {
            // Bulk delete confirmation
            setBulkDeleteConfirmDialog({
               open: true,
               title: "Confirm Bulk Delete",
               description: `Are you sure you want to delete ${ids.length} record(s)? This action sets records as inactive.`,
               ids: ids,
            });
         } else {
            // Single delete confirmation
            setDeleteConfirmDialog({
               open: true,
               title: "Confirm Delete",
               description:
                  "Are you sure you want to delete this record? This action sets the record as inactive.",
               ids: ids,
            });
         }
      }
   };

   const confirmDelete = (ids) => {
      if (!dataSource) return;

      try {
         if (Array.isArray(ids)) {
            // Handle bulk delete
            Promise.all(
               ids.map((id) => {
                  switch (dataSource) {
                     case "locations":
                        return masterDataService.deleteLocation(id);
                     case "insurance_companies":
                        return masterDataService.deleteInsuranceCompany(id);
                     case "providers":
                        return masterDataService.deleteProvider(id);
                     case "diagnosis_codes":
                        return masterDataService.deleteDiagnosisCode(id);
                     case "procedures":
                        return masterDataService.deleteProcedure(id);
                     case "modifiers":
                        return masterDataService.deleteModifier(id);
                     default:
                        console.error(`Unknown data source: ${dataSource}`);
                        return Promise.reject(
                           `Unknown data source: ${dataSource}`
                        );
                  }
               })
            ).then((results) => {
               // Check if any results have errors
               const errors = results.filter((r) => r.error);
               if (errors.length > 0) {
                  setNotificationDialog({
                     open: true,
                     title: "Error Deleting Records",
                     message: `Failed to delete ${errors.length} record(s).`,
                     type: "error",
                  });
                  return;
               }

               // Refresh data
               if (refreshData) {
                  refreshData();
               } else {
                  setData(data.filter((item) => !ids.includes(item.id)));
               }

               // Call onDataChange if provided
               if (onDataChange) {
                  onDataChange("delete", ids);
               }

               setNotificationDialog({
                  open: true,
                  title: "Success",
                  message: `Successfully deleted ${ids.length} record(s).`,
                  type: "success",
               });

               setSelectedRows([]);
               setBulkDeleteConfirmDialog((prev) => ({ ...prev, open: false }));
            });
         } else {
            // Handle single delete
            let deletePromise;

            switch (dataSource) {
               case "locations":
                  deletePromise = masterDataService.deleteLocation(ids);
                  break;
               case "insurance_companies":
                  deletePromise = masterDataService.deleteInsuranceCompany(ids);
                  break;
               case "providers":
                  deletePromise = masterDataService.deleteProvider(ids);
                  break;
               case "diagnosis_codes":
                  deletePromise = masterDataService.deleteDiagnosisCode(ids);
                  break;
               case "procedures":
                  deletePromise = masterDataService.deleteProcedure(ids);
                  break;
               case "modifiers":
                  deletePromise = masterDataService.deleteModifier(ids);
                  break;
               default:
                  console.error(`Unknown data source: ${dataSource}`);
                  setDeleteConfirmDialog((prev) => ({ ...prev, open: false }));
                  return;
            }

            deletePromise.then((result) => {
               if (result.error) {
                  console.error(`Error deleting ${dataSource}:`, result.error);
                  setNotificationDialog({
                     open: true,
                     title: "Error Deleting Record",
                     message:
                        result.error.message || JSON.stringify(result.error),
                     type: "error",
                  });
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

               setNotificationDialog({
                  open: true,
                  title: "Success",
                  message: `Record deleted successfully.`,
                  type: "success",
               });

               setDeleteConfirmDialog((prev) => ({ ...prev, open: false }));
            });
         }
      } catch (error) {
         console.error(`Error deleting ${dataSource}:`, error);
         setNotificationDialog({
            open: true,
            title: "Error",
            message: `Error deleting record: ${
               error.message || "Unknown error"
            }`,
            type: "error",
         });
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
      const { key, label, type, options, loadOptions, placeholder, className } =
         field;

      switch (type) {
         case "select":
            // Use dynamic options if available, otherwise fall back to static options
            const selectOptions = dynamicOptions[key] || options || [];

            return (
               <Select
                  value={newRecord[key]}
                  onValueChange={(value) =>
                     handleNewRecordChange({ target: { value } }, key)
                  }
                  name={`select-${key}`}
               >
                  <SelectTrigger
                     id={`select-trigger-${key}`}
                     name={`select-${key}`}
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
                     {selectOptions.map((option) => (
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
                  id={`date-input-${key}`}
                  name={`date-${key}`}
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
                  id={`text-input-${key}`}
                  name={`text-${key}`}
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
                  customActions={customActions}
                  formFields={formFields}
                  dynamicOptions={dynamicOptions}
                  onEdit={handleEditClick}
               />

               {/* Edit Modal */}
               {editRecord && (
                  <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                     <DialogContent className='sm:max-w-[600px]'>
                        <DialogHeader>
                           <DialogTitle>Edit {title.split(" ")[0]}</DialogTitle>
                           <DialogDescription>
                              Make changes to the record and click save when
                              done.
                           </DialogDescription>
                        </DialogHeader>

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
                                    {field.type === "select" ? (
                                       <Select
                                          value={
                                             editRecord[
                                                field.key
                                             ]?.toString() || ""
                                          }
                                          onValueChange={(value) =>
                                             setEditRecord({
                                                ...editRecord,
                                                [field.key]: value,
                                             })
                                          }
                                          name={`select-${field.key}`}
                                       >
                                          <SelectTrigger
                                             id={`select-trigger-${field.key}`}
                                             name={`select-${field.key}`}
                                             className='border-opacity-20 focus:border-opacity-50'
                                          >
                                             <SelectValue
                                                placeholder={`Select ${field.label.toLowerCase()}`}
                                             />
                                          </SelectTrigger>
                                          <SelectContent>
                                             {(
                                                dynamicOptions[field.key] ||
                                                field.options ||
                                                []
                                             ).map((option) => (
                                                <SelectItem
                                                   key={option.value}
                                                   value={option.value}
                                                >
                                                   {option.label}
                                                </SelectItem>
                                             ))}
                                          </SelectContent>
                                       </Select>
                                    ) : (
                                       <Input
                                          type={field.type || "text"}
                                          id={`edit-${field.key}`}
                                          name={`edit-${field.key}`}
                                          value={editRecord[field.key] || ""}
                                          onChange={(e) =>
                                             setEditRecord({
                                                ...editRecord,
                                                [field.key]: e.target.value,
                                             })
                                          }
                                          className='border-opacity-20 focus:border-opacity-50'
                                       />
                                    )}
                                 </div>
                              ))}
                           <div className='col-span-full flex justify-end mt-4'>
                              <Button
                                 variant='outline'
                                 onClick={() => setEditModalOpen(false)}
                                 className='mr-2'
                              >
                                 Cancel
                              </Button>
                              <Button
                                 onClick={handleEditSave}
                                 className='hover:opacity-90'
                                 disabled={updateStatus.loading}
                              >
                                 {updateStatus.loading
                                    ? "Saving..."
                                    : `Save Changes`}
                              </Button>
                           </div>
                        </div>
                     </DialogContent>
                  </Dialog>
               )}

               {/* Notification Dialog */}
               <NotificationDialog
                  open={notificationDialog.open}
                  onOpenChange={(open) =>
                     setNotificationDialog((prev) => ({ ...prev, open }))
                  }
                  title={notificationDialog.title}
                  message={notificationDialog.message}
                  type={notificationDialog.type}
                  autoClose={true}
               />

               {/* Delete Confirmation Dialog */}
               <ConfirmationDialog
                  open={deleteConfirmDialog.open}
                  onOpenChange={(open) =>
                     setDeleteConfirmDialog((prev) => ({ ...prev, open }))
                  }
                  title={deleteConfirmDialog.title}
                  description={deleteConfirmDialog.description}
                  confirmText='Delete'
                  cancelText='Cancel'
                  variant='destructive'
                  onConfirm={() => confirmDelete(deleteConfirmDialog.ids)}
               />

               {/* Bulk Delete Confirmation Dialog */}
               <ConfirmationDialog
                  open={bulkDeleteConfirmDialog.open}
                  onOpenChange={(open) =>
                     setBulkDeleteConfirmDialog((prev) => ({ ...prev, open }))
                  }
                  title={bulkDeleteConfirmDialog.title}
                  description={bulkDeleteConfirmDialog.description}
                  confirmText='Delete All'
                  cancelText='Cancel'
                  variant='destructive'
                  onConfirm={() => confirmDelete(bulkDeleteConfirmDialog.ids)}
               />
            </Card>
         </div>
      </div>
   );
};

export default GenericTable;
