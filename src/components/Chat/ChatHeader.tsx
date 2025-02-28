import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = styled.header`
  padding: 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 1.2rem;
  margin: 0;
  color: #2c3e50;
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

const ModeToggle = styled(Button)<{ isAIMode: boolean }>`
  background: ${props => props.isAIMode ? '#4CAF50' : '#2196F3'};
  color: white;
`;

const LogoutButton = styled(Button)`
  background: #dc3545;
  color: white;
`;

interface ChatHeaderProps {
  isAIMode: boolean;
  onToggleMode: () => void;
}

export default function ChatHeader({ isAIMode, onToggleMode }: ChatHeaderProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Header>
      <Title>CampusCare Chat</Title>
      <Controls>
        <ModeToggle isAIMode={isAIMode} onClick={onToggleMode}>
          {isAIMode ? 'Switch to Peer Support' : 'Switch to AI Chat'}
        </ModeToggle>
        <LogoutButton onClick={handleLogout}>End Chat</LogoutButton>
      </Controls>
    </Header>
  );
} 