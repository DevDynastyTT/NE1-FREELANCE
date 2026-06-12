import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import JobCategories from '@/models/jobCategoriesModel';

export async function GET() {
  try {
    await connectToDB();

    const count = await JobCategories.countDocuments();

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error counting categories:', error);
    return NextResponse.json(
      { message: 'Failed to count categories' },
      { status: 500 }
    );
  }
}
