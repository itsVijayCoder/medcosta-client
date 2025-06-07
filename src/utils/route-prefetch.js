/**
 * Utility for prefetching routes to improve loading performance
 */

/**
 * Prefetches the given component by initiating its lazy loading
 *
 * @param {Function} importFn - The import function for the component
 * @returns {Promise} A promise that resolves when the component is loaded
 */
export const prefetchComponent = (importFn) => {
   // This initiates the component loading without rendering it
   return importFn();
};

/**
 * Prefetches multiple components in parallel
 *
 * @param {Array<Function>} importFns - Array of import functions
 * @returns {Promise} A promise that resolves when all components are loaded
 */
export const prefetchComponents = (importFns) => {
   return Promise.all(importFns.map(prefetchComponent));
};

/**
 * Prefetches common routes used in the application
 */
export const prefetchCommonRoutes = () => {
   // This will run in the background without blocking the UI
   setTimeout(() => {
      // Add more commonly accessed routes here as needed
      prefetchComponents([
         () => import("../pages/Dashboard"),
         () => import("../pages/PatientRegistration"),
         () => import("../components/form-steps/PersonalInfoStep"),
      ]);
   }, 1000); // Delay by 1 second to allow initial rendering to complete
};
