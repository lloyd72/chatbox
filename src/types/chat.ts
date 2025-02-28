export interface Message {
  id: string;
  text: string;
  senderId: string;
  sessionId: string;
  timestamp: number;
  isAI?: boolean;
  isPeerSupporter?: boolean;
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: Message[];
  isAIMode: boolean;
  startedAt: number;
  lastMessageAt: number;
} 