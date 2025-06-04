import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const DoctorsList = ({ doctors, className }) => {
  const [search, setSearch] = useState("");

  const filteredDoctors = doctors.filter((name) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Doctors List</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          placeholder="Search doctors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4"
        />
        <div className="space-y-2 h-[200px] overflow-y-auto pr-2 scrollbar-thin">
          {filteredDoctors.map((name, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <span className="font-medium">{name}</span>
              <Badge variant="secondary">Active</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export { DoctorsList };