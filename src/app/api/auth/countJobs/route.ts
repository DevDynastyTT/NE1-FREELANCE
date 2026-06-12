import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Jobs from '@/models/jobsModel';

export async function GET() {
  await connectToDB();

  const count = await Jobs.countDocuments();

  return NextResponse.json({ count });
}
