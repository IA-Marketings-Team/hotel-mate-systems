
import React, { useState } from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { StaffMember } from "@/hooks/useStaff";
import { TaskFilters } from "./tasks/TaskFilters";
import { TaskList } from "./tasks/TaskList";

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

  return (
    <div className="space-y-6">
      <DashboardCard title="Liste des tâches">
        <TaskFilters
          newTask={newTask}
          setNewTask={setNewTask}
          selectedStaff={selectedStaff}
          setSelectedStaff={setSelectedStaff}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          staffMembers={staffMembers}
          addTask={addTask}
        />
        
        <TaskList
          tasks={filteredTasks}
          staffMembers={staffMembers}
          updateTaskStatus={updateTaskStatus}
          deleteTask={deleteTask}
        />
      </DashboardCard>
    </div>
  );
};
