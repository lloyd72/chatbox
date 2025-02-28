import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;
`;

const LoginButton = styled.button`
  padding: 15px 30px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }
`;

export default function Login() {
  const { signInAnon } = useAuth();
  const navigate = useNavigate();

  const handleAnonymousLogin = async () => {
    try {
      await signInAnon();
      navigate('/chat');
    } catch (error) {
      console.error('Error during anonymous login:', error);
    }
  };

  return (
    <LoginContainer>
      <h1>Welcome to CampusCare</h1>
      <p>Start an anonymous chat session for support</p>
      <LoginButton onClick={handleAnonymousLogin}>
        Start Anonymous Chat
      </LoginButton>
    </LoginContainer>
  );
} 