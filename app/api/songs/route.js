import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Song from "@/app/models/Song"
export async function GET() {
  try {
    // Connect to the database
    await connectToDatabase();

    // Fetch all songs from the database
    const songs = await Song.find().sort({ createdAt: -1 }); // Sort by created date descending

    return NextResponse.json({ success: true, data: songs });
  } catch (error) {
    console.error('Error fetching songs:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch songs' });
  }
}
