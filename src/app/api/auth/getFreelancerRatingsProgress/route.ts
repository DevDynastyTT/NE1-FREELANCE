import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Ratings from '@/models/ratingsModel';

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const { freeLancerID, jobID } = await req.json();

    const progress = await Ratings.aggregate([
      { $match: { freeLancerID, jobID } },
      { $group: { _id: '$ratings', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    return NextResponse.json(progress);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get ratings progress' },
      { status: 500 }
    );
  }
}
