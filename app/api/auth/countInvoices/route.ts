import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Invoice from '@/models/invoiceModel';

export async function GET() {
  try {
    await connectToDB();

    const count = await Invoice.countDocuments();

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error counting invoices:', error);
    return NextResponse.json(
      { message: 'Failed to count invoices' },
      { status: 500 }
    );
  }
}
