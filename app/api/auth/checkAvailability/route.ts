import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Users from '@/models/userModel';

export async function GET(request: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const value = searchParams.get('value');

    if (!type || !value) {
      return NextResponse.json({ error: 'Missing type or value' }, { status: 400 });
    }

    if (type !== 'username' && type !== 'email') {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const query = type === 'username' ? { username: value } : { email: value };
    const exists = await Users.exists(query);

    return NextResponse.json({ available: !exists });
  } catch (error) {
    console.error('[checkAvailability] Error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
