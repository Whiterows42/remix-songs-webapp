import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose'; // DB connection setup
import User from '@/app/models/user'; // User model

export async function POST(request) {
  const { username, password } = await request.json();

  // Validate input
  if (!username || !password) {
    return NextResponse.json({ success: false, error: 'Both username and password are required' });
  }

  await connectToDatabase(); // Connect to MongoDB

  try {
    // Check if the user exists
    const user = await User.findOne({ email: username });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' });
    }

    // Verify the password (you can implement bcrypt password hashing and comparison here)
    if (user.password !== password) {
      return NextResponse.json({ success: false, error: 'Invalid password' });
    }

    // Success - user is authenticated
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Server error' });
  }
}
