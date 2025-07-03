import { AppSidebar } from "@/components/AppSidebar";
import Header from "@/components/Header";
import {
   SidebarProvider,
   SidebarInset,
   SidebarTrigger,
} from "@/components/ui/sidebar";
import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
   return (
      <SidebarProvider>
         <AppSidebar setRouteName={() => {}} />
         <SidebarInset>
            {/* Sticky Header with Glass Effect */}
            <header className='sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-0 shadow-sm bg-background/80 backdrop-blur-xl transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 supports-[backdrop-filter]:bg-background/60'>
               <div className='flex items-center gap-2 px-4 w-full'>
                  <SidebarTrigger className='-ml-1' />
                  <Header />
               </div>
               {/* Subtle gradient overlay for depth */}
               <div className='absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent' />
            </header>

            {/* Main Content Area */}
            <div className='flex flex-1 flex-col'>
               <main className='flex-1 space-y-4 '>
                  <Outlet />
               </main>
            </div>
         </SidebarInset>
      </SidebarProvider>
   );
};

export default Layout;
