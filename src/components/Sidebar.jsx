import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaChartBar,
  FaUser,
  FaFileAlt,
  FaCalendarAlt,
  FaCog,
  FaFolderOpen,
} from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import logoImage from "../assets/logo.png";

// Add this new component at the top
const SidebarHeader = () => (
  <div className="sticky top-0 z-10 bg-[#fff] border-b border-gray-700 px-4 py-3 w-full">
    <div className="flex items-center gap-3">
      <img src={logoImage} alt="Logo" className="h-10 w-10" />
      <h2 className="text-lg font-semibold text-black">WorkNoFault</h2>
    </div>
  </div>
);

// Update MenuItem component
const MenuItem = ({ icon: Icon, label, onClick, isActive }) => (
  <Button
    variant="ghost"
    className={`w-full justify-start gap-3 ${
      isActive 
        ? "bg-blue-600 text-white hover:bg-blue-700" 
        : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`}
    onClick={onClick}
  >
    <Icon className="h-4 w-4" />
    {label}
  </Button>
);

// Update SubMenuItem component
const SubMenuItem = ({ label, onClick, isActive }) => (
  <Button
    variant="ghost"
    className={`w-full justify-start pl-9 text-sm ${
      isActive 
        ? "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30" 
        : "text-gray-400 hover:bg-gray-800 hover:text-white"
    }`}
    onClick={onClick}
  >
    {label}
  </Button>
);

// Update SidebarContent component
const Sidebar = ({ setRouteName }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleNavigate = (path, name) => {
    navigate(path);
    setRouteName(name);
    setIsMobileOpen(false);
  };

  const menuItems = [
    {
      icon: FaChartBar,
      label: "Dashboard",
      path: "/",
    },
    {
      icon: FaFolderOpen,
      label: "Data Entry",
      submenu: [
        { label: "Patient Entry", path: "/dataentry/patient-entry" },
        { label: "Insurance Company Master", path: "/dataentry/insurance-master" },
        { label: "Location", path: "/dataentry/location" },
        { label: "Diagnosis Code", path: "/dataentry/diagnosis-code" },
        { label: "Procedure Master", path: "/dataentry/procedure-master" },
        { label: "Provider Master", path: "/dataentry/provider-master" },
        { label: "Modifier Master", path: "/dataentry/modifier-master" },
        { label: "Delete Visit", path: "/dataentry/delete-visit" },
      ],
    },
    {
      icon: FaFileAlt,
      label: "Reports",

    },
    {
      icon: FaUser,
      label: "Patients",
      path: "/Patients",
    },
    {
      icon: FaCalendarAlt,
      label: "Appointments",
      submenu: [
        { label: "New Appoinment", path: "/appointments/new" },
        { label: "Insurance Company Master", path: "/appointments/search" },
     
      ],
    },
    {
      icon: FaCog,
      label: "Quick Links",
      path: "/Quick Links",
    },
  ];

  const SidebarContent = () => (
    <div className="flex min-h-full flex-col bg-[#111]">
      {/* <SidebarHeader /> */}
      
      <div className="flex-1 space-y-1 px-2 py-3 overflow-y-auto">
        {menuItems.map((item) => (
          item.submenu ? (
            <Collapsible
              key={item.label}
              open={openMenu === item.label}
              onOpenChange={() => setOpenMenu(openMenu === item.label ? null : item.label)}
            >
              <CollapsibleTrigger asChild>
                <MenuItem
                  icon={item.icon}
                  label={item.label}
                  isActive={location.pathname.startsWith(item.path)}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1">
                {item.submenu.map((subItem) => (
                  <SubMenuItem
                    key={subItem.path}
                    label={subItem.label}
                    onClick={() => handleNavigate(subItem.path, subItem.label)}
                    isActive={location.pathname === subItem.path}
                  />
                ))}
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <MenuItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              onClick={() => handleNavigate(item.path, item.label)}
              isActive={location.pathname === item.path}
            />
          )
        ))}
      </div>

      <div className="sticky bottom-0 px-2 py-3 border-t border-gray-700 bg-[#111]">
        <Button
          variant="ghost"
          className="w-full gap-2 text-gray-300 hover:bg-gray-800 hover:text-white"
          onClick={() => handleNavigate("/")}
        >
          <IoMdLogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" className="md:hidden text-white">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-[#111] border-r border-gray-700">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <div className="hidden h-screen fixed w-64 border-r border-gray-700 bg-[#111] lg:block">
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;
