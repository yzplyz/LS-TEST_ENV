import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function searchWithAI(query) {
  try {
    // First, get AI's analysis and search suggestions
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a location scouting assistant for LocScout. Your task is to help users find perfect locations for their photo and film shoots.
          
          When analyzing a user's query:
          1. Consider the specific type of location they need (urban, rural, industrial, etc.)
          2. Think about visual elements they might want (architecture, nature, lighting)
          3. Consider practical requirements (accessibility, permits, time of day)
          4. Suggest specific types of locations that would match their needs
          5. Format your response in a clear, conversational way
          6. Keep responses concise and focused
          7. End your response with a refined search query in quotes, prefixed with "I'll search for: "
          
          Example response format:
          "I understand you're looking for [type of location]. Based on your requirements, I'd suggest focusing on locations with [specific features].
          
          Here's what I'd recommend looking for:
          • [Specific suggestion 1]
          • [Specific suggestion 2]
          • [Specific suggestion 3]
          
          I'll search for: \"[refined search query]\""
          
          Always end with the exact phrase "I'll search for: " followed by the refined query in quotes.`
        },
        {
          role: "user",
          content: query
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    // Extract the AI's response
    const aiResponse = completion.choices[0].message.content;

    // Now, create an embedding for the search query
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
      encoding_format: "float"
    });

    // Return both the AI response and the embedding
    return {
      aiResponse,
      embedding: embedding.data[0].embedding
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to process your search. Please try again.');
  }
}
