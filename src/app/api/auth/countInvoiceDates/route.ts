import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import Invoice from '@/models/invoiceModel';

export async function GET() {
  try {
    await connectToDB();

    const result = await Invoice.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 },
      },
    ]);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error aggregating invoice dates:', error);
    return NextResponse.json(
      { message: 'Failed to aggregate invoice dates' },
      { status: 500 }
    );
  }
}
