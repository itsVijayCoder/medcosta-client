import React, { useState, useEffect } from "react";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
   FaEdit,
   FaTrash,
   FaSave,
   FaTimes,
   FaSearch,
   FaDownload,
   FaPlus,
} from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import jQuery from "jquery";
import "datatables.net-dt";
import "datatables.net-buttons-dt";
import "datatables.net-responsive-dt";
import "datatables.net-dt/css/dataTables.dataTables.css";

window.$ = window.jQuery = jQuery;

export function ModernDataTable({
   title,
   data = [],
   columns = [],
   editId,
   editedData,
   onEdit,
   onSave,
   onDelete,
   onBulkDelete,
   onInputChange,
   onAdd,
   searchable = true,
   exportable = true,
   addButton = true,
   actions = true,
   className = "",
   emptyMessage = "No data available",
   customActions = [], // New prop for custom action buttons
   formFields = [], // Form fields for edit modal
   dynamicOptions = {}, // Dynamic options for select fields
}) {
   const [selectedRows, setSelectedRows] = useState(new Set());
   const [searchTerm, setSearchTerm] = useState("");
   const [filteredData, setFilteredData] = useState(data);
   const [editModalOpen, setEditModalOpen] = useState(false);
   const [editingRecord, setEditingRecord] = useState(null);
   const [editFormData, setEditFormData] = useState({});
   const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
   const [deleteTarget, setDeleteTarget] = useState(null);
   const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);

   // Filter data based on search term
   useEffect(() => {
      console.log("ModernDataTable - data prop received:", data);
      console.log("ModernDataTable - data type:", typeof data);
      console.log("ModernDataTable - is array:", Array.isArray(data));
      console.log(
         "ModernDataTable - data length:",
         Array.isArray(data) ? data.length : "N/A"
      );

      if (!searchTerm || !Array.isArray(data)) {
         console.log("ModernDataTable - setting filteredData to:", data || []);
         setFilteredData(data || []);
         return;
      }

      const filtered = data.filter((row) =>
         columns.some(
            (col) =>
               col &&
               col.accessorKey &&
               String(row[col.accessorKey] || "")
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
         )
      );
      console.log("ModernDataTable - setting filtered data to:", filtered);
      setFilteredData(filtered);
   }, [data, searchTerm, columns]);

   // Handle select all checkbox
   const handleSelectAll = (checked) => {
      if (checked && Array.isArray(filteredData)) {
         setSelectedRows(
            new Set(
               filteredData.filter((row) => row && row.id).map((row) => row.id)
            )
         );
      } else {
         setSelectedRows(new Set());
      }
   };

   // Handle individual row selection
   const handleRowSelect = (rowId, checked) => {
      const newSelected = new Set(selectedRows);
      if (checked) {
         newSelected.add(rowId);
      } else {
         newSelected.delete(rowId);
      }
      setSelectedRows(newSelected);
   };

   // Handle bulk delete
   const handleBulkDelete = () => {
      if (selectedRows.size === 0) return;
      // Direct call to onBulkDelete without showing the modal
      // This way, only the GenericTable's confirmation will be shown
      if (onBulkDelete) {
         onBulkDelete(Array.from(selectedRows));
      }
   };

   // Keep this for backward compatibility but it won't be used with GenericTable
   const confirmBulkDelete = () => {
      if (onBulkDelete) {
         onBulkDelete(Array.from(selectedRows));
      }
      setSelectedRows(new Set());
      setBulkDeleteConfirmOpen(false);
   };

   // Handle single delete
   const handleSingleDelete = (rowId) => {
      // Direct call to onDelete without showing the modal
      // This way, only the GenericTable's confirmation will be shown
      if (onDelete) {
         onDelete(rowId);
      }
   };

   // Keep this for backward compatibility but it won't be used with GenericTable
   const confirmSingleDelete = () => {
      if (onDelete && deleteTarget) {
         onDelete(deleteTarget);
      }
      setDeleteTarget(null);
      setDeleteConfirmOpen(false);
   };

   // Handle edit
   const handleEditClick = (rowId, rowData) => {
      if (onEdit) {
         // If external edit handler provided, use it
         onEdit(rowData);
      } else {
         // Otherwise use internal modal
         setEditingRecord(rowData);
         setEditFormData({ ...rowData });
         setEditModalOpen(true);
      }
   };

   const handleEditFormChange = (field, value) => {
      setEditFormData((prev) => ({
         ...prev,
         [field]: value,
      }));
   };

   const handleSaveEdit = () => {
      if (onSave && editingRecord) {
         onSave(editFormData);
         setEditModalOpen(false);
         setEditingRecord(null);
         setEditFormData({});
      }
   };

   // Export functionality
   const handleExport = (format) => {
      const dataToExport = filteredData.map((row) => {
         const exportRow = {};
         columns.forEach((col) => {
            if (col && col.header && col.accessorKey) {
               exportRow[col.header] = row[col.accessorKey];
            }
         });
         return exportRow;
      });

      if (format === "csv") {
         const validColumns = columns.filter((col) => col && col.header);
         const csv = [
            validColumns.map((col) => col.header).join(","),
            ...dataToExport.map((row) =>
               validColumns.map((col) => `"${row[col.header] || ""}"`).join(",")
            ),
         ].join("\n");

         const blob = new Blob([csv], { type: "text/csv" });
         const url = window.URL.createObjectURL(blob);
         const a = document.createElement("a");
         a.href = url;
         a.download = `${title || "data"}.csv`;
         a.click();
         window.URL.revokeObjectURL(url);
      }
   };

   const allSelected =
      filteredData.length > 0 && selectedRows.size === filteredData.length;
   const someSelected =
      selectedRows.size > 0 && selectedRows.size < filteredData.length;

   return (
      <Card className={`w-full ${className}`}>
         <CardHeader>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
               <CardTitle className='text-xl font-semibold'>{title}</CardTitle>

               <div className='flex flex-wrap items-center gap-2'>
                  {/* Search */}
                  {searchable && (
                     <div className='relative'>
                        <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
                        <Input
                           placeholder='Search...'
                           id='data-table-search'
                           name='search'
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           className='pl-10 w-64'
                        />
                     </div>
                  )}

                  {/* Bulk Actions */}
                  {selectedRows.size > 0 && (
                     <div className='flex items-center gap-2'>
                        <Badge variant='secondary'>
                           {selectedRows.size} selected
                        </Badge>
                        <Button
                           variant='destructive'
                           size='sm'
                           onClick={handleBulkDelete}
                           className='flex items-center gap-2'
                        >
                           <FaTrash className='h-4 w-4' />
                           Delete Selected
                        </Button>
                     </div>
                  )}

                  {/* Export */}
                  {exportable && (
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant='outline' size='sm'>
                              <FaDownload className='h-4 w-4 mr-2' />
                              Export
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                           <DropdownMenuItem
                              onClick={() => handleExport("csv")}
                           >
                              Export as CSV
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  )}

                  {/* Add Button */}
                  {addButton && onAdd && (
                     <Button
                        onClick={onAdd}
                        className='flex items-center gap-2'
                     >
                        <FaPlus className='h-4 w-4' />
                        Add New
                     </Button>
                  )}
               </div>
            </div>
         </CardHeader>

         <CardContent>
            {filteredData.length === 0 ? (
               <div className='text-center py-12 text-muted-foreground'>
                  <p className='text-lg'>{emptyMessage}</p>
                  <p className='text-sm text-gray-500'>
                     {`Debug - Data: ${typeof filteredData}, Is Array: ${Array.isArray(
                        filteredData
                     )}, Length: ${filteredData.length}`}
                  </p>
               </div>
            ) : (
               <div className='rounded-md border overflow-hidden'>
                  <Table>
                     <TableHeader>
                        <TableRow>
                           {/* Bulk Select Header */}
                           {onBulkDelete && (
                              <TableHead className='w-12'>
                                 <Checkbox
                                    checked={allSelected}
                                    ref={(input) => {
                                       if (input)
                                          input.indeterminate = someSelected;
                                    }}
                                    onChange={(e) =>
                                       handleSelectAll(e.target.checked)
                                    }
                                 />
                              </TableHead>
                           )}

                           {columns
                              .filter(
                                 (column) =>
                                    column &&
                                    column.accessorKey &&
                                    column.header
                              )
                              .map((column) => (
                                 <TableHead
                                    key={column.accessorKey}
                                    className='font-semibold'
                                 >
                                    {column.header}
                                 </TableHead>
                              ))}

                           {actions && (
                              <TableHead className='text-right'>
                                 Actions
                              </TableHead>
                           )}
                        </TableRow>
                     </TableHeader>

                     <TableBody>
                        {filteredData.map((row) => (
                           <TableRow
                              key={row.id}
                              className={`hover:bg-muted transition-colors ${
                                 selectedRows.has(row.id) ? "bg-primary/10" : ""
                              }`}
                           >
                              {/* Bulk Select Cell */}
                              {onBulkDelete && (
                                 <TableCell>
                                    <Checkbox
                                       checked={selectedRows.has(row.id)}
                                       onChange={(e) =>
                                          handleRowSelect(
                                             row.id,
                                             e.target.checked
                                          )
                                       }
                                    />
                                 </TableCell>
                              )}

                              {columns
                                 .filter(
                                    (column) => column && column.accessorKey
                                 )
                                 .map((column) => (
                                    <TableCell
                                       key={column.accessorKey}
                                       className='py-3'
                                    >
                                       {editId === row.id ? (
                                          <Input
                                             type='text'
                                             id={`edit-${column.accessorKey}-${row.id}`}
                                             name={`edit-${column.accessorKey}`}
                                             value={
                                                editedData[
                                                   column.accessorKey
                                                ] || ""
                                             }
                                             onChange={(e) =>
                                                onInputChange?.(
                                                   e,
                                                   column.accessorKey
                                                )
                                             }
                                             className='max-w-sm'
                                          />
                                       ) : (
                                          <div className='flex items-center'>
                                             {column.render
                                                ? column.render(
                                                     row[column.accessorKey],
                                                     row
                                                  )
                                                : row[column.accessorKey] ||
                                                  "-"}
                                          </div>
                                       )}
                                    </TableCell>
                                 ))}

                              {actions && (
                                 <TableCell className='text-right'>
                                    <div className='flex justify-end gap-2'>
                                       {editId === row.id ? (
                                          <>
                                             <Button
                                                size='sm'
                                                variant='outline'
                                                onClick={onSave}
                                                className='h-8 w-8 p-0'
                                             >
                                                <FaSave className='h-4 w-4 text-success' />
                                             </Button>
                                             <Button
                                                size='sm'
                                                variant='outline'
                                                onClick={() => onEdit?.(null)}
                                                className='h-8 w-8 p-0'
                                             >
                                                <FaTimes className='h-4 w-4 text-muted-foreground' />
                                             </Button>
                                          </>
                                       ) : (
                                          <>
                                             {/* Custom Actions First */}
                                             {customActions &&
                                                customActions.map(
                                                   (action, index) => (
                                                      <Button
                                                         key={index}
                                                         size='sm'
                                                         variant={
                                                            action.variant ||
                                                            "outline"
                                                         }
                                                         onClick={() =>
                                                            action.onClick?.(
                                                               row.id
                                                            )
                                                         }
                                                         className={`h-8 w-8 p-0 ${
                                                            action.className ||
                                                            ""
                                                         }`}
                                                         title={action.label}
                                                      >
                                                         {action.icon ? (
                                                            <action.icon className='h-4 w-4' />
                                                         ) : (
                                                            <span className='text-xs'>
                                                               {action.label}
                                                            </span>
                                                         )}
                                                      </Button>
                                                   )
                                                )}

                                             {/* Default Edit Button */}
                                             {(onEdit || onSave) && (
                                                <Button
                                                   size='sm'
                                                   variant='outline'
                                                   onClick={() =>
                                                      handleEditClick(
                                                         row.id,
                                                         row
                                                      )
                                                   }
                                                   className='h-8 w-8 p-0'
                                                >
                                                   <FaEdit className='h-4 w-4 text-primary' />
                                                </Button>
                                             )}

                                             {/* Default Delete Button */}
                                             {onDelete && (
                                                <Button
                                                   size='sm'
                                                   variant='outline'
                                                   onClick={() =>
                                                      handleSingleDelete(row.id)
                                                   }
                                                   className='h-8 w-8 p-0'
                                                >
                                                   <FaTrash className='h-4 w-4 text-destructive' />
                                                </Button>
                                             )}
                                          </>
                                       )}
                                    </div>
                                 </TableCell>
                              )}
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </div>
            )}
         </CardContent>

         {/* Edit Modal */}
         <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
            <DialogContent className='sm:max-w-[600px]'>
               <DialogHeader>
                  <DialogTitle>Edit {title}</DialogTitle>
                  <DialogDescription>
                     Make changes to the record and click save when done.
                  </DialogDescription>
               </DialogHeader>

               <div className='grid gap-4 py-4'>
                  {formFields.map((field) => (
                     <div
                        className='grid grid-cols-4 items-center gap-4'
                        key={field.key}
                     >
                        <Label htmlFor={field.key} className='text-right'>
                           {field.label}
                        </Label>

                        {field.type === "select" ? (
                           <div className='col-span-3'>
                              <Select
                                 value={editFormData[field.key] || ""}
                                 onValueChange={(value) =>
                                    handleEditFormChange(field.key, value)
                                 }
                              >
                                 <SelectTrigger>
                                    <SelectValue
                                       placeholder={`Select ${field.label}`}
                                    />
                                 </SelectTrigger>
                                 <SelectContent>
                                    {(field.loadOptions &&
                                    dynamicOptions[field.key]
                                       ? dynamicOptions[field.key]
                                       : field.options || []
                                    ).map((option) => (
                                       <SelectItem
                                          key={option.value}
                                          value={option.value.toString()}
                                       >
                                          {option.label}
                                       </SelectItem>
                                    ))}
                                 </SelectContent>
                              </Select>
                           </div>
                        ) : (
                           <Input
                              id={field.key}
                              type={field.type || "text"}
                              className='col-span-3'
                              value={editFormData[field.key] || ""}
                              onChange={(e) =>
                                 handleEditFormChange(field.key, e.target.value)
                              }
                           />
                        )}
                     </div>
                  ))}
               </div>

               <div className='flex justify-end gap-2'>
                  <Button
                     variant='outline'
                     onClick={() => setEditModalOpen(false)}
                  >
                     Cancel
                  </Button>
                  <Button onClick={handleSaveEdit}>Save Changes</Button>
               </div>
            </DialogContent>
         </Dialog>

         {/* 
            Confirmation dialogs are removed from ModernDataTable 
            to avoid duplicate confirmations with GenericTable
            The dialogs now show only from the GenericTable component
         */}
      </Card>
   );
}
