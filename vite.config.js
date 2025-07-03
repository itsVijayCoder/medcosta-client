import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
   plugins: [
      react(),
      visualizer({
         open: false, // Set to true to open the bundle report after build
         gzipSize: true,
         brotliSize: true,
      }),
   ],
   resolve: {
      alias: {
         "@": path.resolve(__dirname, "./src"),
      },
   },
   build: {
      sourcemap: false, // Set to true for development to debug more easily
      chunkSizeWarningLimit: 1000, // Only warn for chunks larger than 1000kb
      rollupOptions: {
         output: {
            manualChunks: {
               // Framework and core libraries
               "react-vendor": ["react", "react-dom", "react-router-dom"],

               // UI component libraries
               "radix-ui": [
                  "@radix-ui/react-collapsible",
                  "@radix-ui/react-dialog",
                  "@radix-ui/react-dropdown-menu",
                  "@radix-ui/react-label",
                  "@radix-ui/react-popover",
                  "@radix-ui/react-progress",
                  "@radix-ui/react-scroll-area",
                  "@radix-ui/react-select",
                  "@radix-ui/react-separator",
                  "@radix-ui/react-slot",
                  "@radix-ui/react-tooltip",
               ],

               // Calendar and date libraries
               calendar: [
                  "@fullcalendar/core",
                  "@fullcalendar/daygrid",
                  "@fullcalendar/interaction",
                  "@fullcalendar/react",
                  "@fullcalendar/timegrid",
                  "date-fns",
                  "react-day-picker",
               ],

               // Data table related libraries
               tables: [
                  "datatables.net-buttons-dt",
                  "datatables.net-dt",
                  "datatables.net-responsive-dt",
               ],

               // Visual and animation libraries
               "ui-effects": ["framer-motion", "recharts", "lucide-react"],

               // Utility libraries
               utils: [
                  "class-variance-authority",
                  "clsx",
                  "cmdk",
                  "tailwind-merge",
                  "tailwindcss-animate",
               ],
            },
         },
      },
   },
});
