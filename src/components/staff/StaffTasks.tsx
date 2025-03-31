
import React, { createContext, useContext, useState } from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { StaffMember } from "@/hooks/useStaff";
import { TaskFilters } from "./tasks/TaskFilters";
import { TaskList } from "./tasks/TaskList";
import { useTasksCrud } from "@/hooks/useTasksCrud";
import { Button } from "@/components/ui/button";
import { CreateIndependentTaskDialog } from "./tasks/CreateIndependentTaskDialog";
import { Plus } from "lucide-react";

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignedTo: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
}

interface TasksContextType {
  tasks: Task[];
  updateTaskStatus: (taskId: string, status: 'pending' | 'in-progress' | 'completed') => void;
  deleteTask: (taskId: string) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTaskAssignment: (taskId: string, staffId: string, dueDate: Date) => void;
  isLoading: boolean;
}

export const TasksContext = createContext<TasksContextType>({
  tasks: [],
  updateTaskStatus: () => {},
  deleteTask: () => {},
  addTask: () => {},
  updateTaskAssignment: () => {},
  isLoading: false
});

export const useTasksContext = () => useContext(TasksContext);

interface StaffTasksProps {
  staffMembers: StaffMember[];
}

export const StaffTasks: React.FC<StaffTasksProps> = ({ staffMembers }) => {
  const { 
    getTasks, 
    updateTaskStatus: updateTaskStatusMutation, 
    deleteTask: deleteTaskMutation,
    createTask,
    updateTaskAssignment: updateTaskAssignmentMutation 
  } = useTasksCrud();
  
  const { data: tasks = [], isLoading } = getTasks;

  const [selectedStaff, setSelectedStaff] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [newTask, setNewTask] = useState<string>('');
  const [independentTaskDialogOpen, setIndependentTaskDialogOpen] = useState(false);

  const filteredTasks = tasks
    .filter(task => selectedStaff === "all" || task.assignedTo === selectedStaff)
    .filter(task => selectedStatus === "all" || task.status === selectedStatus);

  const addTask = () => {
    if (!newTask.trim()) return;
    
    createTask.mutate({
      title: newTask,
      assignedTo: selectedStaff === "all" ? staffMembers[0]?.id || '' : selectedStaff,
      dueDate: new Date(),
      priority: 'medium',
      status: 'pending'
    });
    
    setNewTask('');
  };

  const addTaskObject = (taskData: Omit<Task, 'id'>) => {
    createTask.mutate(taskData);
  };

  const handleUpdateTaskStatus = (taskId: string, status: 'pending' | 'in-progress' | 'completed') => {
    updateTaskStatusMutation.mutate({ id: taskId, status });
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTaskMutation.mutate(taskId);
  };

  const handleUpdateTaskAssignment = (taskId: string, staffId: string, dueDate: Date) => {
    updateTaskAssignmentMutation.mutate({ id: taskId, staffId, dueDate });
  };

  const tasksContextValue = {
    tasks,
    updateTaskStatus: handleUpdateTaskStatus,
    deleteTask: handleDeleteTask,
    addTask: addTaskObject,
    updateTaskAssignment: handleUpdateTaskAssignment,
    isLoading
  };

  return (
    <TasksContext.Provider value={tasksContextValue}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Gestion des tâches</h2>
          <Button onClick={() => setIndependentTaskDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle tâche
          </Button>
        </div>
        
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
            isSubmitting={createTask.isPending}
          />
          
          <TaskList
            tasks={filteredTasks}
            staffMembers={staffMembers}
            updateTaskStatus={handleUpdateTaskStatus}
            deleteTask={handleDeleteTask}
            isLoading={isLoading}
          />
        </DashboardCard>
        
        <CreateIndependentTaskDialog 
          open={independentTaskDialogOpen}
          onOpenChange={setIndependentTaskDialogOpen}
          staffMembers={staffMembers}
          tasksContext={tasksContextValue}
        />
      </div>
    </TasksContext.Provider>
  );
};
