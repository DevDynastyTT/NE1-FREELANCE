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

    if (!title || !description) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const updateData: { description: string; thumbnail?: string } = { description };

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const timestamp = Date.now();
      const fileName = `thumbnails/${timestamp}_${file.name}`;
      const uploadedFileName = await uploadToS3(buffer, fileName);
      updateData.thumbnail = uploadedFileName;
    }

    await Services.findOneAndUpdate({ title }, updateData);

    return NextResponse.json({ message: 'Service updated' });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { message: 'Failed to update service' },
      { status: 500 }
    );
  }
}
