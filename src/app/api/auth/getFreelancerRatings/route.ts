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
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get freelancer ratings' },
      { status: 500 }
    );
  }
}
