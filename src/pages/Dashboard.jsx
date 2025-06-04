import React, { useState } from "react";
import {
  Bell,
  Search,
  Settings,
  TrendingUp,
  Users,
  UserPlus,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
} from "recharts/lib/index";
import { StatCard } from "@/components/ui/stat-card";
import { SurgeryStats } from "@/components/ui/surgery-stats";
import { DoctorsList } from "@/components/ui/doctors-list";

const Dashboard = () => {
  const [search, setSearch] = useState("");

  const patientData = [50, 70, 40, 60, 90, 100, 80, 60, 75, 85];
  const xSpacing = 600 / (patientData.length - 1);
  const doctorNames = [
    "Dr. Tariq Islam",
    "Dr. Tahmina Akhter",
    "Dr. Yamin Rahman",
    "Dr. Maribul Haque",
    "Dr. Tahmina Akhter",
    "Dr. Yamin Rahman",
    "Dr. Maribul Haque",
  ];

  const filteredDoctors = doctorNames.filter((name) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const completedData = [10, 20, 15, 12, 18, 25, 22, 28, 30, 35, 32, 27];
  const activeData = [5, 10, 7, 9, 12, 15, 13, 14, 20, 18, 22, 19];
  const newData = [3, 6, 4, 5, 6, 7, 6, 5, 8, 9, 10, 8];
  const [selectedRange, setSelectedRange] = useState("12 months");

  const [statsData, setStatsData] = useState([
    { title: "New Patients", value: 100, icon: Users, trend: "up" },
    { title: "Total Patients", value: 100, icon: Users, trend: "up" },
    { title: "Total visitors", value: 75, icon: UserPlus, trend: "down" },
    { title: "Total Earnings", value: "$5000", icon: DollarSign, trend: "up" },
  ]);

  return (
    <div className="p-6 space-y-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>New Patient Alert</DropdownMenuItem>
              <DropdownMenuItem>Appointment Reminder</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Settings className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
        </div>
      </div>

      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Charts Section */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Patient Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={months.map((month, index) => ({
                  name: month,
                  Completed: completedData[index],
                  Active: activeData[index],
                  New: newData[index],
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))' 
                  }} 
                />
                <Legend />
                <Bar 
                  dataKey="Completed" 
                  fill="#2563eb" // Blue
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="Active" 
                  fill="#16a34a" // Green
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="New" 
                  fill="#dc2626" // Red
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-full">
          <SurgeryStats className="h-full" />
        </div>
        <div className="h-full">
          <DoctorsList doctors={doctorNames} className="h-full" />
        </div>
      </div>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Admit Patients List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Patient No</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Disease</TableHead>
                <TableHead>Assigned Doctor</TableHead>
                <TableHead>Date of Admit</TableHead>
                <TableHead>Status</TableHead>
                {/* <TableHead>Room No</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  name: "John Doe",
                  serial: 2102,
                  gender: "Male",
                  disease: "Angina",
                  doctor: "Dr. Tariq Islam",
                  date: "Dec 20, 2024",
                  status: "Stable",
                  room: "AP-105",
                },
                {
                  name: "Mike",
                  serial: 2403,
                  gender: "Male",
                  disease: "Asthma",
                  doctor: "Dr. Tahmina Akhter",
                  date: "Dec 18, 2024",
                  status: "Critical",
                  room: "AC-201",
                },
              ].map((patient, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>{patient.serial}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>{patient.disease}</TableCell>
                  <TableCell>{patient.doctor}</TableCell>
                  <TableCell>{patient.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        patient.status === "Critical"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {patient.status}
                    </Badge>
                  </TableCell>
                  {/* <TableCell>{patient.room}</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
