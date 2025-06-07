import React, { useState } from "react";
import {
   Bell,
   Search,
   Settings,
   TrendingUp,
   Users,
   UserPlus,
   DollarSign,
   Calendar,
   Activity,
   Heart,
   FileText,
} from "lucide-react";
import AuthStatus from "@/components/AuthStatus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import {
   BarChart,
   Bar,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   Legend,
   ResponsiveContainer,
   LineChart,
   Line,
   PieChart,
   Pie,
   Cell,
} from "recharts/lib/index";
import { StatCard } from "@/components/ui/stat-card";
import { SurgeryStats } from "@/components/ui/surgery-stats";
import { DoctorsList } from "@/components/ui/doctors-list";
import { statsData, chartData, patientSampleData, doctors } from "@/data";

const Dashboard = () => {
   const [search, setSearch] = useState("");
   const [selectedTimeRange, setSelectedTimeRange] = useState("12 months");

   const filteredDoctors = doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(search.toLowerCase())
   );

   // Chart data from static data
   const chartDataFormatted = chartData.months.map((month, index) => ({
      name: month,
      Completed: chartData.completedData[index],
      Active: chartData.activeData[index],
      New: chartData.newData[index],
   }));

   // Enhanced stats with icons mapping
   const iconMap = {
      Users,
      UserPlus,
      DollarSign,
      Activity,
   };

   const enhancedStats = statsData.map((stat) => ({
      ...stat,
      icon: iconMap[stat.icon] || Users,
   }));
   return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'>
         <div className='p-6 space-y-6'>
            {/* Auth Status - For development purposes only */}
            {/* {process.env.NODE_ENV !== "production" && <AuthStatus />} */}
            {/* Modern Header Section */}
            <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
               <div className='flex-1'>
                  <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2'>
                     Healthcare Dashboard
                  </h1>
                  <p className='text-gray-600 text-lg'>
                     Welcome back! Here's what's happening at your clinic today.
                  </p>
               </div>

               <div className='flex items-center gap-4'>
                  <div className='relative'>
                     <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
                     <Input
                        placeholder='Search patients, doctors...'
                        className='pl-10 w-80 h-12 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                     />
                  </div>

                  {/* <div className='flex items-center gap-3'>
                     <DropdownMenu>
                        <DropdownMenuTrigger className='focus:outline-none'>
                           <div className='relative p-3 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors'>
                              <Bell className='h-6 w-6 text-blue-600' />
                              <div className='absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center'>
                                 <span className='text-xs text-white font-medium'>
                                    3
                                 </span>
                              </div>
                           </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='w-80'>
                           <DropdownMenuItem className='p-4'>
                              <div className='space-y-1'>
                                 <p className='font-medium'>
                                    New Patient Alert
                                 </p>
                                 <p className='text-sm text-gray-600'>
                                    John Doe registered for emergency
                                    consultation
                                 </p>
                              </div>
                           </DropdownMenuItem>
                           <DropdownMenuItem className='p-4'>
                              <div className='space-y-1'>
                                 <p className='font-medium'>
                                    Appointment Reminder
                                 </p>
                                 <p className='text-sm text-gray-600'>
                                    3 appointments scheduled for today
                                 </p>
                              </div>
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>

                     <button className='p-3 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors'>
                        <Settings className='h-6 w-6 text-gray-600' />
                     </button>
                  </div> */}
               </div>
            </div>
            {/* Enhanced Stats Cards */}
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
               {enhancedStats.map((stat, index) => (
                  <Card
                     key={index}
                     className='overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group'
                  >
                     <CardContent className='p-6'>
                        <div className='flex items-center justify-between'>
                           <div className='space-y-2'>
                              <p className='text-sm font-medium text-gray-600'>
                                 {stat.title}
                              </p>
                              <p className='text-3xl font-bold text-gray-900'>
                                 {stat.value}
                              </p>
                              <div className='flex items-center space-x-2'>
                                 <Badge
                                    variant={
                                       stat.trend === "up"
                                          ? "default"
                                          : "secondary"
                                    }
                                    className={`text-xs ${
                                       stat.trend === "up"
                                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                                          : "bg-red-100 text-red-700 hover:bg-red-200"
                                    }`}
                                 >
                                    {stat.trend === "up" ? "↗" : "↘"}{" "}
                                    {stat.change}
                                 </Badge>
                              </div>
                           </div>
                           <div
                              className={`p-3 rounded-full ${
                                 index % 4 === 0
                                    ? "bg-blue-100"
                                    : index % 4 === 1
                                    ? "bg-green-100"
                                    : index % 4 === 2
                                    ? "bg-purple-100"
                                    : "bg-orange-100"
                              } group-hover:scale-110 transition-transform duration-300`}
                           >
                              <stat.icon
                                 className={`h-8 w-8 ${
                                    index % 4 === 0
                                       ? "text-blue-600"
                                       : index % 4 === 1
                                       ? "text-green-600"
                                       : index % 4 === 2
                                       ? "text-purple-600"
                                       : "text-orange-600"
                                 }`}
                              />
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               ))}
            </div>{" "}
            {/* Enhanced Charts Section */}
            <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
               {/* Main Chart */}
               <Card className='xl:col-span-2 border-0 shadow-lg'>
                  <CardHeader className='pb-4'>
                     <div className='flex items-center justify-between'>
                        <CardTitle className='text-xl font-semibold text-gray-900'>
                           Patient Statistics
                        </CardTitle>
                        <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                              <Button variant='outline' size='sm'>
                                 {selectedTimeRange} ▼
                              </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent>
                              <DropdownMenuItem
                                 onClick={() => setSelectedTimeRange("7 days")}
                              >
                                 7 days
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                 onClick={() => setSelectedTimeRange("30 days")}
                              >
                                 30 days
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                 onClick={() =>
                                    setSelectedTimeRange("12 months")
                                 }
                              >
                                 12 months
                              </DropdownMenuItem>
                           </DropdownMenuContent>
                        </DropdownMenu>
                     </div>
                  </CardHeader>
                  <CardContent>
                     <div className='h-[350px]'>
                        <ResponsiveContainer width='100%' height='100%'>
                           <BarChart data={chartDataFormatted}>
                              <CartesianGrid
                                 strokeDasharray='3 3'
                                 opacity={0.1}
                              />
                              <XAxis
                                 dataKey='name'
                                 tick={{ fontSize: 12 }}
                                 axisLine={false}
                                 tickLine={false}
                              />
                              <YAxis
                                 tick={{ fontSize: 12 }}
                                 axisLine={false}
                                 tickLine={false}
                              />
                              <Tooltip
                                 contentStyle={{
                                    backgroundColor: "white",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                    boxShadow:
                                       "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                 }}
                              />
                              <Legend />
                              <Bar
                                 dataKey='Completed'
                                 fill='#3b82f6'
                                 radius={[4, 4, 0, 0]}
                                 name='Completed Cases'
                              />
                              <Bar
                                 dataKey='Active'
                                 fill='#10b981'
                                 radius={[4, 4, 0, 0]}
                                 name='Active Cases'
                              />
                              <Bar
                                 dataKey='New'
                                 fill='#f59e0b'
                                 radius={[4, 4, 0, 0]}
                                 name='New Cases'
                              />
                           </BarChart>
                        </ResponsiveContainer>
                     </div>
                  </CardContent>
               </Card>

               {/* Quick Stats */}
               <Card className='border-0 shadow-lg'>
                  <CardHeader>
                     <CardTitle className='text-lg font-semibold text-gray-900'>
                        Quick Overview
                     </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                     <div className='grid grid-cols-2 gap-4'>
                        <div className='text-center p-4 bg-blue-50 rounded-lg'>
                           <Calendar className='h-8 w-8 text-blue-600 mx-auto mb-2' />
                           <p className='text-2xl font-bold text-gray-900'>
                              24
                           </p>
                           <p className='text-sm text-gray-600'>
                              Today's Appointments
                           </p>
                        </div>
                        <div className='text-center p-4 bg-green-50 rounded-lg'>
                           <Heart className='h-8 w-8 text-green-600 mx-auto mb-2' />
                           <p className='text-2xl font-bold text-gray-900'>
                              18
                           </p>
                           <p className='text-sm text-gray-600'>
                              Surgeries This Week
                           </p>
                        </div>
                     </div>
                     <div className='space-y-3'>
                        <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                           <div className='flex items-center space-x-3'>
                              <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                              <span className='text-sm font-medium'>
                                 Emergency Ward
                              </span>
                           </div>
                           <Badge variant='secondary'>Available</Badge>
                        </div>
                        <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                           <div className='flex items-center space-x-3'>
                              <div className='w-3 h-3 bg-yellow-500 rounded-full'></div>
                              <span className='text-sm font-medium'>ICU</span>
                           </div>
                           <Badge variant='outline'>85% Full</Badge>
                        </div>
                        <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                           <div className='flex items-center space-x-3'>
                              <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                              <span className='text-sm font-medium'>
                                 Surgery Room 1
                              </span>
                           </div>
                           <Badge variant='destructive'>In Use</Badge>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>
            {/* Surgery Stats and Doctors List */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
               <div className='h-full'>
                  <SurgeryStats className='h-full border-0 shadow-lg' />
               </div>
               <div className='h-full'>
                  <DoctorsList
                     doctors={doctors.map((d) => d.name)}
                     className='h-full border-0 shadow-lg'
                  />
               </div>
            </div>
            {/* Enhanced Patients Table */}
            <Card className='border-0 shadow-lg'>
               <CardHeader className='pb-4'>
                  <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                     <CardTitle className='text-xl font-semibold text-gray-900'>
                        Recent Patient Admissions
                     </CardTitle>
                     <div className='flex items-center gap-2'>
                        <Badge variant='outline' className='text-xs'>
                           {patientSampleData.length} patients
                        </Badge>
                        <Button variant='outline' size='sm'>
                           View All
                        </Button>
                     </div>
                  </div>
               </CardHeader>
               <CardContent>
                  <div className='rounded-lg border border-gray-200 overflow-hidden'>
                     <Table>
                        <TableHeader>
                           <TableRow className='bg-gray-50'>
                              <TableHead className='font-semibold text-gray-900'>
                                 Patient Name
                              </TableHead>
                              <TableHead className='font-semibold text-gray-900'>
                                 ID
                              </TableHead>
                              <TableHead className='font-semibold text-gray-900'>
                                 Gender
                              </TableHead>
                              <TableHead className='font-semibold text-gray-900'>
                                 Condition
                              </TableHead>
                              <TableHead className='font-semibold text-gray-900'>
                                 Assigned Doctor
                              </TableHead>
                              <TableHead className='font-semibold text-gray-900'>
                                 Admission Date
                              </TableHead>
                              <TableHead className='font-semibold text-gray-900'>
                                 Status
                              </TableHead>
                           </TableRow>
                        </TableHeader>
                        <TableBody>
                           {patientSampleData.map((patient, i) => (
                              <TableRow
                                 key={i}
                                 className='hover:bg-gray-50 transition-colors'
                              >
                                 <TableCell className='font-medium text-gray-900'>
                                    <div className='flex items-center space-x-3'>
                                       <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
                                          <span className='text-sm font-medium text-blue-600'>
                                             {patient.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                          </span>
                                       </div>
                                       <span>{patient.name}</span>
                                    </div>
                                 </TableCell>
                                 <TableCell className='text-gray-600'>
                                    #{patient.serial}
                                 </TableCell>
                                 <TableCell className='text-gray-600'>
                                    {patient.gender}
                                 </TableCell>
                                 <TableCell className='text-gray-600'>
                                    {patient.disease}
                                 </TableCell>
                                 <TableCell className='text-gray-600'>
                                    {patient.doctor}
                                 </TableCell>
                                 <TableCell className='text-gray-600'>
                                    {patient.date}
                                 </TableCell>
                                 <TableCell>
                                    <Badge
                                       variant={
                                          patient.status === "Critical"
                                             ? "destructive"
                                             : "secondary"
                                       }
                                       className={`${
                                          patient.status === "Critical"
                                             ? "bg-red-100 text-red-700 hover:bg-red-200"
                                             : "bg-green-100 text-green-700 hover:bg-green-200"
                                       }`}
                                    >
                                       {patient.status}
                                    </Badge>
                                 </TableCell>
                              </TableRow>
                           ))}
                        </TableBody>
                     </Table>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   );
};

export default Dashboard;
