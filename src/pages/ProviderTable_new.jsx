import React, { useState } from "react";
import { ModernDataTable } from "@/components/ui/modern-data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaPlus, FaUserMd } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { providerData } from "@/data";

const ProviderTable = () => {
   const [data, setData] = useState(providerData);
   const [selectedRows, setSelectedRows] = useState([]);

   const [newProvider, setNewProvider] = useState({
      name: "",
      location: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
      npi: "",
      taxonomy_code: "",
      state_lic: "",
   });

   const columns = [
      {
         header: "Provider Name",
         accessorKey: "name",
         cell: ({ row }) => (
            <div className='font-semibold text-cyan-700'>
               {row.getValue("name")}
            </div>
         ),
      },
      {
         header: "Location",
         accessorKey: "location",
         cell: ({ row }) => (
            <span className='px-2 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800'>
               {row.getValue("location")}
            </span>
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
         header: "NPI",
         accessorKey: "npi",
         cell: ({ row }) => (
            <div className='font-mono text-sm text-gray-700'>
               {row.getValue("npi")}
            </div>
         ),
      },
      {
         header: "State License",
         accessorKey: "state_lic",
         cell: ({ row }) => (
            <div className='font-mono text-sm text-gray-700'>
               {row.getValue("state_lic")}
            </div>
         ),
      },
   ];

   const handleNewProviderChange = (e, field) => {
      setNewProvider({ ...newProvider, [field]: e.target.value });
   };

   const handleAddProvider = () => {
      const newId = Math.max(...data.map((item) => item.id), 0) + 1;
      const newData = { ...newProvider, id: newId };
      setData([...data, newData]);
      setNewProvider({
         name: "",
         location: "",
         address: "",
         city: "",
         state: "",
         zip: "",
         phone: "",
         npi: "",
         taxonomy_code: "",
         state_lic: "",
      });
      document.querySelector('[role="dialog"]')?.close();
   };

   const handleUpdate = (updatedData) => {
      setData(
         data.map((item) => (item.id === updatedData.id ? updatedData : item))
      );
   };

   const handleDelete = (ids) => {
      if (
         window.confirm(
            `Are you sure you want to delete ${ids.length} provider record(s)?`
         )
      ) {
         setData(data.filter((item) => !ids.includes(item.id)));
         setSelectedRows([]);
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
      a.download = "providers_data.csv";
      a.click();
   };

   return (
      <div className='min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-cyan-100 p-6'>
         <div className='container mx-auto max-w-7xl'>
            <Card className='shadow-2xl border-0 backdrop-blur-sm bg-white/80'>
               <CardHeader className='bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-t-lg'>
                  <div className='flex items-center justify-between'>
                     <div className='flex items-center gap-3'>
                        <div className='p-2 bg-white/20 rounded-lg'>
                           <FaUserMd className='h-6 w-6' />
                        </div>
                        <div>
                           <CardTitle className='text-2xl font-bold'>
                              Provider Management
                           </CardTitle>
                           <p className='text-cyan-100 mt-1'>
                              Manage healthcare providers and their credentials
                           </p>
                        </div>
                     </div>
                     <Modal
                        trigger={
                           <Button className='bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm'>
                              <FaPlus className='mr-2 h-4 w-4' /> Add Provider
                           </Button>
                        }
                        title='Add New Provider'
                        className='sm:max-w-[700px]'
                     >
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 max-h-[70vh] overflow-y-auto'>
                           {Object.keys(newProvider).map((key) => (
                              <div
                                 key={key}
                                 className={
                                    key === "address" ? "col-span-full" : ""
                                 }
                              >
                                 <label
                                    htmlFor={key}
                                    className='block text-sm font-medium text-cyan-700 mb-2'
                                 >
                                    {key.replace(/_/g, " ").toUpperCase()}
                                 </label>
                                 <Input
                                    id={key}
                                    placeholder={`Enter ${key.replace(
                                       /_/g,
                                       " "
                                    )}`}
                                    value={newProvider[key]}
                                    onChange={(e) =>
                                       handleNewProviderChange(e, key)
                                    }
                                    className='border-cyan-200 focus:border-cyan-500'
                                 />
                              </div>
                           ))}
                           <div className='col-span-full flex justify-end mt-4'>
                              <Button
                                 onClick={handleAddProvider}
                                 className='bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700'
                              >
                                 Save Provider
                              </Button>
                           </div>
                        </div>
                     </Modal>
                  </div>
               </CardHeader>
               <CardContent className='p-6'>
                  <ModernDataTable
                     data={data}
                     columns={columns}
                     onUpdate={handleUpdate}
                     onDelete={handleDelete}
                     onBulkDelete={handleBulkDelete}
                     onExport={handleExport}
                     selectedRows={selectedRows}
                     setSelectedRows={setSelectedRows}
                     searchPlaceholder='Search providers...'
                     emptyMessage='No provider records found'
                  />
               </CardContent>
            </Card>
         </div>
      </div>
   );
};

export default ProviderTable;
