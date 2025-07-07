export interface Message {
  from: 'user' | 'bot';
  text: string;
  timestamp?: Date;
  id?: string;
}

export interface ChatResponse {
  userId: string;
  reply: string;
}

export interface SendMessageRequest {
  userId: string;
  message: string;
}
