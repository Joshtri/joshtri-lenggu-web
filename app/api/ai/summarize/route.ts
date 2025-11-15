import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

// Allow up to 30 seconds for summarization
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { content, title } = await request.json();

    if (!content) {
      return NextResponse.json(
        { success: false, message: 'Content is required' },
        { status: 400 }
      );
    }

    console.log('Summarizing article with gemini-2.5-flash...');

    // Strip HTML tags from content for better summarization
    const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

    // Create a detailed prompt for better summarization
    const prompt = `You are an expert at creating concise, informative article summaries.

Article Title: ${title || 'Untitled'}

Article Content:
${plainText.substring(0, 8000)} ${plainText.length > 8000 ? '...' : ''}

Task: Create a comprehensive yet concise summary of this article. Your summary should:
1. Capture the main topic and key points
2. Be written in clear, easy-to-understand language
3. Be 3-5 paragraphs long
4. Include the most important insights and conclusions
5. Be helpful for someone deciding whether to read the full article

Write the summary now:`;

    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      prompt,
      temperature: 0.5, // Lower temperature for more focused summaries
      maxOutputTokens: 500,
    });

    console.log('Article summarized successfully');

    return NextResponse.json(
      {
        success: true,
        data: { summary: text },
        message: 'Article summarized successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Summarize API error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to summarize article',
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
