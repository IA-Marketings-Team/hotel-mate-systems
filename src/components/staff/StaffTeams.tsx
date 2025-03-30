
import React, { useState } from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { StaffMember } from "@/hooks/useStaff";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, ChevronRight, Plus, Search, UserPlus, Users } from "lucide-react";

interface StaffTeamsProps {
  staffMembers: StaffMember[];
}

// Define departments
interface Department {
  id: string;
  name: string;
  description: string;
  memberIds: string[];
  color: string;
}

export const StaffTeams: React.FC<StaffTeamsProps> = ({ staffMembers }) => {
  // Mock departments data - in a real app this would come from a database
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: '1',
      name: 'Réception',
      description: 'Équipe d\'accueil et service client',
      memberIds: staffMembers.filter(s => s.role === 'receptionist').map(s => s.id),
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: '2',
      name: 'Restauration',
      description: 'Service de restauration et bar',
      memberIds: staffMembers.filter(s => ['waiter', 'chef', 'bartender'].includes(s.role)).map(s => s.id),
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: '3',
      name: 'Entretien',
      description: 'Nettoyage et maintenance',
      memberIds: staffMembers.filter(s => ['housekeeper', 'maintenance'].includes(s.role)).map(s => s.id),
      color: 'bg-green-100 text-green-800'
    },
    {
      id: '4',
      name: 'Direction',
      description: 'Gestion et administration',
      memberIds: staffMembers.filter(s => s.role === 'manager').map(s => s.id),
      color: 'bg-purple-100 text-purple-800'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [expandedDept, setExpandedDept] = useState<string | null>("1");

  const filterStaff = (memberIds: string[]) => {
    return staffMembers
      .filter(s => memberIds.includes(s.id))
      .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  const toggleDepartment = (deptId: string) => {
    setExpandedDept(expandedDept === deptId ? null : deptId);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard title="Départements" className="md:col-span-1">
          <div className="mb-4">
            <Input
              placeholder="Rechercher un employé..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
              prefix={<Search className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
          
          <div className="space-y-2">
            {departments.map(dept => (
              <div key={dept.id} className="border rounded-lg overflow-hidden">
                <div 
                  className="flex items-center justify-between p-3 bg-muted cursor-pointer"
                  onClick={() => toggleDepartment(dept.id)}
                >
                  <div className="flex items-center gap-2">
                    {expandedDept === dept.id ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <span className="font-medium">{dept.name}</span>
                  </div>
                  <Badge className={dept.color}>
                    {filterStaff(dept.memberIds).length}
                  </Badge>
                </div>
                
                {expandedDept === dept.id && (
                  <div className="p-3 bg-white">
                    <p className="text-sm text-muted-foreground mb-3">
                      {dept.description}
                    </p>
                    
                    {filterStaff(dept.memberIds).length === 0 ? (
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Aucun employé trouvé</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {filterStaff(dept.memberIds).map(staff => (
                          <div key={staff.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback>{getInitials(staff.name)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{staff.name}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {staff.role}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <Button variant="ghost" size="sm" className="mt-3 w-full">
                      <UserPlus className="h-3 w-3 mr-1" />
                      Ajouter membre
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <Button variant="outline" className="w-full mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau département
          </Button>
        </DashboardCard>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="structure">Structure</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <DashboardCard title="Vue d'ensemble des équipes">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {departments.map(dept => (
                    <Card key={dept.id}>
                      <CardHeader className={`pb-2 ${dept.color.replace('text-', '').replace('bg-', 'bg-opacity-20 bg-')}`}>
                        <CardTitle className="text-lg">{dept.name}</CardTitle>
                        <CardDescription>
                          {dept.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="flex -space-x-2 overflow-hidden mb-3">
                          {staffMembers
                            .filter(s => dept.memberIds.includes(s.id))
                            .slice(0, 5)
                            .map(staff => (
                              <Avatar key={staff.id} className="border-2 border-background">
                                <AvatarFallback>{getInitials(staff.name)}</AvatarFallback>
                              </Avatar>
                            ))}
                          {dept.memberIds.length > 5 && (
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-xs font-medium">
                              +{dept.memberIds.length - 5}
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">{dept.memberIds.length}</span> membres
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="ghost" size="sm" className="w-full">
                          <Users className="h-4 w-4 mr-2" />
                          Gérer l'équipe
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </DashboardCard>
            </TabsContent>
            
            <TabsContent value="structure">
              <DashboardCard title="Structure organisationnelle">
                <div className="p-8 text-center bg-muted rounded-lg">
                  <p className="text-muted-foreground">
                    Diagramme de structure organisationnelle à venir
                  </p>
                </div>
              </DashboardCard>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
