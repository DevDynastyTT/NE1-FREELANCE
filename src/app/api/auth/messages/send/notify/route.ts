import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import { sendMessageNotification } from '@/lib/email';
import Users from '@/models/userModel';

export async function POST(request: NextRequest) {
  try {
    await connectToDB();

    const { message, receiverID, senderID } = await request.json();

    if (!message || !receiverID || !senderID) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const sender = await Users.findById(senderID);
    const receiver = await Users.findById(receiverID);

    if (!sender || !receiver) {
      return NextResponse.json(
        { message: 'Sender or receiver not found' },
        { status: 400 }
      );
    }

    await sendMessageNotification(
      receiver.email,
      sender.username,
      sender.email,
      message
    );

    return NextResponse.json(
      { message: 'Notification sent successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error sending notification:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
