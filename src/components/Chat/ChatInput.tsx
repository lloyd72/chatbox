import React, { useState } from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
  padding: 1rem;
  background: #f8f9fa;
  border-top: 1px solid #dee2e6;
`;

const Form = styled.form`
  display: flex;
  gap: 1rem;
`;

const TextArea = styled.textarea`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  resize: none;
  min-height: 50px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
  }
`;

const SendButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <InputContainer>
      <Form onSubmit={handleSubmit}>
        <TextArea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          disabled={disabled}
        />
        <SendButton type="submit" disabled={disabled || !message.trim()}>
          Send
        </SendButton>
      </Form>
    </InputContainer>
  );
} 