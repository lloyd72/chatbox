interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  tags: string[];
  emotionTags: string[];
}

const mentalHealthResources: Resource[] = [
  {
    id: '1',
    title: 'Mindfulness Meditation Guide',
    description: 'Learn simple meditation techniques for stress relief',
    url: 'https://example.com/mindfulness',
    tags: ['meditation', 'stress-relief', 'self-help'],
    emotionTags: ['anxiety', 'stress', 'overwhelmed']
  },
  {
    id: '2',
    title: 'Depression Support Groups',
    description: 'Find local and online support groups',
    url: 'https://example.com/support-groups',
    tags: ['depression', 'support-group', 'community'],
    emotionTags: ['sadness', 'loneliness', 'depression']
  },
  // Add more resources...
];

export function getResourcesByEmotion(emotion: { primary: string; intensity: string }): Resource[] {
  return mentalHealthResources.filter(resource => 
    resource.emotionTags.includes(emotion.primary.toLowerCase()) ||
    resource.emotionTags.some(tag => 
      tag.includes(emotion.primary.toLowerCase())
    )
  ).slice(0, 3); // Return top 3 most relevant resources
} 