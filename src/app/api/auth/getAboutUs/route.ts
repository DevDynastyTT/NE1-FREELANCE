import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import mongoose from 'mongoose';
import AboutUs from '@/models/aboutModel';

export async function GET() {
  try {
    await connectToDB();

    const about = await AboutUs.findById(
      new mongoose.Types.ObjectId('6470dc364a25a34351d72000')
    );

    return NextResponse.json(about);
  } catch (error) {
    console.error('Error fetching about us:', error);
    return NextResponse.json(
      { message: 'Failed to fetch about us' },
      { status: 500 }
    );
  }
}
