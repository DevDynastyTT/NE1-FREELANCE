import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Services from '@/models/serviceModel';

export async function GET() {
  try {
    await connectToDB();

    const count = await Services.countDocuments();

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error counting services:', error);
    return NextResponse.json(
      { message: 'Failed to count services' },
      { status: 500 }
    );
  }
}
