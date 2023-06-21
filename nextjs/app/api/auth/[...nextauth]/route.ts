import { NextResponse } from 'next/server'
import { connectToDB } from '@utils/databaseConnection';

export async function POST() {
  try {
    await connectToDB();

    // Perform your logic here

  } catch (error) {
    console.error('An unexpected error occurred in your query:', error);
    return NextResponse.json({ error: 'Failed' });
  }
}
