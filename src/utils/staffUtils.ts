
export const getRoleName = (role: string) => {
  switch (role) {
    case "manager":
      return "Directeur";
    case "receptionist":
      return "Réceptionniste";
    case "housekeeper":
      return "Femme de chambre";
    case "waiter":
      return "Serveur";
    case "chef":
      return "Chef";
    case "bartender":
      return "Barman";
    case "maintenance":
      return "Maintenance";
    default:
      return role;
  }
};

export const getShiftName = (shift: string) => {
  switch (shift) {
    case "morning":
      return "Matin";
    case "afternoon":
      return "Après-midi";
    case "night":
      return "Nuit";
    default:
      return shift;
  }
};

export const getShiftColor = (type: string) => {
  switch (type) {
    case "morning":
      return "bg-blue-100 text-blue-800"; 
    case "afternoon":
      return "bg-amber-100 text-amber-800";
    case "night":
      return "bg-indigo-100 text-indigo-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getRoleColor = (role: string) => {
  switch (role) {
    case "manager":
      return "bg-purple-100 text-purple-800";
    case "receptionist":
      return "bg-blue-100 text-blue-800";
    case "housekeeper":
      return "bg-green-100 text-green-800";
    case "waiter":
      return "bg-yellow-100 text-yellow-800";
    case "chef":
      return "bg-red-100 text-red-800";
    case "bartender":
      return "bg-orange-100 text-orange-800";
    case "maintenance":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getTaskPriorityName = (priority: string) => {
  switch (priority) {
    case "low":
      return "Basse";
    case "medium":
      return "Moyenne";
    case "high":
      return "Haute";
    default:
      return priority;
  }
};

export const getTaskPriorityColor = (priority: string) => {
  switch (priority) {
    case "low":
      return "bg-blue-100 text-blue-800";
    case "medium":
      return "bg-amber-100 text-amber-800";
    case "high":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getTaskStatusName = (status: string) => {
  switch (status) {
    case "pending":
      return "À faire";
    case "in-progress":
      return "En cours";
    case "completed":
      return "Terminé";
    default:
      return status;
  }
};

export const getTaskStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-gray-100 text-gray-800";
    case "in-progress":
      return "bg-amber-100 text-amber-800";
    case "completed":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
