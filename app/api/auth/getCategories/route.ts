import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import JobCategories from '@/models/jobCategoriesModel';

export async function GET() {
  try {
    await connectToDB();

    const categories = await JobCategories.find({}, { name: 1, _id: 0 });

    return NextResponse.json({ categories }, { status: 200 });
  } catch (e) {
    console.error('[getCategories] Error:', e instanceof Error ? e.message : 'Unknown error');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
