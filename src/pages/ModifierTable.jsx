import React from "react";
import GenericTable from "@/components/ui/generic-table";
import { tableConfigs } from "@/data/tableConfigs";
import { modifierData } from "@/data";

const ModifierTable = () => {
   const config = tableConfigs.modifier;

   return <GenericTable {...config} data={modifierData} />;
};

export default ModifierTable;
