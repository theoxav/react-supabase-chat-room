import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMessages } from '@/services/message';
import { useChatStore } from '@/store/chatStore';
import type { Message } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { formatDate } from '@/lib/utils';
import { useEffect } from 'react';
import { supabase } from '@/supabaseClient';

const ChatMessages = () => {
  const { user } = useAuthStore();
  const { currentRoom } = useChatStore();
  const queryClient = useQueryClient();

  const {
    data: messages,
    isLoading,
    error,
  } = useQuery<Message[], Error>({
    queryKey: ['messages', currentRoom?.id],
    queryFn: () =>
      currentRoom?.id === null
        ? Promise.resolve([])
        : getMessages(currentRoom!.id),
    enabled: currentRoom?.id !== null,
  });

  useEffect(() => {
    if (!currentRoom?.id) return;

    const channel = supabase
      .channel(`room-${currentRoom?.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMessage = payload.new as Message;
          if (newMessage.room_id === currentRoom?.id) {
            queryClient.setQueryData<Message[]>(
              ['messages', currentRoom?.id],
              (oldMessages) =>
                oldMessages ? [...oldMessages, newMessage] : [newMessage]
            );
          }
        }
      )
      .subscribe((status) => {
        console.log('Channel status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentRoom?.id]);

  if (!currentRoom?.id) return null;

  if (isLoading) return <p className="loader-text">Loading messages...</p>;

  if (error)
    return (
      <p className="loader-text">Error loading messages: {error.message}</p>
    );

  return (
    <>
      {messages?.map((msg: Message) => {
        const isOwnMessage = msg.user_id === user?.id;
        const itemClass = isOwnMessage ? 'right' : 'left';

        return (
          <div
            key={msg.id}
            className={`conv-message-item conv-message-item--${itemClass}`}
          >
            <div className="conv-message-value"> {msg.content} </div>
            <div className="conv-message-details">
              {' '}
              {formatDate(new Date(msg.created_at))}
            </div>
            <div className="conv-message-details"> {msg.email} </div>
          </div>
        );
      })}
    </>
  );
};

export default ChatMessages;
