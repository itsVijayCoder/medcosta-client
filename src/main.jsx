import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { LoadingSpinner } from "./components/ui/loading-spinner";

// Add a global error boundary for lazy-loaded components
class ErrorBoundary extends React.Component {
   constructor(props) {
      super(props);
      this.state = { hasError: false };
   }

   static getDerivedStateFromError(error) {
      return { hasError: true };
   }

   componentDidCatch(error, errorInfo) {
      console.error("Application error:", error, errorInfo);
   }

   render() {
      if (this.state.hasError) {
         return (
            <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
               <div className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center'>
                  <h2 className='text-2xl font-bold text-red-600 mb-4'>
                     Something went wrong
                  </h2>
                  <p className='text-gray-700 mb-4'>
                     The application encountered an error.
                  </p>
                  <button
                     onClick={() => window.location.reload()}
                     className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition'
                  >
                     Reload Application
                  </button>
               </div>
            </div>
         );
      }

      return this.props.children;
   }
}

ReactDOM.createRoot(document.getElementById("root")).render(
   <React.StrictMode>
      <ErrorBoundary>
         <Suspense fallback={<LoadingSpinner />}>
            <BrowserRouter>
               <App />
            </BrowserRouter>
         </Suspense>
      </ErrorBoundary>
   </React.StrictMode>
);
