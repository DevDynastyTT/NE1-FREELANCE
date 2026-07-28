import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import AboutUs from '@/models/aboutModel';

export async function POST(request: NextRequest) {
  try {
    await connectToDB();

    const { information } = await request.json();

    if (!information) {
      return NextResponse.json(
        { message: 'Missing information' },
        { status: 400 }
      );
    }

    await AboutUs.findOneAndUpdate(
      { update: 1 },
      { information }
    );

    return NextResponse.json({ message: 'About updated' });
  } catch (error) {
    console.error('Error updating about:', error);
    return NextResponse.json(
      { message: 'Failed to update about' },
      { status: 500 }
    );
  }
}
