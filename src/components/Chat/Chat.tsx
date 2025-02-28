import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase.config';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import styled from 'styled-components';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { Message } from '../../types/chat';
import { getAIResponse } from '../../services/aiChat';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  background: #ffffff;
`;

const ChatMain = styled.main`
  flex: 1;
  overflow: hidden;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const TypingIndicator = styled.div`
  padding: 0.5rem 1rem;
  color: #6c757d;
  font-style: italic;
  text-align: center;
`;

export default function Chat() {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAIMode, setIsAIMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !currentUser) return;

    setLoading(true);
    try {
      // Add user message
      const userMessage: Omit<Message, 'id'> = {
        text,
        senderId: currentUser.uid,
        timestamp: Date.now(),
        isAI: false,
        isPeerSupporter: false
      };

      const userMessageRef = await addDoc(collection(db, 'messages'), userMessage);

      if (isAIMode) {
        setIsProcessing(true);
        // Get AI response
        const aiResponse = await getAIResponse(
          [...messages, { ...userMessage, id: userMessageRef.id }],
          currentUser.uid
        );

        // Add AI message
        await addDoc(collection(db, 'messages'), {
          text: aiResponse,
          senderId: 'ai-assistant',
          timestamp: Date.now(),
          isAI: true,
          isPeerSupporter: false
        });
      }
    } catch (error) {
      console.error('Error in chat:', error);
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  };

  const toggleChatMode = () => {
    setIsAIMode(!isAIMode);
  };

  return (
    <ChatContainer>
      <ChatHeader 
        isAIMode={isAIMode} 
        onToggleMode={toggleChatMode} 
      />
      <ChatMain>
        <MessageList 
          messages={messages} 
          currentUserId={currentUser?.uid || ''} 
        />
        {isProcessing && (
          <TypingIndicator>AI is typing...</TypingIndicator>
        )}
        <div ref={messagesEndRef} />
      </ChatMain>
      <ChatInput 
        onSendMessage={handleSendMessage} 
        disabled={loading || isProcessing} 
      />
    </ChatContainer>
  );
} 