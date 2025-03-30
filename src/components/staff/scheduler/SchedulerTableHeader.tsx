
import React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface SchedulerTableHeaderProps {
  days: Date[];
}

export const SchedulerTableHeader: React.FC<SchedulerTableHeaderProps> = ({ days }) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="min-w-[150px]">Employé</TableHead>
        {days.map(day => (
          <TableHead key={day.toString()} className="min-w-[120px] text-center">
            <div className="flex flex-col">
              <span>{format(day, 'eee', { locale: fr })}</span>
              <span className="text-xs">{format(day, 'dd/MM')}</span>
            </div>
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};
