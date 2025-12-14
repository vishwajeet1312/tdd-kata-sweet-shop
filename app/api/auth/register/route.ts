import connectDB from '@/lib/db';
import { generateToken } from '@/lib/middleware/auth';
import User from '@/lib/models/User';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/auth/register
 * Register a new user
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { username, email, password, role } = body;

    // Validate required fields
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required.' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { error: 'Email already registered.' },
          { status: 409 }
        );
      }
      if (existingUser.username === username) {
        return NextResponse.json(
          { error: 'Username already taken.' },
          { status: 409 }
        );
      }
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      role: role === 'admin' ? 'admin' : 'user', // Allow admin role if specified
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.email, user.role);

    // Return user data without password
    return NextResponse.json(
      {
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: messages },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
