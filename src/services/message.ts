import { supabase } from '@/supabaseClient';
import type { Message } from '@/types';

export const getMessages = async (roomId: number): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true });

  if (error) throw Error(error.message);

  return data;
};

export const sendMessage = async ({
  content,
  user_id,
  email,
  room_id,
}: Message) => {
  const { error } = await supabase.from('messages').insert({
    content,
    user_id,
    email,
    room_id,
  });

  if (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};
