import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Users from '@/models/userModel';

export async function GET(request: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get('skip') ?? '0', 10);
    const limit = parseInt(searchParams.get('limit') ?? '100', 10);

    const [users, total] = await Promise.all([
      Users.find({}).select('-password').skip(skip).limit(limit).lean(),
      Users.countDocuments(),
    ]);

    return NextResponse.json({ users, total }, { status: 200 });
  } catch (e) {
    console.error('[allUsers] Error:', e instanceof Error ? e.message : 'Unknown error');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
