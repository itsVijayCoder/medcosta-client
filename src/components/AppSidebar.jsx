import { useState, useContext, useRef, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
   Users,
   FileText,
   Calendar,
   Settings,
   FolderOpen,
   LogOut,
   Home,
   Building2,
   Stethoscope,
   Activity,
   Plus,
   Trash2,
   Search,
   X,
   ChevronRight,
   User,
   ChevronDown,
} from "lucide-react";

import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarGroup,
   SidebarGroupLabel,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarMenuSub,
   SidebarMenuSubButton,
   SidebarMenuSubItem,
   SidebarRail,
} from "@/components/ui/sidebar";
import {
   Collapsible,
   CollapsibleContent,
   CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/App";
import logoImage from "../assets/logo.png";

// Menu items configuration
const menuItems = [
   {
      icon: Home,
      label: "Dashboard",
      path: "/",
   },
   {
      icon: FolderOpen,
      label: "Data Entry",
      submenu: [
         {
            label: "Patient Entry",
            path: "/dataentry/patient-entry",
            icon: Users,
         },
         {
            label: "Insurance Company Master",
            path: "/dataentry/insurance-master",
            icon: Building2,
         },
         {
            label: "Location",
            path: "/dataentry/location",
            icon: Building2,
         },
         {
            label: "Diagnosis Code",
            path: "/dataentry/diagnosis-code",
            icon: Activity,
         },
         {
            label: "Procedure Master",
            path: "/dataentry/procedure-master",
            icon: Stethoscope,
         },
         {
            label: "Provider Master",
            path: "/dataentry/provider-master",
            icon: Users,
         },
         {
            label: "Modifier Master",
            path: "/dataentry/modifier-master",
            icon: Settings,
         },
         {
            label: "Delete Visit",
            path: "/dataentry/delete-visit",
            icon: Trash2,
         },
      ],
   },
   {
      icon: FileText,
      label: "Reports",
      path: "/reports",
   },
   {
      icon: Users,
      label: "Patients",
      path: "/Patients",
   },
   {
      icon: Calendar,
      label: "Appointments",
      submenu: [
         {
            label: "New Appointment",
            path: "/appointments/new",
            icon: Plus,
         },
         {
            label: "Search Appointments",
            path: "/appointments/search",
            icon: Building2,
         },
      ],
   },
   {
      icon: Settings,
      label: "Quick Links",
      path: "/Quick Links",
   },
];

// Search Component
const SidebarSearch = ({ searchTerm, setSearchTerm, onClear, inputRef }) => (
   <div className='relative px-3 py-2'>
      <Search className='absolute left-6 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/40' />
      <Input
         ref={inputRef}
         placeholder='Search navigation...'
         value={searchTerm}
         onChange={(e) => setSearchTerm(e.target.value)}
         className='pl-8 pr-10 h-9 bg-sidebar-accent/30 border-sidebar-border focus:bg-sidebar-accent/50 text-sidebar-foreground placeholder:text-sidebar-foreground/50'
      />
      {searchTerm && (
         <Button
            variant='ghost'
            size='icon'
            onClick={onClear}
            className='absolute right-4 top-1/2 transform -translate-y-1/2 h-7 w-7 text-sidebar-foreground/40 hover:text-sidebar-foreground'
         >
            <X className='h-3 w-3' />
         </Button>
      )}
   </div>
);

export function AppSidebar({ setRouteName, ...props }) {
   const navigate = useNavigate();
   const location = useLocation();
   const { logout } = useContext(AuthContext);
   const [searchTerm, setSearchTerm] = useState("");
   const [highlightedIndex, setHighlightedIndex] = useState(-1);
   const [openMenus, setOpenMenus] = useState(new Set());
   const searchInputRef = useRef(null);

   const handleNavigate = useCallback(
      (path, name) => {
         navigate(path);
         setRouteName(name);
         setSearchTerm("");
         setHighlightedIndex(-1);
      },
      [navigate, setRouteName]
   );

   const toggleMenu = (menuLabel) => {
      const newOpenMenus = new Set(openMenus);
      if (newOpenMenus.has(menuLabel)) {
         newOpenMenus.delete(menuLabel);
      } else {
         newOpenMenus.add(menuLabel);
      }
      setOpenMenus(newOpenMenus);
   };

   // Search and filter functionality
   const filterMenuItems = (items, searchTerm) => {
      if (!searchTerm) return items;

      return items.reduce((filtered, item) => {
         const itemMatches = item.label
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

         if (item.submenu) {
            const filteredSubmenu = item.submenu.filter((subItem) =>
               subItem.label.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (itemMatches || filteredSubmenu.length > 0) {
               filtered.push({
                  ...item,
                  submenu:
                     filteredSubmenu.length > 0
                        ? filteredSubmenu
                        : item.submenu,
               });
            }
         } else if (itemMatches) {
            filtered.push(item);
         }

         return filtered;
      }, []);
   };

   // Get all navigatable items for keyboard navigation
   const getAllNavigatableItems = (items) => {
      const navigatable = [];
      items.forEach((item) => {
         if (item.path) {
            navigatable.push({
               type: "main",
               item,
               path: item.path,
               label: item.label,
            });
         }
         if (item.submenu) {
            item.submenu.forEach((subItem) => {
               navigatable.push({
                  type: "sub",
                  item: subItem,
                  path: subItem.path,
                  label: subItem.label,
               });
            });
         }
      });
      return navigatable;
   };

   const filteredMenuItems = filterMenuItems(menuItems, searchTerm);
   const navigatableItems = getAllNavigatableItems(filteredMenuItems);

   // Auto-expand menus when search matches sub-items
   useEffect(() => {
      if (searchTerm) {
         const newOpenMenus = new Set();
         filteredMenuItems.forEach((item) => {
            if (item.submenu) {
               const hasMatchingSubItem = item.submenu.some((subItem) =>
                  subItem.label.toLowerCase().includes(searchTerm.toLowerCase())
               );
               if (
                  hasMatchingSubItem ||
                  item.label.toLowerCase().includes(searchTerm.toLowerCase())
               ) {
                  newOpenMenus.add(item.label);
               }
            }
         });
         setOpenMenus(newOpenMenus);
         setHighlightedIndex(-1);
      }
   }, [searchTerm, filteredMenuItems]);

   // Keyboard navigation
   const handleKeyDown = useCallback(
      (e) => {
         if (
            !searchInputRef.current ||
            document.activeElement !== searchInputRef.current
         ) {
            return;
         }

         switch (e.key) {
            case "ArrowDown":
               e.preventDefault();
               setHighlightedIndex((prev) =>
                  prev < navigatableItems.length - 1 ? prev + 1 : 0
               );
               break;
            case "ArrowUp":
               e.preventDefault();
               setHighlightedIndex((prev) =>
                  prev > 0 ? prev - 1 : navigatableItems.length - 1
               );
               break;
            case "Enter":
               e.preventDefault();
               if (
                  highlightedIndex >= 0 &&
                  navigatableItems[highlightedIndex]
               ) {
                  const selected = navigatableItems[highlightedIndex];
                  handleNavigate(selected.path, selected.label);
               }
               break;
            case "Escape":
               e.preventDefault();
               setSearchTerm("");
               setHighlightedIndex(-1);
               searchInputRef.current?.blur();
               break;
         }
      },
      [highlightedIndex, navigatableItems, handleNavigate]
   );

   useEffect(() => {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
   }, [handleKeyDown]);

   // Check if item should be highlighted
   const isItemHighlighted = (path) => {
      if (highlightedIndex < 0 || !navigatableItems[highlightedIndex])
         return false;
      return navigatableItems[highlightedIndex].path === path;
   };

   return (
      <Sidebar
         variant='sidebar'
         {...props}
         className='group-data-[side=left]:border-r-0'
      >
         {/* Header */}
         <SidebarHeader className='bg-white dark:bg-gray-950 relative overflow-hidden'>
            {/* Background Pattern */}
            <div className='absolute inset-0 opacity-5'>
               <div className='absolute inset-0 bg-primary/5'></div>
               <div className='absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,var(--primary)/0.05,transparent_50%)]'></div>
            </div>

            <div className='flex items-center gap-3 px-3 py-1 relative z-10'>
               <div className='relative group'>
                  <div className='h-10 w-10 bg-primary-gradient rounded-xl flex items-center justify-center shadow-lg transform transition-transform duration-200 group-hover:scale-105 ring-2 ring-white/20'>
                     <div className='text-white font-bold text-lg'>W</div>
                  </div>
                  <div className='absolute -top-1 -right-1 h-3 w-3 bg-primary-400 rounded-full shadow-sm animate-pulse border border-white'></div>
               </div>
               <div className='group-data-[collapsible=icon]:hidden'>
                  <h2 className='text-lg font-bold text-primary-800 dark:text-primary-200 tracking-tight'>
                     WorkNoFault
                  </h2>
                  <p className='text-xs text-primary-600 dark:text-primary-300 font-medium'>
                     Healthcare Management
                  </p>
               </div>
            </div>
         </SidebarHeader>

         {/* Content */}
         <SidebarContent className='bg-white dark:bg-gray-950 relative'>
            {/* Subtle overlay pattern */}
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--primary)/0.02,transparent_70%)] pointer-events-none'></div>

            {/* Search */}
            {/* <SidebarSearch
               searchTerm={searchTerm}
               setSearchTerm={setSearchTerm}
               onClear={() => {
                  setSearchTerm("");
                  setHighlightedIndex(-1);
               }}
               inputRef={searchInputRef}
            /> */}

            {/* Search Results Info */}
            {searchTerm && (
               <div className='px-3 py-1 text-xs text-sidebar-foreground/60'>
                  {filteredMenuItems.length === 0
                     ? "No results found"
                     : `${navigatableItems.length} result${
                          navigatableItems.length !== 1 ? "s" : ""
                       } found`}
               </div>
            )}

            {/* Navigation */}
            <SidebarGroup className='px-2 relative z-10'>
               {/* <SidebarGroupLabel>Navigation</SidebarGroupLabel> */}
               <SidebarMenu className='space-y-1'>
                  {filteredMenuItems.map((item) => {
                     const isMenuOpen = openMenus.has(item.label);
                     const isItemActive =
                        item.path && location.pathname === item.path;
                     const hasActiveChild = item.submenu?.some(
                        (subItem) => location.pathname === subItem.path
                     );
                     const isActive = isItemActive;
                     const isHighlighted =
                        item.path && isItemHighlighted(item.path);

                     return item.submenu ? (
                        <Collapsible
                           key={item.label}
                           open={isMenuOpen}
                           onOpenChange={() => toggleMenu(item.label)}
                           asChild
                        >
                           <SidebarMenuItem>
                              <CollapsibleTrigger asChild>
                                 <SidebarMenuButton
                                    tooltip={item.label}
                                    isActive={isActive}
                                    className={`
                                       h-11 rounded-xl transition-all duration-200 
                                       ${
                                          isActive
                                             ? "bg-primary-400 text-primary-foreground shadow-menu-active transform scale-105"
                                             : "hover:bg-primary/10 hover:text-primary dark:hover:bg-sidebar-accent hover:shadow-sm"
                                       }
                                       ${
                                          isHighlighted
                                             ? "ring-2 ring-primary-300 bg-primary-50 shadow-glow-primary"
                                             : ""
                                       }
                                    `}
                                 >
                                    <item.icon className='h-4 w-4' />
                                    <span className='font-medium'>
                                       {item.label}
                                    </span>
                                    <ChevronRight
                                       className={`ml-auto h-4 w-4 transition-transform duration-200 ${
                                          isMenuOpen ? "rotate-90" : ""
                                       }`}
                                    />
                                 </SidebarMenuButton>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                 <SidebarMenuSub className='ml-4 mt-1 space-y-1'>
                                    {item.submenu.map((subItem) => (
                                       <SidebarMenuSubItem key={subItem.path}>
                                          <SidebarMenuSubButton
                                             asChild
                                             isActive={
                                                location.pathname ===
                                                subItem.path
                                             }
                                             className={`
                                                h-9 w-full rounded-lg transition-all duration-200
                                                ${
                                                   location.pathname ===
                                                   subItem.path
                                                      ? "bg-primary text-primary-foreground shadow-menu-active"
                                                      : "hover:bg-primary/20 hover:text-primary dark:hover:bg-sidebar-accent hover:shadow-sm"
                                                }
                                                ${
                                                   isItemHighlighted(
                                                      subItem.path
                                                   )
                                                      ? "ring-2 ring-primary bg-primary shadow-glow-primary"
                                                      : ""
                                                }
                                             `}
                                          >
                                             <button
                                                onClick={() =>
                                                   handleNavigate(
                                                      subItem.path,
                                                      subItem.label
                                                   )
                                                }
                                             >
                                                {subItem.icon && (
                                                   <subItem.icon className='h-3.5 w-3.5' />
                                                )}
                                                <span className='font-medium'>
                                                   {subItem.label}
                                                </span>
                                             </button>
                                          </SidebarMenuSubButton>
                                       </SidebarMenuSubItem>
                                    ))}
                                 </SidebarMenuSub>
                              </CollapsibleContent>
                           </SidebarMenuItem>
                        </Collapsible>
                     ) : (
                        <SidebarMenuItem key={item.label}>
                           <SidebarMenuButton
                              tooltip={item.label}
                              isActive={isActive}
                              onClick={() =>
                                 handleNavigate(item.path, item.label)
                              }
                              className={`
                                 h-11 rounded-xl transition-all duration-200 
                                 ${
                                    isActive
                                       ? "bg-primary text-primary-foreground shadow-menu-active transform scale-105"
                                       : "hover:bg-primary/20 hover:text-primary dark:hover:bg-sidebar-accent hover:shadow-sm"
                                 }
                                 ${
                                    isHighlighted
                                       ? "ring-2 ring-primary/10 bg-primary shadow-glow-primary"
                                       : ""
                                 }
                              `}
                           >
                              <item.icon className='h-4 w-4' />
                              <span className='font-medium'>{item.label}</span>
                           </SidebarMenuButton>
                        </SidebarMenuItem>
                     );
                  })}
               </SidebarMenu>
            </SidebarGroup>
         </SidebarContent>

         {/* Footer */}
         <SidebarFooter className='bg-white dark:bg-gray-950 p-2 relative overflow-hidden border-t border-gray-100 dark:border-gray-800'>
            {/* Background Pattern */}
            <div className='absolute inset-0 opacity-5'>
               <div className='absolute inset-0 bg-primary/5'></div>
            </div>

            <SidebarMenu className='relative z-10'>
               <SidebarMenuItem className='space-y-1'>
                  <div className='flex items-center justify-between gap-2 p-1.5 hover:bg-accent/80 rounded-lg transition-colors duration-200 cursor-pointer group'>
                     <div className='flex items-center gap-2'>
                        <div className='h-8 w-8 bg-primary-gradient rounded-full flex items-center justify-center ring-2 ring-background shadow-sm'>
                           <User className='h-4 w-4 text-primary-foreground' />
                        </div>
                        <div className='hidden md:flex flex-col text-left'>
                           <span className='text-sm font-medium text-foreground'>
                              Dr. Smith
                           </span>
                           <span className='text-xs text-muted-foreground'>
                              Administrator
                           </span>
                        </div>
                     </div>
                     <ChevronRight className='h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors hidden md:block' />
                  </div>
                  <SidebarMenuButton
                     onClick={() => {
                        logout();
                        navigate("/login");
                     }}
                     className='h-11 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive dark:text-destructive dark:hover:bg-destructive/20 transition-all duration-200 font-medium group'
                  >
                     <LogOut className='h-4 w-4 transition-transform group-hover:scale-110' />
                     <span>Logout</span>
                  </SidebarMenuButton>
               </SidebarMenuItem>
            </SidebarMenu>
         </SidebarFooter>

         <SidebarRail />
      </Sidebar>
   );
}
