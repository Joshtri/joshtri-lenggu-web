import { google } from '@ai-sdk/google';
import { streamText, convertToCoreMessages } from 'ai';
import { NextRequest } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages must be an array' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // console.log('Starting chat stream with gemini-2.0-flash...');

    // Convert messages to the proper format for the AI SDK
    const coreMessages = convertToCoreMessages(messages);

    const result = streamText({
      model: google('gemini-2.0-flash'),
      system: 'You are a helpful AI assistant. Provide clear, concise, and accurate responses.',
      messages: coreMessages,
      temperature: 0.7,
      onError: ({ error }) => {
        console.error('StreamText error:', error);
      },
      // onFinish: ({ usage, finishReason }) => {
      //   console.log('Chat completion finished', { usage, finishReason });
      // },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}