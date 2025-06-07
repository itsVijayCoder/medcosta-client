import React from "react";
import GenericTable from "@/components/ui/generic-table";
import { tableConfigs } from "@/data/tableConfigs";
import { procedureData } from "@/data";

const ProcedureTable = () => {
   const config = tableConfigs.procedure;

   return <GenericTable {...config} data={procedureData} />;
};

export default ProcedureTable;
