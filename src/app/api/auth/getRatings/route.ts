import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Ratings from '@/models/ratingsModel';

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const { jobID, freeLancerID, userID } = await req.json();

    const rating = await Ratings.findOne({ jobID, freeLancerID, userID });

    return NextResponse.json({ rating });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get rating' },
      { status: 500 }
    );
  }
}
