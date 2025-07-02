import React, { useState } from "react";
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
}) => {
   const [data, setData] = useState(initialData);
   const [selectedRows, setSelectedRows] = useState([]);

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

   const handleAddRecord = () => {
      const newId = Math.max(...data.map((item) => item.id), 0) + 1;
      const currentDate = new Date().toISOString().split("T")[0];

      const newData = {
         ...newRecord,
         id: newId,
         created_date: currentDate,
         modified_date: currentDate,
         modified_by: "System",
      };

      setData([...data, newData]);
      setNewRecord(createInitialFormState());
      document.querySelector('[role="dialog"]')?.close();
   };

   const handleUpdate = (updatedData) => {
      const currentDate = new Date().toISOString().split("T")[0];
      const updatedRecord = {
         ...updatedData,
         modified_date: currentDate,
         modified_by: "System",
      };
      setData(
         data.map((item) =>
            item.id === updatedRecord.id ? updatedRecord : item
         )
      );
   };

   const handleDelete = (ids) => {
      if (customOnDelete) {
         // Use custom delete handler if provided
         const rowsToDelete = data.filter((item) => ids.includes(item.id));
         customOnDelete(rowsToDelete);
      } else {
         // Default delete behavior
         if (
            window.confirm(
               `Are you sure you want to delete ${ids.length} record(s)?`
            )
         ) {
            setData(data.filter((item) => !ids.includes(item.id)));
            setSelectedRows([]);
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
                                 >
                                    Save {title.split(" ")[0]}
                                 </Button>
                              </div>
                           </div>
                        </Modal>
                     )}
                  </div>
               </CardHeader>
               {/* <CardContent className='p-6'> */}
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
                  emptyMessage={emptyMessage}
                  addButton={showAddButton}
                  actions={showEditButton}
               />
               {/* </CardContent> */}
            </Card>
         </div>
      </div>
   );
};

export default GenericTable;
