import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import { getImageUrl } from '@/lib/s3';
import Jobs from '@/models/jobsModel';
import mongoose from 'mongoose';

export async function GET() {
  await connectToDB();

  const jobs = await Jobs.aggregate([
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
      $project: {
        _id: 1,
        freeLancerID: 1,
        title: 1,
        description: 1,
        thumbnail: 1,
        price: 1,
        category: 1,
        username: '$user.username',
      },
    },
  ]);

  const reversedJobList = await Promise.all(
    jobs.reverse().map(async (job: any) => ({
      ...job,
      thumbnail: await getImageUrl(job.thumbnail as string),
    }))
  );

  return NextResponse.json({ reversedJobList });
}
