
import { useState, useMemo } from "react";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";

export const useSchedulerDays = (initialDateRange?: DateRange) => {
  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRange>(
    initialDateRange || {
      from: today,
      to: addDays(today, 6)
    }
  );

  // Generate array of days between from and to dates
  const days = useMemo(() => {
    if (!dateRange.from) return [];
    
    const daysArray = [];
    const start = new Date(dateRange.from);
    const end = dateRange.to ? new Date(dateRange.to) : new Date(dateRange.from);
    
    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
      daysArray.push(new Date(dt));
    }
    
    return daysArray;
  }, [dateRange]);

  return {
    dateRange,
    setDateRange,
    days
  };
};
