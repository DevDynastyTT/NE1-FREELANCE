import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import { clearSessionCookie } from '@/lib/auth';
import Users from '@/models/userModel';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();

    const { id } = await params;

    await Users.findByIdAndUpdate(id, { isActive: false });

    const response = NextResponse.json({ success: true }, { status: 200 });
    clearSessionCookie(response);

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
