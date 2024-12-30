import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import Song from "@/app/models/Song";

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, category, artist, releaseDate, url } = body;

    // Extract the file name and size from the URL (or include these values in the payload)
    const fileName = title || "Untitled"; // Use title as the file name, or provide a default
    const fileSize = 0; // Replace with the actual file size if available

    // Connect to MongoDB
    await connectToDatabase();

    // Save metadata to MongoDB
    const song = new Song({
      name: fileName,
      size: fileSize,
      title,
      category,
      artist,
      releaseDate,
      url, // Cloudinary file URL
    });
    await song.save();

    return NextResponse.json({
      success: true,
      message: "Song metadata saved successfully.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
