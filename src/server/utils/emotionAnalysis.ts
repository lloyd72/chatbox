interface EmotionAnalysis {
  primary: string;
  secondary?: string;
  intensity: 'low' | 'medium' | 'high';
}

export async function analyzeEmotion(text: string): Promise<EmotionAnalysis> {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Analyze the emotional content of this text and return the primary emotion, optional secondary emotion, and intensity (low, medium, high): "${text}"`,
      max_tokens: 50,
      temperature: 0.3,
    });

    // Parse the response to extract emotion data
    const analysis = response.data.choices[0]?.text || '';
    
    // Simple parsing logic - in production, use more robust parsing
    const emotions = analysis.match(/primary: (.*?), intensity: (.*?)(?:, secondary: (.*?))?$/);
    
    return {
      primary: emotions?.[1] || 'neutral',
      secondary: emotions?.[3],
      intensity: (emotions?.[2] || 'medium') as 'low' | 'medium' | 'high'
    };
  } catch (error) {
    console.error('Emotion analysis error:', error);
    return {
      primary: 'neutral',
      intensity: 'medium'
    };
  }
} 