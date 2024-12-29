// pages/api/users/register.js
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose"; // DB connection
import User from "@/app/models/user"; // User model

export async function POST(request) {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  // Validate input
  if (!name || !email || !password) {
    return NextResponse.json({ success: false, error: "All fields are required" });
  }

  await connectToDatabase(); // Connect to MongoDB

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, error: "User already exists" });
    }

    // Create and save the new user
    const newUser = new User({ name, email, password });
    await newUser.save();

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      user: { name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Server error" });
  }
}
