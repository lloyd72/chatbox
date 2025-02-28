import { Request, Response } from 'express';
import { Configuration, OpenAIApi } from 'openai';
import { analyzeEmotion } from '../utils/emotionAnalysis';
import { getResourcesByEmotion } from '../utils/resourceManager';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// System message to guide AI responses
const SYSTEM_MESSAGE = {
  role: 'system',
  content: `You are a supportive and empathetic mental health chat assistant for university students. 
  Your responses should be:
  - Compassionate and understanding
  - Non-judgmental
  - Clear and concise
  - Focused on active listening and validation
  - Professional but warm
  - Careful to avoid giving medical advice
  - Ready to suggest professional help when appropriate
  
  For each response:
  1. Acknowledge the emotion being expressed
  2. Validate their feelings
  3. Offer appropriate support or resources
  4. Encourage positive coping strategies
  
  If you detect signs of crisis or serious mental health concerns, always encourage seeking professional help and provide emergency contact information.`
};

export const getAIResponse = async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;
    const lastMessage = messages[messages.length - 1].content;

    // Analyze emotion in the user's message
    const emotion = await analyzeEmotion(lastMessage);
    
    // Get relevant resources based on emotion
    const relevantResources = getResourcesByEmotion(emotion);

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        SYSTEM_MESSAGE,
        {
          role: 'system',
          content: `The user's message indicates ${emotion.primary} emotion with ${emotion.intensity} intensity. Consider this in your response.`
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 250,
      presence_penalty: 0.6,
    });

    const aiResponse = completion.data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    // Combine AI response with relevant resources
    let finalResponse = aiResponse;

    if (relevantResources.length > 0) {
      finalResponse += '\n\nHere are some resources that might help:\n';
      relevantResources.forEach(resource => {
        finalResponse += `- ${resource.title}: ${resource.description}\n`;
      });
    }

    // Check for crisis keywords
    const crisisKeywords = ['suicide', 'kill myself', 'end my life', 'self-harm'];
    const hasCrisisKeywords = crisisKeywords.some(keyword => 
      lastMessage.toLowerCase().includes(keyword)
    );

    if (hasCrisisKeywords) {
      finalResponse += `\n\nIMPORTANT: If you're having thoughts of suicide or self-harm, please know that help is available 24/7:\n
      - National Crisis Hotline: 988
      - Crisis Text Line: Text HOME to 741741
      - Your university's counseling services: [University-specific number]
      
      You're not alone, and professional help is available to support you through this.`;
    }

    res.json({ 
      message: finalResponse,
      emotion: emotion,
      resources: relevantResources
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
}; 