import React from "react";
import { Bell, User } from "lucide-react";
import logoImage from "../assets/logo.png";

const Header = () => {
   return (
      <div className='sticky top-0 z-50 bg-zinc-400 px-4 py-3'>
         <div className='flex items-center justify-between max-w-[1400px] mx-auto'>
            <div className='flex items-center gap-3'>
               {/* <img src={logoImage} alt="Logo" className="h-10 w-10" /> */}
               <h2 className='text-lg font-semibold text-gray-900'>
                  WorkNoFault
               </h2>
            </div>

            <div className='flex items-center gap-4'>
               <button className='p-2 hover:bg-gray-100 rounded-full relative'>
                  <Bell className='h-5 w-5 text-gray-600' />
                  <span className='absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full'></span>
               </button>

               <button className='flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full'>
                  <div className='h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center'>
                     <User className='h-5 w-5 text-gray-600' />
                  </div>
               </button>
            </div>
         </div>
      </div>
   );
};

export default Header;
