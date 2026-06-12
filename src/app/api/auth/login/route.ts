import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { connectToDB } from '@/lib/db';
import Users from '@/models/userModel';

export async function POST(request: NextRequest) {
  try {
    await connectToDB();

    const { email, password } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Form Violation! Enter your email' },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: 'Form Violation! Enter your password' },
        { status: 400 }
      );
    }

    const user = await Users.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'Invalid Email' }, { status: 400 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid Password' }, { status: 400 });
    }

    const { password: _, ...userObj } = user.toObject();

    user.isActive = true;
    await user.save();

    return NextResponse.json({ user: userObj }, { status: 200 });
  } catch (error) {
    console.error('[login] Error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
