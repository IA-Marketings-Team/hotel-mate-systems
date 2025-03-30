
import React, { useState } from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { StaffMember } from "@/hooks/useStaff";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Check, Clock, ListTodo, Plus, Square, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StaffTasksProps {
  staffMembers: StaffMember[];
}

interface Task {
  id: string;
  title: string;
  description?: string;
  assignedTo: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
}

export const StaffTasks: React.FC<StaffTasksProps> = ({ staffMembers }) => {
  // Mock tasks data - in a real app this would come from a database
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Vérification des chambres',
      description: 'Vérifier la propreté des chambres 101-110',
      assignedTo: staffMembers[0]?.id || '',
      dueDate: new Date(),
      priority: 'high',
      status: 'pending'
    },
    {
      id: '2',
      title: 'Préparation du service',
      description: 'Préparer les tables pour le service du soir',
      assignedTo: staffMembers[1]?.id || '',
      dueDate: new Date(),
      priority: 'medium',
      status: 'in-progress'
    },
    {
      id: '3',
      title: 'Inventaire des boissons',
      description: 'Faire l\'inventaire du bar',
      assignedTo: staffMembers[2]?.id || '',
      dueDate: new Date(),
      priority: 'low',
      status: 'completed'
    }
  ]);

  const [newTask, setNewTask] = useState<string>('');
  const [selectedStaff, setSelectedStaff] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Filter tasks based on selection
  const filteredTasks = tasks
    .filter(task => selectedStaff === "all" || task.assignedTo === selectedStaff)
    .filter(task => selectedStatus === "all" || task.status === selectedStatus);

  const addTask = () => {
    if (!newTask.trim()) return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      assignedTo: selectedStaff === "all" ? staffMembers[0]?.id || '' : selectedStaff,
      dueDate: new Date(),
      priority: 'medium',
      status: 'pending'
    };
    
    setTasks([...tasks, task]);
    setNewTask('');
  };

  const updateTaskStatus = (taskId: string, status: 'pending' | 'in-progress' | 'completed') => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const getPriorityBadge = (priority: 'low' | 'medium' | 'high') => {
    switch(priority) {
      case 'low':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">Basse</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">Moyenne</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">Haute</Badge>;
    }
  };

  const getAssigneeName = (assignedTo: string) => {
    const staff = staffMembers.find(s => s.id === assignedTo);
    return staff ? staff.name : 'Non assigné';
  };

  return (
    <div className="space-y-6">
      <DashboardCard title="Liste des tâches">
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="flex-1 flex items-center gap-2 w-full">
            <Input 
              placeholder="Ajouter une nouvelle tâche..." 
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              className="flex-1"
            />
            <Button onClick={addTask}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>
          <Select value={selectedStaff} onValueChange={setSelectedStaff}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Assigné à" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les employés</SelectItem>
              {staffMembers.map(staff => (
                <SelectItem key={staff.id} value={staff.id}>
                  {staff.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">À faire</SelectItem>
              <SelectItem value="in-progress">En cours</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {filteredTasks.length === 0 ? (
          <div className="text-center p-6 bg-muted rounded-lg">
            <ListTodo className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Aucune tâche trouvée</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map(task => (
              <div key={task.id} className={`
                p-4 border rounded-lg transition-all
                ${task.status === 'completed' ? 'bg-muted' : 'bg-white'}
                ${task.priority === 'high' ? 'border-l-4 border-l-red-500' : 
                  task.priority === 'medium' ? 'border-l-4 border-l-amber-500' :
                  'border-l-4 border-l-blue-500'}
              `}>
                <div className="flex items-start gap-3">
                  <div className="pt-1">
                    {task.status === 'completed' ? (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 text-green-600"
                        onClick={() => updateTaskStatus(task.id, 'pending')}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    ) : task.status === 'in-progress' ? (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 text-amber-500"
                        onClick={() => updateTaskStatus(task.id, 'completed')}
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5"
                        onClick={() => updateTaskStatus(task.id, 'in-progress')}
                      >
                        <Square className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </h3>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {getAssigneeName(task.assignedTo)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {format(task.dueDate, 'dd MMM', { locale: fr })}
                      </Badge>
                      {getPriorityBadge(task.priority)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardCard>
    </div>
  );
};
