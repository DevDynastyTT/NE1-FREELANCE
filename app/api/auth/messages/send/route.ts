import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDB } from '@/lib/db';
import { uploadToS3 } from '@/lib/s3';
import { publish } from '@/lib/events';
import Users from '@/models/userModel';
import Messages from '@/models/messagesModel';

export async function POST(request: NextRequest) {
  try {
    await connectToDB();

    const formData = await request.formData();
    const content = formData.get('content') as string | null;
    const sender = formData.get('sender') as string | null;
    const senderID = formData.get('senderID') as string | null;
    const receiver = formData.get('receiver') as string | null;
    const receiverID = formData.get('receiverID') as string | null;
    const file = formData.get('file') as File | null;

    if (!content || !sender || !senderID || !receiver || !receiverID) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const senderUser = await Users.findById(senderID);
    if (!senderUser) {
      return NextResponse.json(
        { message: 'Sender not found' },
        { status: 404 }
      );
    }

    const existingMessage = await Messages.findOne({
      $or: [
        { senderID: new mongoose.Types.ObjectId(senderID), receiverID: new mongoose.Types.ObjectId(receiverID) },
        { senderID: new mongoose.Types.ObjectId(receiverID), receiverID: new mongoose.Types.ObjectId(senderID) },
      ],
    });

    let chatID: mongoose.Types.ObjectId;
    if (existingMessage) {
      chatID = existingMessage.chatID;
    } else {
      chatID = new mongoose.Types.ObjectId();
    }

    let fileName = '';
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      fileName = `${timestamp}_${safeName}`;
      await uploadToS3(buffer, fileName, file.type);
    }

    const sentMessage = await Messages.create({
      chatID,
      sender,
      senderID: new mongoose.Types.ObjectId(senderID),
      receiver,
      receiverID: new mongoose.Types.ObjectId(receiverID),
      content,
      file: fileName || undefined,
    });

    publish(receiverID, "message", {
      senderID,
      newMessage: content,
      sender,
      file: fileName || undefined,
    });

    return NextResponse.json(
      { message: 'Message sent successfully', sentMessage },
      { status: 201 }
    );
  } catch (e) {
    console.error('[SendMessage] Error:', e instanceof Error ? e.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
