import React, { useState, useEffect } from "react";
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
import { dashboardService } from "@/services/dashboardService";
import { supabase } from "@/lib/supabaseClient";
import { DoctorsList } from "@/components/ui/doctors-list";
import { statsData, chartData, patientSampleData, doctors } from "@/data";

const Dashboard = () => {
   const [search, setSearch] = useState("");
   const [selectedTimeRange, setSelectedTimeRange] = useState("12 months");
   const [dashboardData, setDashboardData] = useState({
      stats: [],
      recentAppointments: [],
      chartData: [],
      loading: true,
   });

   // Fetch real-time dashboard data
   useEffect(() => {
      const fetchDashboardData = async () => {
         try {
            // Get complete dashboard data
            const [statsResult, appointmentsResult, trendsResult] =
               await Promise.all([
                  dashboardService.getDashboardStats(),
                  dashboardService.getRecentAppointments(5),
                  dashboardService.getAppointmentTrends(7),
               ]);

            if (statsResult.error) {
               console.error("Error fetching stats:", statsResult.error);
               return;
            }

            // Format stats for the UI
            const formattedStats = [
               {
                  title: "Today's Appointments",
                  value: statsResult.data?.todayAppointments || 0,
                  icon: "Calendar",
                  trend: "up",
                  change: "+12%",
               },
               {
                  title: "Total Patients",
                  value: statsResult.data?.totalPatients || 0,
                  icon: "Users",
                  trend: "up",
                  change: "+5%",
               },
               {
                  title: "Active Providers",
                  value: statsResult.data?.totalProviders || 0,
                  icon: "UserPlus",
                  trend: "up",
                  change: "+3%",
               },
               {
                  title: "Weekly Completed",
                  value: statsResult.data?.weeklyCompletedAppointments || 0,
                  icon: "Activity",
                  trend: "up",
                  change: "+18%",
               },
            ];

            // Format trends data for charts
            const chartDataFormatted =
               trendsResult.data?.map((trend) => ({
                  name: new Date(trend.date).toLocaleDateString("en-US", {
                     weekday: "short",
                  }),
                  Completed: trend.completed || 0,
                  Scheduled: trend.scheduled || 0,
                  New: trend.new_patients || 0,
               })) || [];

            setDashboardData({
               stats: formattedStats,
               recentAppointments: appointmentsResult.data || [],
               chartData: chartDataFormatted,
               loading: false,
            });
         } catch (error) {
            console.error("Error:", error);
            setDashboardData((prev) => ({ ...prev, loading: false }));
         }
      };

      fetchDashboardData();

      // Set up real-time subscriptions for live updates
      const appointmentsSubscription = supabase
         .channel("dashboard-appointments")
         .on(
            "postgres_changes",
            {
               event: "*",
               schema: "public",
               table: "appointments",
            },
            () => {
               fetchDashboardData(); // Refresh data when appointments change
            }
         )
         .subscribe();

      const patientsSubscription = supabase
         .channel("dashboard-patients")
         .on(
            "postgres_changes",
            {
               event: "*",
               schema: "public",
               table: "patients",
            },
            () => {
               fetchDashboardData(); // Refresh data when patients change
            }
         )
         .subscribe();

      return () => {
         appointmentsSubscription.unsubscribe();
         patientsSubscription.unsubscribe();
      };
   }, []);

   const filteredDoctors = doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(search.toLowerCase())
   );

   // Use real-time data or fallback to static data
   const displayStats =
      dashboardData.stats.length > 0 ? dashboardData.stats : statsData;
   const displayAppointments =
      dashboardData.recentAppointments.length > 0
         ? dashboardData.recentAppointments
         : patientSampleData;

   // Chart data from real-time data or static data
   const chartDataFormatted =
      dashboardData.chartData.length > 0
         ? dashboardData.chartData
         : chartData.months.map((month, index) => ({
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

   const enhancedStats = displayStats.map((stat) => ({
      ...stat,
      icon: iconMap[stat.icon] || Users,
   }));
   return (
      <div className='min-h-screen'>
         <div className='p-6 space-y-6'>
            {/* Auth Status - For development purposes only */}
            {/* {process.env.NODE_ENV !== "production" && <AuthStatus />} */}
            {/* Modern Header Section */}
            <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-card text-card-foreground rounded-xl p-6 shadow-sm border'>
               <div className='flex-1'>
                  <h1 className='text-4xl font-bold text-primary mb-2'>
                     Healthcare Dashboard
                  </h1>
                  <p className='text-muted-foreground text-lg'>
                     Welcome back! Here's what's happening at your clinic today.
                  </p>
               </div>

               <div className='flex items-center gap-4'>
                  <div className='relative'>
                     <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground' />
                     <Input
                        placeholder='Search patients, doctors...'
                        className='pl-10 w-80 h-12'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                     />
                  </div>

                  {/* <div className='flex items-center gap-3'>
                     <DropdownMenu>
                        <DropdownMenuTrigger className='focus:outline-none'>
                           <div className='relative p-3 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors'>
                              <Bell className='h-6 w-6 text-primary' />
                              <div className='absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center'>
                                 <span className='text-xs text-destructive-foreground font-medium'>
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
                                 <p className='text-sm text-muted-foreground'>
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
                                 <p className='text-sm text-muted-foreground'>
                                    3 appointments scheduled for today
                                 </p>
                              </div>
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>

                     <button className='p-3 rounded-full bg-muted/50 hover:bg-muted/60 transition-colors'>
                        <Settings className='h-6 w-6 text-muted-foreground' />
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
                              <p className='text-sm font-medium text-muted-foreground'>
                                 {stat.title}
                              </p>
                              <p className='text-3xl font-bold text-foreground'>
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
                                          ? "bg-success-soft text-success-strong hover:bg-success-soft/80"
                                          : "bg-destructive-soft text-destructive-strong hover:bg-destructive-soft/80"
                                    }`}
                                 >
                                    {stat.trend === "up" ? "↗" : "↘"}{" "}
                                    {stat.change}
                                 </Badge>
                              </div>
                           </div>
                           <div className='p-3 rounded-full bg-primary/10 group-hover:scale-110 transition-transform duration-300'>
                              <stat.icon className='h-8 w-8 text-primary' />
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
                        <CardTitle className='text-xl font-semibold text-foreground'>
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
                                    backgroundColor: "hsl(var(--background))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "8px",
                                    boxShadow:
                                       "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                    color: "hsl(var(--foreground))",
                                 }}
                              />
                              <Legend />
                              <Bar
                                 dataKey='Completed'
                                 fill='hsl(var(--primary))'
                                 radius={[4, 4, 0, 0]}
                                 name='Completed Cases'
                              />
                              <Bar
                                 dataKey='Active'
                                 fill='hsl(var(--success))'
                                 radius={[4, 4, 0, 0]}
                                 name='Active Cases'
                              />
                              <Bar
                                 dataKey='New'
                                 fill='hsl(var(--warning))'
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
                     <CardTitle className='text-lg font-semibold text-foreground'>
                        Quick Overview
                     </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                     <div className='grid grid-cols-2 gap-4'>
                        <div className='text-center p-4 bg-primary/10 rounded-lg'>
                           <Calendar className='h-8 w-8 text-primary mx-auto mb-2' />
                           <p className='text-2xl font-bold text-foreground'>
                              24
                           </p>
                           <p className='text-sm text-muted-foreground'>
                              Today's Appointments
                           </p>
                        </div>
                        <div className='text-center p-4 bg-success/10 rounded-lg'>
                           <Heart className='h-8 w-8 text-success mx-auto mb-2' />
                           <p className='text-2xl font-bold text-foreground'>
                              18
                           </p>
                           <p className='text-sm text-muted-foreground'>
                              Surgeries This Week
                           </p>
                        </div>
                     </div>
                     <div className='space-y-3'>
                        <div className='flex items-center justify-between p-3 bg-muted/30 rounded-lg'>
                           <div className='flex items-center space-x-3'>
                              <div className='w-3 h-3 bg-success rounded-full'></div>
                              <span className='text-sm font-medium text-foreground'>
                                 Emergency Ward
                              </span>
                           </div>
                           <Badge variant='secondary'>Available</Badge>
                        </div>
                        <div className='flex items-center justify-between p-3 bg-muted/30 rounded-lg'>
                           <div className='flex items-center space-x-3'>
                              <div className='w-3 h-3 bg-warning rounded-full'></div>
                              <span className='text-sm font-medium text-foreground'>
                                 ICU
                              </span>
                           </div>
                           <Badge variant='outline'>85% Full</Badge>
                        </div>
                        <div className='flex items-center justify-between p-3 bg-muted/30 rounded-lg'>
                           <div className='flex items-center space-x-3'>
                              <div className='w-3 h-3 bg-destructive rounded-full'></div>
                              <span className='text-sm font-medium text-foreground'>
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
                     <CardTitle className='text-xl font-semibold text-foreground'>
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
                  <div className='rounded-lg border border-border overflow-hidden'>
                     <Table>
                        <TableHeader>
                           <TableRow className='bg-muted/30'>
                              <TableHead className='font-semibold text-foreground'>
                                 Patient Name
                              </TableHead>
                              <TableHead className='font-semibold text-foreground'>
                                 ID
                              </TableHead>
                              <TableHead className='font-semibold text-foreground'>
                                 Gender
                              </TableHead>
                              <TableHead className='font-semibold text-foreground'>
                                 Condition
                              </TableHead>
                              <TableHead className='font-semibold text-foreground'>
                                 Assigned Doctor
                              </TableHead>
                              <TableHead className='font-semibold text-foreground'>
                                 Admission Date
                              </TableHead>
                              <TableHead className='font-semibold text-foreground'>
                                 Status
                              </TableHead>
                           </TableRow>
                        </TableHeader>
                        <TableBody>
                           {displayAppointments.map((appointment, i) => {
                              // Handle both real appointments and sample data structures
                              const patientName = appointment.patients
                                 ? `${appointment.patients.first_name} ${appointment.patients.last_name}`
                                 : appointment.name;
                              const providerName =
                                 appointment.providers?.name ||
                                 appointment.doctor;
                              const appointmentDate =
                                 appointment.appointment_date ||
                                 appointment.date;
                              const appointmentStatus = appointment.status;

                              return (
                                 <TableRow
                                    key={appointment.id || i}
                                    className='hover:bg-muted/30 transition-colors'
                                 >
                                    <TableCell className='font-medium text-foreground'>
                                       <div className='flex items-center space-x-3'>
                                          <div className='w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center'>
                                             <span className='text-sm font-medium text-primary-600'>
                                                {patientName
                                                   .split(" ")
                                                   .map((n) => n[0])
                                                   .join("")}
                                             </span>
                                          </div>
                                          <span>{patientName}</span>
                                       </div>
                                    </TableCell>
                                    <TableCell className='text-muted-foreground'>
                                       #
                                       {appointment.appointment_id ||
                                          appointment.serial}
                                    </TableCell>
                                    <TableCell className='text-muted-foreground'>
                                       {appointment.appointment_type ||
                                          appointment.gender ||
                                          "General"}
                                    </TableCell>
                                    <TableCell className='text-muted-foreground'>
                                       {appointment.chief_complaint ||
                                          appointment.disease ||
                                          "N/A"}
                                    </TableCell>
                                    <TableCell className='text-muted-foreground'>
                                       {providerName}
                                    </TableCell>
                                    <TableCell className='text-muted-foreground'>
                                       {new Date(
                                          appointmentDate
                                       ).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                       <Badge
                                          variant={
                                             appointmentStatus ===
                                                "Cancelled" ||
                                             appointmentStatus === "Critical"
                                                ? "destructive"
                                                : appointmentStatus ===
                                                  "Completed"
                                                ? "default"
                                                : "secondary"
                                          }
                                          className={`${
                                             appointmentStatus ===
                                                "Cancelled" ||
                                             appointmentStatus === "Critical"
                                                ? "bg-error-100 text-error-700 hover:bg-error-200"
                                                : appointmentStatus ===
                                                  "Completed"
                                                ? "bg-success-100 text-success-700 hover:bg-success-200"
                                                : "bg-secondary-100 text-secondary-700 hover:bg-secondary-200"
                                          }`}
                                       >
                                          {appointmentStatus}
                                       </Badge>
                                    </TableCell>
                                 </TableRow>
                              );
                           })}
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
