import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { connectToDB } from '@/lib/db';
import Users from '@/models/userModel';
import userProfiles from '@/models/userProfileModel';

export async function POST(request: NextRequest) {
  try {
    await connectToDB();

    const { username, email, password } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: 'Form Violation! Enter a username' },
        { status: 400 }
      );
    }

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

    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }

    const localPasswords = [
      `${username}123`,
      `${username}123!`,
      `${email.split('@')[0]}123`,
      `${email.split('@')[0]}123!`,
    ];

    const commonPasswordsFile = fs.readFileSync(
      path.join(process.cwd(), 'src', 'lib', 'commonPasswords.txt'),
      'utf8'
    );
    const commonPasswords = commonPasswordsFile
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const allWeakPasswords = [...commonPasswords, ...localPasswords];

    if (allWeakPasswords.includes(password)) {
      return NextResponse.json(
        { error: 'Password is too weak' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Users.create({
      username,
      email,
      password: hashedPassword,
    });

    await userProfiles.create({
      userID: user._id,
      profilePicture: 'default.png',
      bio: 'undefined',
    });

    const { password: _, ...userObj } = user.toObject();

    return NextResponse.json({ user: userObj }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
