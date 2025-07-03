import React, { useState, useEffect, useCallback, useMemo } from "react";
import GenericTable from "@/components/ui/generic-table";
import { masterDataService } from "@/services/masterDataService";
import { Button } from "@/components/ui/button";
import { Trash2, RotateCcw } from "lucide-react";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

// ============================================================================
// CONSTANTS & STATIC DATA (following DRY principle)
// ============================================================================

const AVAILABLE_TABLES = Object.freeze([
   { value: "locations", label: "Locations" },
   { value: "insurance_companies", label: "Insurance Companies" },
   { value: "providers", label: "Providers" },
   { value: "diagnosis_codes", label: "Diagnosis Codes" },
   { value: "procedures", label: "Procedures" },
   { value: "modifiers", label: "Modifiers" },
]);

const TABLE_COLUMN_CONFIGS = Object.freeze({
   locations: [
      { header: "Location Name", accessorKey: "location_name" },
      { header: "NPI", accessorKey: "npi" },
      { header: "Address", accessorKey: "address" },
   ],
   insurance_companies: [
      { header: "Company Name", accessorKey: "name" },
      { header: "Insured ID", accessorKey: "insured_id" },
      { header: "Contact", accessorKey: "contact_info" },
   ],
   providers: [
      { header: "Provider Name", accessorKey: "name" },
      { header: "NPI", accessorKey: "npi" },
      { header: "Specialty", accessorKey: "specialty" },
   ],
   diagnosis_codes: [
      { header: "Diagnosis Code", accessorKey: "diagnosis_code" },
      { header: "Description", accessorKey: "description" },
      { header: "Category", accessorKey: "category" },
   ],
   procedures: [
      { header: "Procedure Code", accessorKey: "procedure_code" },
      { header: "Description", accessorKey: "description" },
      { header: "Specialty", accessorKey: "specialty" },
   ],
   modifiers: [
      { header: "Modifier Code", accessorKey: "modifier_code" },
      { header: "Modifier Name", accessorKey: "modifier_name" },
      { header: "Description", accessorKey: "description" },
   ],
});

