import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDB } from '@/lib/db';
import { uploadToS3, getImageUrl } from '@/lib/s3';
import userProfiles from '@/models/userProfileModel';

export async function PUT(request: NextRequest) {
  try {
    await connectToDB();

    const formData = await request.formData();

    const userID = formData.get('userID') as string;
    const bio = formData.get('bio') as string | null;
    const file = formData.get('profile_picture') as File | null;

    const updateData: Record<string, string> = {};

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const timestamp = Date.now();
      const fileName = `profile_pictures/${timestamp}_${file.name}`;
      await uploadToS3(buffer, fileName, file.type);
      updateData.profilePicture = fileName;
    }

    if (bio) {
      updateData.bio = bio;
    }

    await userProfiles.findOneAndUpdate(
      { userID: new mongoose.Types.ObjectId(userID) },
      { $set: updateData }
    );

    const profile = await userProfiles.findOne({
      userID: new mongoose.Types.ObjectId(userID),
    });

    const signedUrl = profile?.profilePicture
      ? await getImageUrl(profile.profilePicture)
      : '';

    return NextResponse.json(
      { message: 'Profile updated successfully', signedUrl },
      { status: 200 }
    );
  } catch (_e) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

