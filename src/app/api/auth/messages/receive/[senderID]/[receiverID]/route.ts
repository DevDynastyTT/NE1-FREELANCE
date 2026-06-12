import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDB } from '@/lib/db';
import { getImageUrl } from '@/lib/s3';
import Messages from '@/models/messagesModel';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ senderID: string; receiverID: string }> }
) {
  try {
    await connectToDB();

    const { senderID, receiverID } = await params;

    const rawMessages = await Messages.aggregate([
      {
        $match: {
          $or: [
            {
              senderID: new mongoose.Types.ObjectId(senderID),
              receiverID: new mongoose.Types.ObjectId(receiverID),
            },
            {
              senderID: new mongoose.Types.ObjectId(receiverID),
              receiverID: new mongoose.Types.ObjectId(senderID),
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'senderID',
          foreignField: '_id',
          as: 'senderInfo',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'receiverID',
          foreignField: '_id',
          as: 'receiverInfo',
        },
      },
      {
        $sort: { sentAt: 1 },
      },
    ]);

    const messages = [];
    for (const msg of rawMessages) {
      if (msg.file) {
        msg.file = await getImageUrl(msg.file);
      }
      messages.push(msg);
    }

    return NextResponse.json(messages, { status: 200 });
  } catch (e) {
    console.error('[ReceiveMessages] Error:', e instanceof Error ? e.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
