import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import { getImageUrl } from '@/lib/s3';
import Jobs from '@/models/jobsModel';
import JobCategories from '@/models/jobCategoriesModel';
import Users from '@/models/userModel';
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobCategory: string; search: string }> }
) {
  await connectToDB();

  const { jobCategory, search } = await params;

  const query: Record<string, unknown> = {
    $or: [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ],
  };

  if (jobCategory && jobCategory !== 'undefined') {
    query.category = jobCategory;
  }

  if (jobCategory && jobCategory !== 'undefined') {
    const categoryExists = await JobCategories.findOne({ name: jobCategory });
    if (!categoryExists) {
      return NextResponse.json({ job_list: [] });
    }
  }

  const jobs = await Jobs.find(query);

  const job_list = await Promise.all(
    jobs.map(async (job) => {
      const user = await Users.findById(job.freeLancerID);
      return {
        _id: job._id,
        freeLancerID: job.freeLancerID,
        title: job.title,
        description: job.description,
        thumbnail: await getImageUrl(job.thumbnail as string),
        price: job.price,
        category: job.category,
        username: user ? user.username : '',
      };
    })
  );

  return NextResponse.json({ job_list });
}
