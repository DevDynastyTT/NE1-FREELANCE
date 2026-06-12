import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Users from '@/models/userModel';

export async function GET(request: NextRequest) {
  try {
    await connectToDB();

    const userInfo = await Users.find({}).lean();

    return NextResponse.json({ userInfo }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
