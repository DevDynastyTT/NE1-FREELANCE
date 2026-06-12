import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import { uploadToS3 } from '@/lib/s3';
import Services from '@/models/serviceModel';

export async function POST(request: NextRequest) {
  try {
    await connectToDB();

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    const file = formData.get('thumbnail') as File | null;
    let thumbnail = '';

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const timestamp = Date.now();
      const fileName = `thumbnails/${timestamp}_${file.name}`;
      thumbnail = await uploadToS3(buffer, fileName);
    }

    if (!title || !description || !thumbnail) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    await Services.create({ title, description, thumbnail });

    return NextResponse.json({ message: 'Service Added Successfully' });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { message: 'Failed to create service' },
      { status: 500 }
    );
  }
}
