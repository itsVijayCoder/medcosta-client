import React from "react";
import { Bell, User, ChevronDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";

const Header = () => {
   const { state } = useSidebar();
   const isCollapsed = state === "collapsed";

   return (
      <>
         <Separator orientation='vertical' className='mr-2 h-4' />
         <div className='flex items-center justify-between flex-1'>
            <div className='flex items-center gap-3'>
               {/* Show title only when sidebar is collapsed */}
               {isCollapsed && (
                  <div className='flex flex-col animate-in slide-in-from-left-2 duration-200'>
                     <h1 className='text-xl font-bold text-foreground tracking-tight'>
                        WorkNoFault
                     </h1>
                     <p className='text-xs text-muted-foreground font-medium'>
                        Healthcare Management
                     </p>
                  </div>
               )}
            </div>

            <div className='flex items-center gap-3'>
               {/* Search shortcut hint */}
               {/* <div className='hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-md text-xs text-muted-foreground'>
                  <span>Search</span>
                  <kbd className='pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100'>
                     <span className='text-xs'>⌘</span>K
                  </kbd>
               </div> */}

               {/* Notifications */}
               <button className='relative p-2.5 hover:bg-accent/80 rounded-lg transition-colors duration-200 group'>
                  <Bell className='h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors' />
                  <span className='absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full animate-pulse'></span>
                  <span className='absolute top-1.5 right-1.5 h-2 w-2 bg-red-500/30 rounded-full animate-ping'></span>
               </button>

               {/* User Profile */}
               {/* <div className='flex items-center gap-2 p-1.5 hover:bg-accent/80 rounded-lg transition-colors duration-200 cursor-pointer group'>
                  <div className='h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center ring-2 ring-background shadow-sm'>
                     <User className='h-4 w-4 text-white' />
                  </div>
                  <div className='hidden md:flex flex-col text-left'>
                     <span className='text-sm font-medium text-foreground'>
                        Dr. Smith
                     </span>
                     <span className='text-xs text-muted-foreground'>
                        Administrator
                     </span>
                  </div>
                  <ChevronDown className='h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors hidden md:block' />
               </div> */}
            </div>
         </div>
      </>
   );
};

export default Header;
