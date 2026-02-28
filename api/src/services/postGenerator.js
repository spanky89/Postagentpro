import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate post content based on business info and optional photo
 */
export async function generatePostContent(business, postType = 'general', photoDescription = null) {
  try {
    const { name, type, locationCity, locationState, description } = business;

    // Build context prompt
    const systemPrompt = `You are a social media expert creating engaging posts for small contractor businesses.
Create posts that:
- Are conversational and authentic (not corporate/salesy)
- Include a clear call-to-action
- Use 1-2 relevant emojis (not excessive)
- Are 80-150 words (Facebook/Google optimal length)
- Focus on value to customers (not "we're the best")
- Match the local, service-based business vibe
${photoDescription ? `- Reference the work shown in the photo naturally` : ''}

Business context:
- Name: ${name}
- Type: ${type}
- Location: ${locationCity}, ${locationState}
${description ? `- About: ${description}` : ''}`;

    const userPrompt = photoDescription 
      ? `Write a post about this ${type.toLowerCase()} project: ${photoDescription}. Make it about the work shown, why it matters, and encourage customers to reach out.`
      : getPromptForPostType(type, postType, locationCity, locationState);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 200
    });

    const content = completion.choices[0].message.content.trim();
    
    return {
      content,
      postType,
      tokensUsed: completion.usage.total_tokens
    };
  } catch (error) {
    console.error('Post generation error:', error);
    throw new Error('Failed to generate post content');
  }
}

/**
 * Get prompt template based on business type and post type
 */
function getPromptForPostType(businessType, postType, city, state) {
  const templates = {
    general: [
      `Write a helpful tip post about ${businessType.toLowerCase()} services that homeowners in ${city}, ${state} would appreciate.`,
      `Write a post about common ${businessType.toLowerCase()} mistakes homeowners make and how to avoid them.`,
      `Write a seasonal post about ${businessType.toLowerCase()} maintenance for ${city} residents.`,
      `Write a "did you know" post about ${businessType.toLowerCase()} facts that surprise most people.`,
      `Write a post answering a common question about ${businessType.toLowerCase()} services.`
    ],
    promotional: [
      `Write a post offering a special promotion for ${businessType.toLowerCase()} services in ${city}.`,
      `Write a post about a limited-time offer for new customers.`
    ],
    seasonal: [
      `Write a seasonal post about preparing for winter/summer as a ${businessType.toLowerCase()} in ${city}.`,
      `Write a holiday-themed post for ${businessType.toLowerCase()} services.`
    ],
    educational: [
      `Write an educational post teaching homeowners something useful about ${businessType.toLowerCase()}.`,
      `Write a "myth vs fact" post about ${businessType.toLowerCase()} services.`
    ],
    testimonial: [
      `Write a post highlighting the value of professional ${businessType.toLowerCase()} services (without being too salesy).`,
      `Write a post about the peace of mind that comes with hiring a professional ${businessType.toLowerCase()}.`
    ]
  };

  const typeTemplates = templates[postType] || templates.general;
  const randomTemplate = typeTemplates[Math.floor(Math.random() * typeTemplates.length)];
  
  return randomTemplate;
}

/**
 * Generate hashtags for a post
 */
export function generateHashtags(business, postContent) {
  const { type, locationCity, locationState } = business;
  
  const hashtags = [];
  
  // Business type hashtags
  const typeTag = type.replace(/\s+/g, '');
  hashtags.push(`#${typeTag}`);
  hashtags.push(`#${typeTag}Services`);
  
  // Location hashtags
  const cityTag = locationCity.replace(/\s+/g, '');
  hashtags.push(`#${cityTag}${locationState}`);
  hashtags.push(`#${cityTag}${typeTag}`);
  
  // Generic contractor hashtags
  hashtags.push('#LocalBusiness');
  hashtags.push('#HomeImprovement');
  
  // Return first 5-7 hashtags
  return hashtags.slice(0, 6).join(' ');
}

/**
 * Generate a complete post with content + hashtags + optional media
 */
export async function generateCompletePost(business, postType = 'general', mediaUrl = null, photoDescription = null) {
  const { content, tokensUsed } = await generatePostContent(business, postType, photoDescription);
  const hashtags = generateHashtags(business, content);
  
  return {
    content: `${content}\n\n${hashtags}`,
    rawContent: content,
    hashtags,
    mediaUrl, // User-uploaded photo URL
    postType,
    tokensUsed
  };
}
