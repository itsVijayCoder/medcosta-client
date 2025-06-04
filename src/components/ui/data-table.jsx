import React, { useEffect } from "react";
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
import { FaEdit, FaTrash, FaSave } from "react-icons/fa";
import jQuery from "jquery";
import "datatables.net-dt";
import "datatables.net-buttons-dt";
import "datatables.net-responsive-dt";
import "datatables.net-dt/css/dataTables.dataTables.css";  // Updated import path

window.$ = window.jQuery = jQuery;

export function DataTable({
  data,
  columns,
  editId,
  editedData,
  onEdit,
  onSave,
  onDelete,
  onInputChange,
}) {
  useEffect(() => {
    const table = window.$("#dynamicTable");
    
    if (data.length > 0) {
      if ($.fn.DataTable.isDataTable(table)) {
        table.DataTable().destroy();
      }
      
      table.DataTable({
        responsive: true,
        dom: 'Bfrtip',
        buttons: ['copy', 'csv', 'excel', 'pdf', 'print']
      });
    }

    return () => {
      if ($.fn.DataTable.isDataTable(table)) {
        table.DataTable().destroy();
      }
    };
  }, [data]);

  return (
    <div className="rounded-md border">
      <Table id="dynamicTable">
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.accessorKey}>{column.header}</TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              {columns.map((column) => (
                <TableCell key={column.accessorKey}>
                  {editId === row.id ? (
                    <Input
                      type="text"
                      value={editedData[column.accessorKey]}
                      onChange={(e) => onInputChange(e, column.accessorKey)}
                      className="max-w-sm"
                    />
                  ) : (
                    row[column.accessorKey]
                  )}
                </TableCell>
              ))}
              <TableCell>
                <div className="flex gap-2">
                  {editId === row.id ? (
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={onSave}
                    >
                      <FaSave className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => onEdit(row.id, row)}
                    >
                      <FaEdit className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => onDelete(row.id)}
                  >
                    <FaTrash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}