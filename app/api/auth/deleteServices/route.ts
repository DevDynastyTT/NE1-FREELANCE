import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Services from '@/models/serviceModel';

export async function POST(request: NextRequest) {
  try {
    await connectToDB();

    const { title } = await request.json();

    if (!title) {
      return NextResponse.json(
        { message: 'Missing title' },
        { status: 400 }
      );
    }

    await Services.findOneAndDelete({ title });

    return NextResponse.json({ message: 'Service deleted' });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { message: 'Failed to delete service' },
      { status: 500 }
    );
  }
}
