import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Users from '@/models/userModel';

export async function GET(_request: NextRequest) {
  try {
    await connectToDB();

    const count = await Users.countDocuments();

    return NextResponse.json({ count }, { status: 200 });
  } catch (_e) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

