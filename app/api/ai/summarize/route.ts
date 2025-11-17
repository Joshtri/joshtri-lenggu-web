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

    // Strip HTML tags from content for better summarization
    const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

    // Create a detailed prompt for better summarization
    const prompt = `Anda adalah seorang ahli dalam membuat ringkasan artikel yang ringkas, informatif, dan akurat.

    Judul Artikel: ${title || 'Tanpa Judul'}

    Konten Artikel:
    ${plainText.substring(0, 8000)} ${plainText.length > 8000 ? '...' : ''}

    Tugas: Buat ringkasan artikel ini yang komprehensif namun ringkas. Ringkasan Anda harus:
    1. Mencakup topik utama dan poin-poin kunci.
    2. Ditulis dalam bahasa yang jelas dan mudah dipahami (Bahasa Indonesia).
    3. Terdiri dari 3-5 paragraf.
    4. Mencakup wawasan dan kesimpulan yang paling penting.
    5. Bermanfaat bagi pembaca yang ingin memutuskan apakah akan membaca artikel lengkapnya.

    Tulis ringkasan tersebut sekarang:`;

    const { text } = await generateText({
      model: google('gemini-2.0-flash'),
      prompt,
      temperature: 0.5, // Lower temperature for more focused summaries
      // maxTokens: 500,
    });


    return NextResponse.json(
      {
        success: true,
        data: { summary: text },
        message: 'Article summarized successfully',
      },
      { status: 200 }
    );
  } catch (error) {

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
