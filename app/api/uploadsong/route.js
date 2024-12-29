import { NextResponse } from "next/server";
import cloudinary from "@/utils/cloudinary";
import connectToDatabase from "@/lib/mongoose";
import Song from "@/app/models/Song";
export async function GET() {
  console.log("GET request received!"); // Log a message on the server
  return NextResponse.json({ message: "Hello, this is your test API!" });
}

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("file"); // Get the uploaded file

  console.log("File details:", file);

  if (!file) {
    return NextResponse.json({ success: false, error: "No file uploaded" });
  }
  await connectToDatabase();
  try {
    // Convert the file stream to a buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload using upload_stream() method
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto", // Automatically detect the file type (audio, video, etc.)
            folder: "songs", // Optional: specify a folder in Cloudinary
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });
    // Save file metadata or details to MongoDB
    const song = new Song({
      name: file.name,
      size: file.size,
      url: result.secure_url,
      category: formData.get("category"),
      artist: formData.get("artist"),
      releaseDate: formData.get("releaseDate"),
    });
    await song.save();

    return NextResponse.json({
      success: true,
      url: result.secure_url, // Return the URL of the uploaded file
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
