import React, { useState } from 'react';
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

const ErrorMessage = styled.div`
  color: #dc3545;
  margin-top: 1rem;
  text-align: center;
`;

export default function Login() {
  const { signInAnon } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnonymousLogin = async () => {
    try {
      setError('');
      setLoading(true);
      console.log('Starting anonymous login...');
      await signInAnon();
      console.log('Login successful, navigating to chat...');
      navigate('/chat');
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to start chat. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <h1>Welcome to CampusCare</h1>
      <p>Start an anonymous chat session for support</p>
      <LoginButton 
        onClick={handleAnonymousLogin}
        disabled={loading}
      >
        {loading ? 'Starting...' : 'Start Anonymous Chat'}
      </LoginButton>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </LoginContainer>
  );
} 