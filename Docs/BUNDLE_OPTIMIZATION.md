# Bundle Optimization Guide

This document provides guidance on how to optimize bundle sizes and analyze the
build output for MedCosta Frontend application.

## Bundle Size Optimizations

We've implemented several strategies to optimize bundle size:

1. **Code Splitting with Dynamic Imports**

   -  Used React's `lazy()` and `Suspense` for component-level code splitting
   -  Route-based code splitting for page components
   -  Component-level code splitting for form step components

2. **Manual Chunk Configuration**

   -  Configured Rollup to split vendor code into logical chunks
   -  Grouped related libraries together (UI components, date libraries, etc.)

3. **Bundle Analysis**
   -  Added visualization tools to inspect bundle content and size

## Build Commands

-  `npm run build` - Standard production build
-  `npm run build:analyze` - Build with bundle analysis
-  `npm run analyze` - Open the bundle analysis report

## How to Analyze Bundle Size

1. Run the build with analysis enabled:

   ```
   npm run build:analyze
   ```

2. Open the generated report:

   ```
   npm run analyze
   ```

3. The report will show:
   -  Chunk sizes and dependencies
   -  Large modules that might need optimization
   -  Duplicate dependencies

## Further Optimization Techniques

If you still encounter large bundles:

1. **Library Replacement**

   -  Consider replacing heavy libraries with lighter alternatives
   -  Example: Replace full chart libraries with focused alternatives

2. **Tree Shaking**

   -  Import only what you need from libraries
   -  Replace `import Library from 'library'` with
      `import { specificComponent } from 'library'`

3. **Bundle Budget**

   -  Set stricter warning/error limits in vite.config.js
   -  Monitor bundle growth over time

4. **Asset Optimization**

   -  Optimize images and other assets
   -  Consider using WebP format for images
   -  Lazy load non-critical assets

5. **Service Worker / PWA**
   -  Implement caching strategies for static assets
   -  Consider adding PWA capabilities
