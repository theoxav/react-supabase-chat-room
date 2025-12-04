import type { Room } from '@/types';
import RoomItem from './room-item';

const RoomsList = ({ rooms }: { rooms: Room[] | undefined }) => {
  return (
    <ul>
      {rooms?.map((room) => (
        <RoomItem key={room.id} room={room} />
      ))}
    </ul>
  );
};

export default RoomsList;
