import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Ratings from '@/models/ratingsModel';

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const { jobID, freeLancerID, userID } = await req.json();

    const rating = await Ratings.findOne({ jobID, freeLancerID, userID });

    return NextResponse.json({ rating });
  } catch (e) {
    console.error('[GetRatings] Error:', e instanceof Error ? e.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
