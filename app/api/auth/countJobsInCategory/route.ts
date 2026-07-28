import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Jobs from '@/models/jobsModel';

export async function GET() {
  await connectToDB();

  const result = await Jobs.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
  ]);

  return NextResponse.json(result);
}
