import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen">
       <Header />
      <Sidebar setRouteName={() => {}} />
      <div className="lg:ml-64">
       
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
