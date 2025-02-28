import express from 'express';
import { getAIResponse } from '../controllers/aiChat.controller';
import { rateLimiter } from '../middleware/rateLimiter';

const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ message: 'AI Chat service is running' });
});

router.post('/ai', rateLimiter, getAIResponse);

export default router; 