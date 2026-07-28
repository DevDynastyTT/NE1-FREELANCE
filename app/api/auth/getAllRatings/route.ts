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
        $addFields: {
          userObjId: {
            $cond: {
              if: { $regexMatch: { input: '$userID', regex: /^[a-f\d]{24}$/i } },
              then: { $toObjectId: '$userID' },
              else: null,
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userObjId',
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
          username: { $ifNull: ['$user.username', 'Anonymous'] },
        },
      },
    ]);

    return NextResponse.json(ratings);
  } catch (e) {
    console.error('[GetAllRatings] Error:', e instanceof Error ? e.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
