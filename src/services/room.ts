import { useChatStore } from '@/store/chatStore';
import { supabase } from '@/supabaseClient';
import type { Room } from '@/types';

export const getRooms = async (): Promise<Room[]> => {
  const { data, error } = await supabase.from('rooms').select('*');
  if (error) throw Error(error.message);
  return data;
};

export const CreateRoom = async ({ name }: Room) => {
  const { error, data: newRoom } = await supabase
    .from('rooms')
    .insert({
      name,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating room:', error.message);
    throw error;
  }

  if (newRoom) {
    useChatStore
      .getState()
      .setCurrentRoom({ id: newRoom.id, name: newRoom.name });
  }
};
