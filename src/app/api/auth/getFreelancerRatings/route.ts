import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Ratings from '@/models/ratingsModel';

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const { freeLancerID, jobID } = await req.json();

    const ratings = await Ratings.find({ freeLancerID, jobID });

    const totalRating = ratings.reduce((sum, r) => sum + r.ratings, 0);

    return NextResponse.json({ totalRating, count: ratings.length });
  } catch (e) {
    console.error('[GetFreelancerRatings] Error:', e instanceof Error ? e.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
