import ChatMessageForm from '../components/features/chat/chat-message-form';
import ChatMessages from '../components/features/chat/chat-messages';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';

const ChatRoomPage = () => {
  const { user } = useAuthStore();
  const { currentRoom } = useChatStore();

  if(!currentRoom) {
    return <p>Please join or create a room first.</p>
  }

  return (
    <div className="conv">
      <div className="conv-title">
        {currentRoom?.name} - {user?.email}
      </div>

      <div className='conv-timeline'>
        <ChatMessages />
      </div>
      <div className='conv-send-message'>
        <ChatMessageForm/>
      </div>
    </div>
  );
};

export default ChatRoomPage;
