import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { connectToDB } from '@/lib/db';
import Users from '@/models/userModel';

export async function POST(request: NextRequest) {
  try {
    await connectToDB();

    const { userID, username, email, password } = await request.json();

    const user = await Users.findById(userID);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (username) {
      user.username = username;
    }

    if (email) {
      user.email = email;
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    const userObj = user.toObject() as Record<string, unknown>;
    delete userObj.password;

    return NextResponse.json(
      { error: 'Profile updated', user: userObj },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

