import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../../contexts/AuthContext';
import { Message } from '../../types/chat';
import { encryptMessage, decryptMessage } from '../../utils/encryption';

interface PeerSupportProps {
  onMessageReceived: (message: Message) => void;
}

export default function PeerSupport({ onMessageReceived }: PeerSupportProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isPeerConnected, setIsPeerConnected] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001', {
      auth: {
        token: currentUser?.uid
      }
    });

    newSocket.on('connect', () => {
      console.log('Connected to peer support system');
    });

    newSocket.on('peer_connected', () => {
      setIsPeerConnected(true);
    });

    newSocket.on('peer_disconnected', () => {
      setIsPeerConnected(false);
    });

    newSocket.on('message', async (encryptedMessage: string) => {
      const decryptedMessage = await decryptMessage(encryptedMessage);
      onMessageReceived(JSON.parse(decryptedMessage));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser]);

  return null; // This component handles socket logic only
} 