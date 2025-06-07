import React from "react";

export const LoadingSpinner = () => {
   return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
         <div className='flex flex-col items-center'>
            <div className='w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
            <p className='text-lg text-gray-700 mt-4'>Loading...</p>
         </div>
      </div>
   );
};

export default LoadingSpinner;
