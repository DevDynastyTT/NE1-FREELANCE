import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Users from '@/models/userModel';

export async function GET() {
  try {
    await connectToDB();

    const users = await Users.find({}).select('-password').lean();

    return NextResponse.json({ users }, { status: 200 });
  } catch (e) {
    console.error('[allUsers] Error:', e instanceof Error ? e.message : 'Unknown error');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
