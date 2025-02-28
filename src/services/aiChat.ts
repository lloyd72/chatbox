import axios from 'axios';
import { Message } from '../types/chat';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const getAIResponse = async (
  messages: Message[], 
  currentUserId: string
): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}/api/chat/ai`, {
      messages: messages.map(msg => ({
        role: msg.senderId === currentUserId ? 'user' : 'assistant',
        content: msg.text
      }))
    });
    
    return response.data.message;
  } catch (error) {
    console.error('Error getting AI response:', error);
    throw new Error('Failed to get AI response');
  }
}; 