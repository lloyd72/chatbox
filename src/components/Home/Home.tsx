import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const HomeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
  color: #37474f;
`;

const Hero = styled.section`
  padding: 4rem 2rem;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const StartButton = styled.button`
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }
`;

const ResourcesSection = styled.section`
  padding: 3rem 2rem;
  background: rgba(255, 255, 255, 0.9);
`;

const ResourceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ResourceCard = styled.div`
  padding: 1.5rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

export default function Home() {
  const navigate = useNavigate();
  const { signInAnon } = useAuth();

  const handleStartChat = async () => {
    try {
      await signInAnon();
      navigate('/chat');
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  return (
    <HomeContainer>
      <Hero>
        <h1>Welcome to CampusCare</h1>
        <p>A safe space to talk about your mental health</p>
        <StartButton onClick={handleStartChat}>
          Start Anonymous Chat
        </StartButton>
      </Hero>

      <ResourcesSection>
        <h2>Mental Health Resources</h2>
        <ResourceGrid>
          <ResourceCard>
            <h3>Counseling Services</h3>
            <p>Access free counseling through your university</p>
          </ResourceCard>
          <ResourceCard>
            <h3>Self-Help Tools</h3>
            <p>Discover techniques for managing stress and anxiety</p>
          </ResourceCard>
          <ResourceCard>
            <h3>Crisis Support</h3>
            <p>24/7 support when you need it most</p>
          </ResourceCard>
        </ResourceGrid>
      </ResourcesSection>
    </HomeContainer>
  );
} 