// Form field configurations for editing deleted records
const TABLE_FORM_CONFIGS = Object.freeze({
   locations: [
      { key: "location_name", label: "Location Name", type: "text" },
      { key: "npi", label: "NPI", type: "text" },
      { key: "clia_number", label: "CLIA Number", type: "text" },
      { key: "address", label: "Address", type: "text" },
      { key: "city", label: "City", type: "text" },
      { key: "state", label: "State", type: "text" },
      { key: "zip", label: "ZIP", type: "text" },
   ],
   insurance_companies: [
      { key: "name", label: "Company Name", type: "text" },
      { key: "policy_type", label: "Policy Type", type: "text" },
      { key: "contact_info", label: "Contact Info", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
   ],
   providers: [
      { key: "name", label: "Provider Name", type: "text" },
      { key: "npi", label: "NPI", type: "text" },
      { key: "specialty", label: "Specialty", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "email", label: "Email", type: "email" },
   ],
   diagnosis_codes: [
      { key: "diagnosis_code", label: "Diagnosis Code", type: "text" },
      { key: "description", label: "Description", type: "text" },
      { key: "category", label: "Category", type: "text" },
   ],
   procedures: [
      { key: "procedure_code", label: "Procedure Code", type: "text" },
      { key: "description", label: "Description", type: "text" },
      { key: "specialty", label: "Specialty", type: "text" },
   ],
   modifiers: [
      { key: "modifier_code", label: "Modifier Code", type: "text" },
      { key: "modifier_name", label: "Modifier Name", type: "text" },
      { key: "description", label: "Description", type: "text" },
   ],
});

// ============================================================================
// PURE UTILITY FUNCTIONS (following Single Responsibility Principle)
// ============================================================================

const createIdColumn = () => ({
   header: "ID",
   accessorKey: "id",
   cell: ({ row }) => (
      <span className='font-mono text-xs'>{row.getValue("id")}</span>
   ),
});

const createDeletedDateColumn = () => ({
   header: "Deleted Date",
   accessorKey: "updated_at",
   cell: ({ row }) => (
      <div className='text-sm text-gray-600'>
         {new Date(row.getValue("updated_at")).toLocaleDateString()}
      </div>
   ),
});

const getTableColumns = (tableName) => {
   const specificColumns = TABLE_COLUMN_CONFIGS[tableName] || [
      { header: "Name", accessorKey: "name" },
   ];

   return [createIdColumn(), ...specificColumns, createDeletedDateColumn()];
};

const getTableLabel = (tableName) => {
   return (
      AVAILABLE_TABLES.find((t) => t.value === tableName)?.label || "Records"
   );
};

const getFormFields = (tableName) => {
   return TABLE_FORM_CONFIGS[tableName] || [];
};

// ============================================================================
// DATA SERVICE LAYER (following Dependency Inversion Principle)
// ============================================================================

class DeletedRecordsService {
   static async fetchDeletedRecords(tableName) {
      return await masterDataService.getDeletedRecords(tableName);
   }

   static async restoreRecord(tableName, id) {
      return await masterDataService.restoreRecord(tableName, id);
   }

   static async permanentlyDeleteRecord(tableName, id) {
      return await masterDataService.permanentlyDeleteRecord(tableName, id);
   }
}

// ============================================================================
// CUSTOM HOOKS (following Single Responsibility Principle)
// ============================================================================

const useDeletedRecords = (selectedTable) => {
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(false);
   const [refreshCounter, setRefreshCounter] = useState(0);

   const refresh = useCallback(() => {
      setRefreshCounter((prev) => prev + 1);
   }, []);

   const fetchData = useCallback(async () => {
      setLoading(true);
      try {
         console.log(`🔍 Fetching deleted data from table: ${selectedTable}`);
         const { data: records, error } =
            await DeletedRecordsService.fetchDeletedRecords(selectedTable);

         if (error) {
            throw new Error(error);
         }

         setData(records || []);
         console.log(
            `✅ Fetched ${
               records?.length || 0
            } deleted records from ${selectedTable}`
         );
      } catch (error) {
         console.error(`❌ Error fetching deleted records:`, error);
         setData([]);
      } finally {
         setLoading(false);
      }
   }, [selectedTable]);

   useEffect(() => {
      fetchData();
   }, [fetchData, refreshCounter]);

   return { data, loading, refresh };
};

const useRecordActions = (selectedTable, refresh) => {
   const [loading, setLoading] = useState(false);

   const processSelectedRows = useCallback((selectedRowsOrId, data) => {
      if (
         typeof selectedRowsOrId === "string" ||
         typeof selectedRowsOrId === "number"
      ) {
         const row = data.find((item) => item.id === selectedRowsOrId);
         return row ? [{ original: row }] : [];
      }

      if (Array.isArray(selectedRowsOrId)) {
         return selectedRowsOrId
            .map((id) => ({ original: data.find((item) => item.id === id) }))
            .filter((row) => row.original);
      }

      if (selectedRowsOrId && typeof selectedRowsOrId === "object") {
         return [{ original: selectedRowsOrId }];
      }

      return [];
   }, []);

   const handleRestore = useCallback(
      async (selectedRowsOrId, data) => {
         const selectedRows = processSelectedRows(selectedRowsOrId, data);

         if (selectedRows.length === 0) {
            alert("Please select at least one record to restore.");
            return;
         }

         const confirmMessage =
            selectedRows.length === 1
               ? "Are you sure you want to restore this record?"
               : `Are you sure you want to restore ${selectedRows.length} records?`;

         if (!window.confirm(confirmMessage)) return;

         setLoading(true);
         try {
            const promises = selectedRows.map(async (row) => {
               const { error } = await DeletedRecordsService.restoreRecord(
                  selectedTable,
                  row.original.id
               );
               if (error) throw new Error(error);
               return { status: "success", id: row.original.id };
            });

            const results = await Promise.all(promises);
            const successCount = results.filter(
               (r) => r.status === "success"
            ).length;

            alert(`${successCount} record(s) restored successfully`);
            refresh();
         } catch (error) {
            console.error("Restore error:", error);
            alert("Failed to restore records");
         } finally {
            setLoading(false);
         }
      },
      [processSelectedRows, selectedTable, refresh]
   );

   const handlePermanentDelete = useCallback(
      async (selectedRowsOrId, data) => {
         const selectedRows = processSelectedRows(selectedRowsOrId, data);

         if (selectedRows.length === 0) {
            alert("Please select at least one record to delete permanently.");
            return;
         }

         const confirmMessage =
            selectedRows.length === 1
               ? "⚠️ WARNING: Are you sure you want to permanently delete this record? This action cannot be undone!"
               : `⚠️ WARNING: Are you sure you want to permanently delete ${selectedRows.length} records? This action cannot be undone!`;

         if (!window.confirm(confirmMessage)) return;

         setLoading(true);
         try {
            const promises = selectedRows.map(async (row) => {
               const { error } =
                  await DeletedRecordsService.permanentlyDeleteRecord(
                     selectedTable,
                     row.original.id
                  );
               if (error) throw new Error(error);
               return { status: "success", id: row.original.id };
            });

            const results = await Promise.all(promises);
            const successCount = results.filter(
               (r) => r.status === "success"
            ).length;

            alert(`${successCount} record(s) deleted permanently`);
            refresh();
         } catch (error) {
            console.error("Permanent delete error:", error);
            alert("Failed to delete records permanently");
         } finally {
            setLoading(false);
         }
      },
      [processSelectedRows, selectedTable, refresh]
   );

   return { handleRestore, handlePermanentDelete, loading };
};

// ============================================================================
// STABLE CONFIGURATION OBJECTS (preventing re-renders)
// ============================================================================

const GENERIC_TABLE_CONFIG = Object.freeze({
   showAddButton: false,
   showEditButton: true,
   deleteButtonText: "Delete Permanently",
   deleteButtonVariant: "destructive",
});

const TABLE_BASE_CONFIG = Object.freeze({
   subtitle: "Manage soft-deleted records - restore or permanently delete",
   icon: Trash2,
   gradientColors: ["from-red-400", "to-red-600"],
   backgroundColor: "bg-red-50",
   emptyMessage: "No deleted records found",
});

// ============================================================================
// MAIN COMPONENT (following Open/Closed Principle)
// ============================================================================

const DeleteTable = () => {
   const [selectedTable, setSelectedTable] = useState("procedures");
   const [selectedRowIds, setSelectedRowIds] = useState([]);
   const [useNativeSelect, setUseNativeSelect] = useState(false);

   // Custom hooks for separation of concerns
   const {
      data,
      loading: dataLoading,
      refresh,
   } = useDeletedRecords(selectedTable);
   const {
      handleRestore,
      handlePermanentDelete,
      loading: actionLoading,
   } = useRecordActions(selectedTable, refresh);

   // Stable event handlers
   const handleTableChange = useCallback((newTable) => {
      console.log(`� Dropdown selection changed to ${newTable}`);
      setSelectedTable(newTable);
      setSelectedRowIds([]); // Clear selection when table changes
   }, []);

   const handleSelectedRowsChange = useCallback((newSelectedRows) => {
      setSelectedRowIds(newSelectedRows);
   }, []);

   // Stable computed values with proper memoization
   const columns = useMemo(
      () => getTableColumns(selectedTable),
      [selectedTable]
   );

   const tableConfig = useMemo(() => {
      const tableLabel = getTableLabel(selectedTable);
      const formFields = getFormFields(selectedTable);
      return {
         ...TABLE_BASE_CONFIG,
         title: `Deleted ${tableLabel}`,
         searchPlaceholder: `Search deleted ${tableLabel.toLowerCase()}...`,
         columns,
         formFields,
      };
   }, [selectedTable, columns]);

   const customActions = useMemo(
      () => [
         {
            label: "Restore",
            icon: RotateCcw,
            variant: "outline",
            className:
               "bg-green-50 hover:bg-green-100 text-green-700 border-green-300",
            onClick: (selectedRows) => handleRestore(selectedRows, data),
         },
      ],
      [handleRestore, data]
   );

   // Stable handlers for bulk actions
   const handleBulkRestore = useCallback(() => {
      if (selectedRowIds.length > 0) {
         handleRestore(selectedRowIds, data);
      } else {
         alert("Please select records to restore");
      }
   }, [selectedRowIds, handleRestore, data]);

   const handleBulkDelete = useCallback(() => {
      if (selectedRowIds.length > 0) {
         handlePermanentDelete(selectedRowIds, data);
      } else {
         alert("Please select records to permanently delete");
      }
   }, [selectedRowIds, handlePermanentDelete, data]);

   const isLoading = dataLoading || actionLoading;

   return (
      <div className='min-h-screen dark:bg-gray-950 p-6'>
         <div className='container mx-auto max-w-7xl'>
            {/* Header Section */}
            <div className='mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
               <div>
                  <h1 className='text-3xl font-bold text-primary'>
                     Deleted Records Management
                  </h1>
                  <p className='text-primary/80 mt-1'>
                     Restore accidentally deleted records or permanently remove
                     them
                  </p>
               </div>

               <div className='flex items-center gap-4'>
                  <div className='text-sm text-gray-600'>
                     Current selection: <strong>{selectedTable}</strong>
                  </div>

                  <Button
                     onClick={() => setUseNativeSelect(!useNativeSelect)}
                     variant='outline'
                     size='sm'
                     className='text-xs'
                  >
                     {useNativeSelect ? "Use Radix" : "Use Native"}
                  </Button>

                  {/* Table Selector */}
                  <TableSelector
                     selectedTable={selectedTable}
                     onTableChange={handleTableChange}
                     useNativeSelect={useNativeSelect}
                  />
               </div>
            </div>

            {/* Bulk Action Buttons */}
            <div className='mb-4 flex gap-2'>
               <Button
                  onClick={handleBulkRestore}
                  variant='outline'
                  className='bg-green-50 hover:bg-green-100 text-green-700 border-green-300'
                  disabled={selectedRowIds.length === 0 || isLoading}
               >
                  🔄 Restore Selected ({selectedRowIds.length})
               </Button>

               <Button
                  onClick={handleBulkDelete}
                  variant='destructive'
                  disabled={selectedRowIds.length === 0 || isLoading}
               >
                  🗑️ Delete Permanently ({selectedRowIds.length})
               </Button>
            </div>

            {/* Main Table */}
            <GenericTable
               {...tableConfig}
               {...GENERIC_TABLE_CONFIG}
               data={data}
               loading={isLoading}
               onDelete={(selectedRows) =>
                  handlePermanentDelete(selectedRows, data)
               }
               dataSource={selectedTable}
               onSelectedRowsChange={handleSelectedRowsChange}
               customActions={customActions}
            />
         </div>
      </div>
   );
};

// ============================================================================
// SUB-COMPONENTS (following Single Responsibility Principle)
// ============================================================================

const TableSelector = React.memo(
   ({ selectedTable, onTableChange, useNativeSelect }) => {
      const handleSelectTriggerClick = () => {
         console.log("🖱️ Select trigger clicked - dropdown should open");
      };

      const handleSelectOpenChange = (open) => {
         console.log(`🔽 Select dropdown ${open ? "opened" : "closed"}`);
      };

      if (useNativeSelect) {
         return (
            <select
               value={selectedTable}
               onChange={(e) => onTableChange(e.target.value)}
               className='w-[200px] px-3 py-2 border border-gray-300 rounded-md bg-white cursor-pointer focus:ring-2 focus:ring-blue-500'
            >
               {AVAILABLE_TABLES.map((table) => (
                  <option key={table.value} value={table.value}>
                     {table.label}
                  </option>
               ))}
            </select>
         );
      }

      return (
         <Select
            value={selectedTable}
            onValueChange={onTableChange}
            onOpenChange={handleSelectOpenChange}
         >
            <SelectTrigger
               className='w-[200px] cursor-pointer hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 border border-gray-300'
               onClick={handleSelectTriggerClick}
            >
               <SelectValue placeholder='Select table type'>
                  {AVAILABLE_TABLES.find((t) => t.value === selectedTable)
                     ?.label || "Select table type"}
               </SelectValue>
            </SelectTrigger>
            <SelectContent className='z-[9999]'>
               {AVAILABLE_TABLES.map((table) => (
                  <SelectItem
                     key={table.value}
                     value={table.value}
                     className='cursor-pointer hover:bg-gray-100'
                  >
                     {table.label}
                  </SelectItem>
               ))}
            </SelectContent>
         </Select>
      );
   }
);

TableSelector.displayName = "TableSelector";

export default DeleteTable;
