
import { useRoomAvailability } from "./useRoomAvailability";
import { useRoomMaintenance } from "./useRoomMaintenance";
import { useRoomCleaning } from "./useRoomCleaning";
import { useRoomBooking } from "./useRoomBooking";
import { RoomExtra } from "@/components/rooms/RoomExtrasSelector";
import { DateRange } from "react-day-picker";

export const useRoomOperations = () => {
  const { makeRoomAvailable, setAllOccupiedToPendingCleaning } = useRoomAvailability();
  const { toggleMaintenanceStatus } = useRoomMaintenance();
  const { toggleCleaningStatus } = useRoomCleaning();
  const { bookRoom } = useRoomBooking();

  return {
    bookRoom,
    makeRoomAvailable,
    toggleMaintenanceStatus,
    toggleCleaningStatus,
    setAllOccupiedToPendingCleaning
  };
};
