import { Server } from 'socket.io';
import { verifyToken } from './utils/auth';

export const initializeSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  // Peer support queue
  const supportQueue: string[] = [];
  const activeSessions: Map<string, string> = new Map();

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const user = await verifyToken(token);
      socket.data.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.data.user.uid);

    socket.on('request_peer_support', () => {
      const userId = socket.data.user.uid;
      supportQueue.push(userId);
      matchPeers();
    });

    socket.on('message', async (data) => {
      const peerId = activeSessions.get(socket.data.user.uid);
      if (peerId) {
        io.to(peerId).emit('message', data);
      }
    });

    socket.on('disconnect', () => {
      handleDisconnect(socket.data.user.uid);
    });
  });

  function matchPeers() {
    while (supportQueue.length >= 2) {
      const user1 = supportQueue.shift()!;
      const user2 = supportQueue.shift()!;
      
      activeSessions.set(user1, user2);
      activeSessions.set(user2, user1);

      io.to(user1).emit('peer_connected');
      io.to(user2).emit('peer_connected');
    }
  }

  function handleDisconnect(userId: string) {
    const peerId = activeSessions.get(userId);
    if (peerId) {
      io.to(peerId).emit('peer_disconnected');
      activeSessions.delete(userId);
      activeSessions.delete(peerId);
    }
    const queueIndex = supportQueue.indexOf(userId);
    if (queueIndex > -1) {
      supportQueue.splice(queueIndex, 1);
    }
  }
}; 