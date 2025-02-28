import React from 'react';
import styled from 'styled-components';
import { Message } from '../../types/chat';

const MessageContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

const MessageBubble = styled.div<{ isOwn: boolean }>`
  max-width: 70%;
  margin: ${props => props.isOwn ? '0.5rem 0 0.5rem auto' : '0.5rem auto 0.5rem 0'};
  padding: 1rem;
  border-radius: 1rem;
  background: ${props => props.isOwn ? '#007bff' : '#e9ecef'};
  color: ${props => props.isOwn ? 'white' : 'black'};
  word-wrap: break-word;
`;

const MessageTime = styled.div`
  font-size: 0.8rem;
  color: #6c757d;
  text-align: right;
  margin-top: 0.25rem;
`;

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export default function MessageList({ messages, currentUserId }: MessageListProps) {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <MessageContainer>
      {messages.map((message) => (
        <MessageBubble 
          key={message.id} 
          isOwn={message.senderId === currentUserId}
        >
          {message.text}
          <MessageTime>{formatTime(message.timestamp)}</MessageTime>
        </MessageBubble>
      ))}
    </MessageContainer>
  );
} 