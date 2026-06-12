import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Ratings from '@/models/ratingsModel';

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const { jobID, freeLancerID, userID, ratings, feedback } = await req.json();

    const rating = await Ratings.findOneAndUpdate(
      { jobID, freeLancerID, userID },
      { ratings, feedback },
      { new: true }
    );

    if (!rating) {
      return NextResponse.json(
        { error: 'Rating not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Rating updated', rating });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update rating' },
      { status: 500 }
    );
  }
}
