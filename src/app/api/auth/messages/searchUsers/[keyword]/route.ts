import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Users from '@/models/userModel';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ keyword: string }> }
) {
  try {
    await connectToDB();

    const { keyword } = await params;

    if (!keyword || keyword.trim().length === 0) {
      return NextResponse.json({ users: [] }, { status: 200 });
    }

    const users = await Users.find({
      username: { $regex: keyword, $options: 'i' },
    }).select('-password');

    return NextResponse.json({ users }, { status: 200 });
  } catch (error: any) {
    console.error('Error searching users:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
