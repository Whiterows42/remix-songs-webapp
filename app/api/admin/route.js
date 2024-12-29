// pages/api/admin/register.js
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose"; // DB connection
import Admin from "@/app/models/Admin"; // Admin model

export async function POST(request) {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const adminToken = formData.get("adminToken"); // A secret token for admin creation

  // Validate input
  if (!name || !email || !password) {
    return NextResponse.json({ success: false, error: "All fields are required" });
  }

  // Admin authorization (you can replace this with a more secure system like JWT, etc.)
  if (adminToken !== process.env.ADMIN_CREATION_TOKEN) {
    return NextResponse.json({ success: false, error: "Unauthorized access" });
  }

  await connectToDatabase(); // Connect to MongoDB

  try {
    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json({ success: false, error: "Admin already exists" });
    }

    // Create and save the new admin
    const newAdmin = new Admin({ name, email, password });
    await newAdmin.save();

    return NextResponse.json({
      success: true,
      message: "Admin created successfully",
      admin: { name: newAdmin.name, email: newAdmin.email },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Server error" });
  }
}
