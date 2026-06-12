import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDB } from '@/lib/db';
import { getImageUrl } from '@/lib/s3';
import userProfiles from '@/models/userProfileModel';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();

    const { id } = await params;

    const user_profile = await userProfiles.aggregate([
      {
        $match: {
          userID: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userID',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    if (user_profile.length === 0) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    const profile = user_profile[0];

    if (profile.profilePicture) {
      profile.profilePicture = await getImageUrl(profile.profilePicture);
    }

    if (profile.user) {
      profile.user = Object.fromEntries(
        Object.entries(profile.user).filter(([key]) => key !== 'password')
      );
    }

    return NextResponse.json(
      { message: 'Profile fetched successfully', user_profile: profile },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
