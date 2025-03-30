
import React from "react";
import { useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import RoomDialog from "@/components/rooms/RoomDialog";
import RoomInfoCard from "@/components/rooms/RoomInfoCard";
import RoomStatusManager from "@/components/rooms/RoomStatusManager";
import RoomDetailsHeader from "@/components/rooms/RoomDetailsHeader";
import RoomDetailsLoading from "@/components/rooms/RoomDetailsLoading";
import RoomDetailsError from "@/components/rooms/RoomDetailsError";
import DeleteRoomDialog from "@/components/rooms/DeleteRoomDialog";
import { useRoomDetail } from "@/hooks/useRoomDetail";

const RoomDetails = () => {
  const { id } = useParams<{ id: string }>();
  const {
    room,
    loading,
    error,
    roomDialogOpen,
    setRoomDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleSaveRoom,
    handleDeleteRoom,
    handleToggleMaintenance,
    handleToggleCleaning,
    handleMakeAvailable
  } = useRoomDetail(id);

  if (loading) {
    return (
      <AppLayout>
        <RoomDetailsLoading />
      </AppLayout>
    );
  }

  if (error || !room) {
    return (
      <AppLayout>
        <RoomDetailsError error={error} />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <RoomDetailsHeader 
          roomNumber={room.number} 
          onEditClick={() => setRoomDialogOpen(true)} 
          onDeleteClick={() => setDeleteDialogOpen(true)} 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RoomInfoCard room={room} />
          <RoomStatusManager 
            room={room}
            onMakeAvailable={handleMakeAvailable}
            onToggleMaintenance={handleToggleMaintenance}
            onToggleCleaning={handleToggleCleaning}
          />
        </div>
      </div>

      <RoomDialog
        room={room}
        open={roomDialogOpen}
        onOpenChange={setRoomDialogOpen}
        onSave={handleSaveRoom}
      />

      <DeleteRoomDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        roomNumber={room.number}
        onConfirmDelete={handleDeleteRoom}
      />
    </AppLayout>
  );
};

export default RoomDetails;
