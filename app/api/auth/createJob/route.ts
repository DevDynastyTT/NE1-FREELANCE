import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import { uploadToS3 } from '@/lib/s3';
import Jobs from '@/models/jobsModel';

export async function POST(request: NextRequest) {
  try {
    await connectToDB();

    const formData = await request.formData();
    const freeLancerID = formData.get('freeLancerID') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const category = formData.get('category') as string;

    const file = formData.get('thumbnail') as File | null;
    let thumbnail = '';

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const timestamp = Date.now();
      const fileName = `thumbnails/${timestamp}_${file.name}`;
      thumbnail = await uploadToS3(buffer, fileName);
    } else {
      thumbnail = 'default-thumbnail.png';
    }

    await Jobs.create({
      freeLancerID,
      title,
      description,
      thumbnail,
      price: Number(price),
      category,
    });

    return NextResponse.json({ message: 'Created job successfully' });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { message: 'Failed to create job' },
      { status: 500 }
    );
  }
}
