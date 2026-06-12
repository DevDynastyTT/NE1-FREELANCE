import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Users from '@/models/userModel';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();

    const { id } = await params;

    await Users.findByIdAndUpdate(id, { isActive: false });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
