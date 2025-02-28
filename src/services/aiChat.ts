import axios from 'axios';
import { Message } from '../types/chat';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const getAIResponse = async (
  messages: Message[], 
  currentUserId: string
): Promise<string> => {
  try {
    console.log('Sending request to AI service:', {
      url: `${API_URL}/api/chat/ai`,
      messages: messages.length,
      userId: currentUserId
    });

    const response = await axios.post(`${API_URL}/api/chat/ai`, {
      messages: messages.map(msg => ({
        role: msg.senderId === currentUserId ? 'user' : 'assistant',
        content: msg.text
      })),
      userId: currentUserId
    });
    
    console.log('AI service response:', response.data);

    if (!response.data.message) {
      throw new Error('No response from AI service');
    }
    
    return response.data.message;
  } catch (error: any) {
    console.error('Detailed AI response error:', {
      error: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw new Error(error.response?.data?.error || 'Failed to get AI response');
  }
}; 