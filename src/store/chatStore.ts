import { create } from 'zustand';

interface Room {
  id: number;
  name: string;
}

interface ChatStore {
  currentRoom: Room | null;
  setCurrentRoom: (room: Room | null) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  currentRoom: { id: 1, name: 'General' },
  setCurrentRoom: (room: Room | null) => set({ currentRoom: room }),
}));
