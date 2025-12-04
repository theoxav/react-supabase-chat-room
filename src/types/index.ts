export interface Message {
  id: number;
  content: string;
  user_id: string;
  email: string;
  room_id: number;
  created_at: string;
}

export interface MessageFormData {
  message: string;
}


export interface Room {
  id: number;
  name: string;
}

export interface RoomFormData {
  name: string;
}
