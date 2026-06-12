import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import { getImageUrl } from '@/lib/s3';
import Services from '@/models/serviceModel';

export async function GET() {
  try {
    await connectToDB();

    const services = await Services.find({});

    const servicesWithImages = await Promise.all(
      services.map(async (service) => {
        const thumbnailUrl = await getImageUrl(service.thumbnail);
        return {
          _id: service._id,
          title: service.title,
          description: service.description,
          thumbnail: thumbnailUrl,
        };
      })
    );

    return NextResponse.json({ services: servicesWithImages });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { message: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}
