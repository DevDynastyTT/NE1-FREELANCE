import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import ReportJob from '@/models/reportModel';

export async function POST(request: NextRequest) {
  try {
    await connectToDB();

    const body = await request.json();
    const { job_id, jobTitle, user_id, freelancer_id, reason, reportCategory } =
      body;

    await ReportJob.create({
      jobID: job_id,
      jobTitle,
      userID: user_id,
      freelancerID: freelancer_id,
      reason,
      reportCategory,
    });

    return NextResponse.json({ message: 'Job reported successfully' });
  } catch (error) {
    console.error('Error reporting job:', error);
    return NextResponse.json(
      { message: 'Failed to report job' },
      { status: 500 }
    );
  }
}
