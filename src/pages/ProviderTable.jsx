import React from "react";
import GenericTable from "@/components/ui/generic-table";
import { tableConfigs } from "@/data/tableConfigs";
import { providerData } from "@/data";

const ProviderTable = () => {
   const config = tableConfigs.provider;

   return <GenericTable {...config} data={providerData} />;
};

export default ProviderTable;
