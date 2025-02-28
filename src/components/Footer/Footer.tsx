import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #37474f;
  color: white;
  padding: 2rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const EmergencySection = styled.div`
  h3 {
    color: #4CAF50;
    margin-bottom: 1rem;
  }
`;

const ResourceLinks = styled.div`
  a {
    color: white;
    text-decoration: none;
    display: block;
    margin-bottom: 0.5rem;
    
    &:hover {
      color: #4CAF50;
    }
  }
`;

export default function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <EmergencySection>
          <h3>Emergency Contacts</h3>
          <p>National Crisis Hotline: 988</p>
          <p>Crisis Text Line: Text HOME to 741741</p>
          <p>Emergency: 911</p>
        </EmergencySection>

        <ResourceLinks>
          <h3>Mental Health Articles</h3>
          <a href="/articles/stress">Managing Academic Stress</a>
          <a href="/articles/anxiety">Coping with Anxiety</a>
          <a href="/articles/depression">Understanding Depression</a>
          <a href="/articles/resources">Additional Resources</a>
        </ResourceLinks>

        <div>
          <h3>About CampusCare</h3>
          <p>CampusCare provides anonymous mental health support for university students through AI-assisted chat and peer support.</p>
        </div>
      </FooterContent>
    </FooterContainer>
  );
} 