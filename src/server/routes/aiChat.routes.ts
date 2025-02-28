import express from 'express';
import { getAIResponse } from '../controllers/aiChat.controller';
import { rateLimiter } from '../middleware/rateLimiter';

const router = express.Router();

router.post('/ai', rateLimiter, getAIResponse);

export default router; 