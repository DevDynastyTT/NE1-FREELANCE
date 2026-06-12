import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDB } from '@/lib/db';
import Messages from '@/models/messagesModel';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();

    const { id } = await params;

    const userId = new mongoose.Types.ObjectId(id);

    const distinctChats = await Messages.distinct('chatID', {
      $or: [{ senderID: userId }, { receiverID: userId }],
    });

    const recentChats = [];

    for (const chatID of distinctChats) {
      const latestMessage = await Messages.findOne({ chatID })
        .sort({ sentAt: -1 })
        .lean();

      if (latestMessage) {
        recentChats.push(latestMessage);
      }
    }

    recentChats.sort((chatA, chatB) => {
      const dateA = new Date(chatA.sentAt).getTime();
      const dateB = new Date(chatB.sentAt).getTime();
      return dateB - dateA;
    });

    return NextResponse.json({ chats: recentChats }, { status: 200 });
  } catch (_e) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
