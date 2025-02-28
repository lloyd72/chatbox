import express from 'express';
import cors from 'cors';
import { initializeSocket } from './socket';
import aiChatRoutes from './routes/aiChat.routes';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/chat', aiChatRoutes);

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

initializeSocket(server); 