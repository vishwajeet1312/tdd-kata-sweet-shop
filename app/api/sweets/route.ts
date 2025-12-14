import connectDB from '@/lib/db';
import { authenticate } from '@/lib/middleware/auth';
import Sweet from '@/lib/models/Sweet';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/sweets
 * Get all sweets (public or authenticated)
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const sweets = await Sweet.find({})
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        count: sweets.length,
        data: sweets,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching sweets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sweets.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sweets
 * Create a new sweet (Protected - requires authentication)
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const { user, error } = await authenticate(request);
    if (error) return error;

    await connectDB();

    const body = await request.json();
    const { name, description, price, category, imageUrl, quantity } = body;

    // Validate required fields
    if (!name || !description || price === undefined || !category) {
      return NextResponse.json(
        { error: 'Name, description, price, and category are required.' },
        { status: 400 }
      );
    }

    // Create new sweet
    const sweet = new Sweet({
      name,
      description,
      price,
      category,
      imageUrl: imageUrl || '/placeholder.svg',
      quantity: quantity || 0,
      createdBy: user!._id,
    });

    await sweet.save();

    // Populate createdBy field
    await sweet.populate('createdBy', 'username email');

    return NextResponse.json(
      {
        success: true,
        message: 'Sweet created successfully',
        data: sweet,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating sweet:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: messages },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create sweet.' },
      { status: 500 }
    );
  }
}
