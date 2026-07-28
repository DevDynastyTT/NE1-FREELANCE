import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import { getImageUrl } from '@/lib/s3';
import Jobs from '@/models/jobsModel';

export async function GET(request: NextRequest) {
  await connectToDB();

  const { searchParams } = new URL(request.url);
  const skip = parseInt(searchParams.get('skip') ?? '0', 10);
  const limit = parseInt(searchParams.get('limit') ?? '100', 10);

  const [total, jobs] = await Promise.all([
    Jobs.countDocuments(),
    Jobs.aggregate([
      { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: limit },
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
    ]),
  ]);

  const reversedJobList = await Promise.all(
    jobs.map(async (job) => ({
      ...job,
      thumbnail: await getImageUrl(job.thumbnail as string),
    }))
  );

  return NextResponse.json({ reversedJobList, total });
}
