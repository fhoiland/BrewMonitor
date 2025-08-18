import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export async function generateBlogPost(topic: string, additionalContext?: string): Promise<{
  title: string;
  summary: string;
  content: string;
}> {
  try {
    const prompt = `Generate a blog post about brewing beer with the following topic: "${topic}". ${additionalContext ? `Additional context: ${additionalContext}` : ''}

Write the blog post in Norwegian language suitable for a brewing blog called "Prefab Brew Crew". The post should be informative, engaging, and focused on home brewing techniques, experiences, or equipment.

Respond with JSON in this exact format:
{
  "title": "Blog post title in Norwegian",
  "summary": "A brief 1-2 sentence summary in Norwegian",
  "content": "Full blog post content in Norwegian (3-5 paragraphs)"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a Norwegian brewing expert writing for a home brewing blog. Write engaging, informative content about beer brewing techniques, equipment, and experiences."
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    if (!result.title || !result.summary || !result.content) {
      throw new Error("Invalid response from OpenAI");
    }

    return {
      title: result.title,
      summary: result.summary,
      content: result.content,
    };
  } catch (error) {
    throw new Error("Failed to generate blog post: " + (error as Error).message);
  }
}
