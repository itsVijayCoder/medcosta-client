import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
   return twMerge(clsx(inputs));
}

import { fallbackData } from "@/data/static/fallbackData";

/**
 * Helper function to get data for tables with fallback to static data
 * @param {Object} apiResponse - The API response object {data, error}
 * @param {string} staticDataKey - The key to use for the static data from fallbackData.js
 * @returns {Promise<Array>} - A promise that resolves to the data array
 */
export async function getTableDataWithFallback(apiResponse, staticDataKey) {
   console.log(
      `getTableDataWithFallback called for ${staticDataKey}`,
      apiResponse
   );
   const { data, error } = apiResponse || {};

   if (error) {
      console.error(`Error fetching ${staticDataKey}:`, error);
      return fallbackData[staticDataKey] || [];
   }

   // If we have API data, use it
   if (data && Array.isArray(data) && data.length > 0) {
      console.log(`Using data from API for ${staticDataKey}:`, data);
      return data;
   }

   console.log(`No API data for ${staticDataKey}, falling back to static data`);

   // Use directly imported fallback data instead of dynamic import
   const staticData = fallbackData[staticDataKey];
   if (staticData && staticData.length > 0) {
      console.log(`Using static data for ${staticDataKey}:`, staticData);
      return staticData;
   }

   // If all else fails, return empty array
   console.warn(
      `No data available for ${staticDataKey}, returning empty array`
   );
   return [];
}
