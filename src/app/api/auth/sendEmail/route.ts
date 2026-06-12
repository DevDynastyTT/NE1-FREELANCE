import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import { sendContactEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await connectToDB();

    const { name, userEmail, message } = await request.json();

    if (!name || !userEmail || !message) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    await sendContactEmail(name, userEmail, message);

    return NextResponse.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { message: 'Failed to send email' },
      { status: 500 }
    );
  }
}
