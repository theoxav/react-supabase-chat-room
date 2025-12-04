import { useChatStore } from '@/store/chatStore';
import type { Room } from '@/types';
import { Link } from 'react-router';

const RoomItem = ({ room }: { room: Room }) => {
  const handleJoinRoom = (room: Room): void => {
    useChatStore.getState().setCurrentRoom(room);
  };

  return (
    <li>
      <Link to={`/rooms/${room.id}`} onClick={() => handleJoinRoom(room)}>
        {room.name}
      </Link>
    </li>
  );
};

export default RoomItem;
