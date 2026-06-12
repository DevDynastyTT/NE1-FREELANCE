import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import AboutUs from '@/models/aboutModel';

export async function GET() {
  try {
    await connectToDB();
    const about = await AboutUs.findOne().lean();
    return NextResponse.json({ information: about?.information ?? null });
  } catch (error) {
    console.error('[getAboutUs] Error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: 'Failed to fetch about us' }, { status: 500 });
  }
}
