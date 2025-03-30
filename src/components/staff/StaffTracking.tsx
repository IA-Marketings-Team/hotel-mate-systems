
import React, { useState } from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { StaffMember } from "@/hooks/useStaff";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { Progress } from "@/components/ui/progress";
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Legend, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format, addDays, differenceInMinutes } from "date-fns";
import { fr } from "date-fns/locale";
import { Check, Clock, Download, FileText, Users, X } from "lucide-react";

interface StaffTrackingProps {
  staffMembers: StaffMember[];
}

// Mock attendance data
interface Attendance {
  id: string;
  staffId: string;
  date: Date;
  clockIn: Date;
  clockOut: Date | null;
  status: 'present' | 'absent' | 'late' | 'early-leave';
}

interface PerformanceData {
  staffId: string;
  month: string;
  attendance: number;
  punctuality: number;
  taskCompletion: number;
}

export const StaffTracking: React.FC<StaffTrackingProps> = ({ staffMembers }) => {
  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(today.getFullYear(), today.getMonth(), 1),
    to: today
  });
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");

  // Mock attendance data - in a real app this would come from a database
  const attendanceData: Attendance[] = [
    {
      id: '1',
      staffId: staffMembers[0]?.id || '',
      date: today,
      clockIn: new Date(today.setHours(8, 5, 0)),
      clockOut: new Date(today.setHours(16, 0, 0)),
      status: 'present'
    },
    {
      id: '2',
      staffId: staffMembers[1]?.id || '',
      date: today,
      clockIn: new Date(today.setHours(8, 30, 0)),
      clockOut: new Date(today.setHours(16, 30, 0)),
      status: 'late'
    },
    {
      id: '3',
      staffId: staffMembers[2]?.id || '',
      date: today,
      clockIn: new Date(today.setHours(9, 0, 0)),
      clockOut: null,
      status: 'present'
    }
  ];

  // Mock performance data
  const performanceData: PerformanceData[] = staffMembers.map(staff => ({
    staffId: staff.id,
    month: 'Juin',
    attendance: Math.floor(Math.random() * 30) + 70,
    punctuality: Math.floor(Math.random() * 20) + 80,
    taskCompletion: Math.floor(Math.random() * 25) + 75
  }));

  // Chart data
  const chartData = [
    { name: 'Lun', Présence: 95, Ponctualité: 85, Tâches: 80 },
    { name: 'Mar', Présence: 90, Ponctualité: 90, Tâches: 85 },
    { name: 'Mer', Présence: 92, Ponctualité: 88, Tâches: 82 },
    { name: 'Jeu', Présence: 94, Ponctualité: 92, Tâches: 90 },
    { name: 'Ven', Présence: 88, Ponctualité: 84, Tâches: 88 },
    { name: 'Sam', Présence: 85, Ponctualité: 80, Tâches: 75 },
    { name: 'Dim', Présence: 82, Ponctualité: 78, Tâches: 70 },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const calculateWorkDuration = (clockIn: Date, clockOut: Date | null) => {
    if (!clockOut) return "En cours";
    
    const durationMinutes = differenceInMinutes(clockOut, clockIn);
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  };

  const getStaffById = (id: string) => {
    return staffMembers.find(s => s.id === id);
  };

  // Filter staff based on department selection
  const filteredStaff = selectedDepartment === "all" 
    ? staffMembers 
    : staffMembers.filter(s => {
        if (selectedDepartment === "reception") return s.role === "receptionist";
        if (selectedDepartment === "restaurant") return ["waiter", "chef", "bartender"].includes(s.role);
        if (selectedDepartment === "maintenance") return ["housekeeper", "maintenance"].includes(s.role);
        if (selectedDepartment === "management") return s.role === "manager";
        return false;
      });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <DatePickerWithRange 
          dateRange={dateRange} 
          onDateRangeChange={setDateRange} 
        />
        <div className="flex items-center gap-2">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Département" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les départements</SelectItem>
              <SelectItem value="reception">Réception</SelectItem>
              <SelectItem value="restaurant">Restauration</SelectItem>
              <SelectItem value="maintenance">Entretien</SelectItem>
              <SelectItem value="management">Direction</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Rapport
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard title="Présence aujourd'hui" className="md:col-span-2">
          <div className="border rounded-md overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employé</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Heure d'arrivée</TableHead>
                  <TableHead>Heure de départ</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData
                  .filter(a => {
                    const staff = getStaffById(a.staffId);
                    if (!staff) return false;
                    
                    if (selectedDepartment === "all") return true;
                    if (selectedDepartment === "reception" && staff.role === "receptionist") return true;
                    if (selectedDepartment === "restaurant" && ["waiter", "chef", "bartender"].includes(staff.role)) return true;
                    if (selectedDepartment === "maintenance" && ["housekeeper", "maintenance"].includes(staff.role)) return true;
                    if (selectedDepartment === "management" && staff.role === "manager") return true;
                    
                    return false;
                  })
                  .map(attendance => {
                    const staff = getStaffById(attendance.staffId);
                    if (!staff) return null;
                    
                    return (
                      <TableRow key={attendance.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{getInitials(staff.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{staff.name}</div>
                              <div className="text-xs text-muted-foreground">{staff.role}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{staff.shift}</TableCell>
                        <TableCell>{format(attendance.clockIn, 'HH:mm')}</TableCell>
                        <TableCell>
                          {attendance.clockOut 
                            ? format(attendance.clockOut, 'HH:mm') 
                            : <Badge variant="outline" className="bg-blue-50 text-blue-800">En cours</Badge>
                          }
                        </TableCell>
                        <TableCell>
                          {calculateWorkDuration(attendance.clockIn, attendance.clockOut)}
                        </TableCell>
                        <TableCell>
                          {attendance.status === 'present' && (
                            <Badge className="bg-green-100 text-green-800">Présent</Badge>
                          )}
                          {attendance.status === 'absent' && (
                            <Badge className="bg-red-100 text-red-800">Absent</Badge>
                          )}
                          {attendance.status === 'late' && (
                            <Badge className="bg-amber-100 text-amber-800">En retard</Badge>
                          )}
                          {attendance.status === 'early-leave' && (
                            <Badge className="bg-blue-100 text-blue-800">Départ anticipé</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Statistiques" className="md:col-span-1">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Présence</span>
                <span className="font-medium">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ponctualité</span>
                <span className="font-medium">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tâches complétées</span>
                <span className="font-medium">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">24</div>
                <div className="text-xs text-muted-foreground">Présents</div>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">3</div>
                <div className="text-xs text-muted-foreground">Absents</div>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-amber-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">5</div>
                <div className="text-xs text-muted-foreground">Retards</div>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">2</div>
                <div className="text-xs text-muted-foreground">Départs anticipés</div>
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>
      
      <DashboardCard title="Performance hebdomadaire">
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Présence" fill="#10b981" />
              <Bar dataKey="Ponctualité" fill="#3b82f6" />
              <Bar dataKey="Tâches" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </DashboardCard>
      
      <DashboardCard title="Performance individuelle">
        <div className="border rounded-md overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employé</TableHead>
                <TableHead>Présence</TableHead>
                <TableHead>Ponctualité</TableHead>
                <TableHead>Tâches complétées</TableHead>
                <TableHead>Performance globale</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {performanceData
                .filter(p => {
                  const staff = getStaffById(p.staffId);
                  if (!staff) return false;
                  
                  if (selectedDepartment === "all") return true;
                  if (selectedDepartment === "reception" && staff.role === "receptionist") return true;
                  if (selectedDepartment === "restaurant" && ["waiter", "chef", "bartender"].includes(staff.role)) return true;
                  if (selectedDepartment === "maintenance" && ["housekeeper", "maintenance"].includes(staff.role)) return true;
                  if (selectedDepartment === "management" && staff.role === "manager") return true;
                  
                  return false;
                })
                .map(performance => {
                  const staff = getStaffById(performance.staffId);
                  if (!staff) return null;
                  
                  const overallScore = Math.round(
                    (performance.attendance + performance.punctuality + performance.taskCompletion) / 3
                  );
                  
                  return (
                    <TableRow key={performance.staffId}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{getInitials(staff.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{staff.name}</div>
                            <div className="text-xs text-muted-foreground">{staff.role}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={performance.attendance} className="h-2 w-24" />
                          <span className="text-sm">{performance.attendance}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={performance.punctuality} className="h-2 w-24" />
                          <span className="text-sm">{performance.punctuality}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={performance.taskCompletion} className="h-2 w-24" />
                          <span className="text-sm">{performance.taskCompletion}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {overallScore >= 90 ? (
                            <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                          ) : overallScore >= 80 ? (
                            <Badge className="bg-blue-100 text-blue-800">Très bien</Badge>
                          ) : overallScore >= 70 ? (
                            <Badge className="bg-amber-100 text-amber-800">Bien</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">À améliorer</Badge>
                          )}
                          <span className="text-sm font-medium">{overallScore}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </DashboardCard>
    </div>
  );
};
