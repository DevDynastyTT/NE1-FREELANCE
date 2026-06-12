import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import { getImageUrl } from '@/lib/s3';
import Jobs from '@/models/jobsModel';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobID: string }> }
) {
  await connectToDB();

  const { jobID } = await params;

  const result = await Jobs.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(jobID) } },
    {
      $lookup: {
        from: 'users',
        localField: 'freeLancerID',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'userprofiles',
        localField: 'freeLancerID',
        foreignField: 'userID',
        as: 'profile',
      },
    },
    { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        freeLancerID: { $toString: '$freeLancerID' },
        title: 1,
        description: 1,
        thumbnail: 1,
        price: 1,
        category: 1,
        username: '$user.username',
        userBio: '$profile.bio',
        profilePicture: '$profile.profilePicture',
      },
    },
  ]);

  if (!result || result.length === 0) {
    return NextResponse.json({ jobDetails: null }, { status: 404 });
  }

  const job = result[0];

  const jobDetails = {
    ...job,
    thumbnail: await getImageUrl(job.thumbnail),
    profilePicture: await getImageUrl(job.profilePicture || ''),
  };

  return NextResponse.json({ jobDetails });
}
