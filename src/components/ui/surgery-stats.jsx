import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts/lib/index";

const SurgeryStats = ({ className }) => {
  const surgeryData = [
    { day: 'Mon', surgeries: 70, success: 65 },
    { day: 'Tue', surgeries: 50, success: 45 },
    { day: 'Wed', surgeries: 80, success: 75 },
    { day: 'Thu', surgeries: 60, success: 55 },
    { day: 'Fri', surgeries: 40, success: 38 },
    { day: 'Sat', surgeries: 90, success: 85 },
    { day: 'Sun', surgeries: 55, success: 50 },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Surgery Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-6">
          {/* Bar Chart */}
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={surgeryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="surgeries" 
                  fill="hsl(var(--primary))" 
                  name="Total Surgeries"
                />
                <Bar 
                  dataKey="success" 
                  fill="hsl(var(--secondary))" 
                  name="Successful"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart */}
          {/* <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={surgeryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="surgeries" 
                  stroke="hsl(var(--primary))" 
                  name="Total Surgeries"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="success" 
                  stroke="hsl(var(--secondary))" 
                  name="Successful"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
};

export { SurgeryStats };