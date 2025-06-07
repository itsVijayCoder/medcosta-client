import React from "react";
import GenericTable from "@/components/ui/generic-table";
import { tableConfigs } from "@/data/tableConfigs";
import { diagnosisData } from "@/data";

const DiagnosisTable = () => {
   const config = tableConfigs.diagnosis;

   return <GenericTable {...config} data={diagnosisData} />;
};

export default DiagnosisTable;
