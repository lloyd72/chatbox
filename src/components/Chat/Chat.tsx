import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase.config';
import { collection, addDoc, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import styled from 'styled-components';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { Message } from '../../types/chat';
import { getAIResponse } from '../../services/aiChat';
import PeerSupport from './PeerSupport';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  background: #ffffff;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
`;

const ChatMain = styled.main`
  flex: 1;
  overflow-y: auto;
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
  const [isPeerMode, setIsPeerMode] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'messages'),
      where('sessionId', '==', currentUser.uid),
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

  const handleMessageReceived = async (message: Message) => {
    try {
      await addDoc(collection(db, 'messages'), {
        ...message,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error saving peer message:', error);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !currentUser) return;

    setLoading(true);
    try {
      const userMessage: Omit<Message, 'id'> = {
        text,
        senderId: currentUser.uid,
        sessionId: currentUser.uid,
        timestamp: Date.now(),
        isAI: false,
        isPeerSupporter: false
      };

      await addDoc(collection(db, 'messages'), userMessage);

      if (isAIMode) {
        setIsProcessing(true);
        try {
          const aiResponse = await getAIResponse(messages, currentUser.uid);
          
          await addDoc(collection(db, 'messages'), {
            text: aiResponse,
            senderId: 'ai-assistant',
            sessionId: currentUser.uid,
            timestamp: Date.now(),
            isAI: true,
            isPeerSupporter: false
          });
        } catch (error) {
          console.error('Error getting AI response:', error);
          await addDoc(collection(db, 'messages'), {
            text: "I'm sorry, I'm having trouble responding right now. Please try again.",
            senderId: 'ai-assistant',
            sessionId: currentUser.uid,
            timestamp: Date.now(),
            isAI: true,
            isPeerSupporter: false
          });
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  };

  const toggleChatMode = () => {
    setIsAIMode(!isAIMode);
  };

  useEffect(() => {
    if (!isAIMode && !isPeerMode) {
      setIsPeerMode(true);
    }
  }, [isAIMode]);

  return (
    <ChatContainer>
      <ChatHeader 
        isAIMode={isAIMode} 
        onToggleMode={toggleChatMode} 
      />
      <ChatMain>
        {!isAIMode && <PeerSupport onMessageReceived={handleMessageReceived} />}
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