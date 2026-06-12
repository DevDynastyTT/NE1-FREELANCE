import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Ratings from '@/models/ratingsModel';

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const { jobID, freeLancerID, userID, ratings, feedback } = await req.json();

    const rating = await Ratings.create({
      jobID,
      freeLancerID,
      userID,
      ratings,
      feedback,
    });

    return NextResponse.json(
      { message: 'Rating submitted successfully', rating },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to submit rating' },
      { status: 500 }
    );
  }
}
