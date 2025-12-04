import RoomsList from '@/components/features/rooms/rooms-list';
import { getRooms } from '@/services/room';
import { useQuery } from '@tanstack/react-query';

const RoomListPage = () => {
  const {
    data: rooms,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => getRooms(),
  });

  if (isLoading) return <p className="loader-text">Loading rooms...</p>;
  if (error)
    return <p className="loader-text">Error loading rooms: {error.message}</p>;

  return (
    <div className="room-list">
      <h2>Available Rooms</h2>
      <RoomsList rooms={rooms} />

    </div>
  );
};

export default RoomListPage;
