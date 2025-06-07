import React from "react";
import GenericTable from "@/components/ui/generic-table";
import { tableConfigs } from "@/data/tableConfigs";
import { insuranceData } from "@/data";

const InsuranceTable = () => {
   const config = tableConfigs.insurance;

   return <GenericTable {...config} data={insuranceData} />;
};

export default InsuranceTable;
