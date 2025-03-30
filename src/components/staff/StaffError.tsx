
import React from "react";

interface StaffErrorProps {
  message: string;
}

export const StaffError: React.FC<StaffErrorProps> = ({ message }) => {
  return (
    <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
      <h3 className="text-lg font-medium text-red-800">Erreur lors du chargement des données</h3>
      <p className="text-red-600 mt-2">{message}</p>
    </div>
  );
};
