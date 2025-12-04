import { useForm } from 'react-hook-form';
import { useChatStore } from '../../../store/chatStore';
import { useAuthStore } from '../../../store/authStore';
import type { Message, MessageFormData } from '../../../types';
import { sendMessage } from '../../../services/message';

const ChatMessageForm = () => {
  const { user } = useAuthStore();
  const { currentRoom } = useChatStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MessageFormData>();

  const onSubmit = async (data: MessageFormData) => {
    if (!currentRoom || !user) return;

    try {
      await sendMessage({
        content: data.message,
        user_id: user.id,
        email: user.email!,
        room_id: currentRoom.id,
      } as Message);

      reset();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        className="conv-input"
        placeholder={
          errors.message ? errors.message.message : 'Type your message...'
        }
        {...register('message', { required: 'Please type your message !' })}
      />
      <button className="conv-button">send</button>
    </form>
  );
};

export default ChatMessageForm;
