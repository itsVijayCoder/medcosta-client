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
}) {
   const [selectedRows, setSelectedRows] = useState(new Set());
   const [searchTerm, setSearchTerm] = useState("");
   const [filteredData, setFilteredData] = useState(data);

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

      if (
         window.confirm(
            `Are you sure you want to delete ${selectedRows.size} selected items?`
         )
      ) {
         if (onBulkDelete) {
            onBulkDelete(Array.from(selectedRows));
         }
         setSelectedRows(new Set());
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
                                             {onEdit && (
                                                <Button
                                                   size='sm'
                                                   variant='outline'
                                                   onClick={() =>
                                                      onEdit?.(row.id, row)
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
                                                      onDelete?.(row.id)
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
      </Card>
   );
}
