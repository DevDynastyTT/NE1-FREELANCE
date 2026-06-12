import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Ratings from '@/models/ratingsModel';

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const { freeLancerID, jobID } = await req.json();

    const ratings = await Ratings.aggregate([
      { $match: { freeLancerID, jobID } },
      {
        $lookup: {
          from: 'users',
          localField: 'userID',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          jobID: 1,
          freeLancerID: 1,
          userID: 1,
          ratings: 1,
          feedback: 1,
          date: 1,
          username: '$user.username',
        },
      },
    ]);

    return NextResponse.json(ratings);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get all ratings' },
      { status: 500 }
    );
  }
}
