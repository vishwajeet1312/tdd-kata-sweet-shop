import connectDB from '@/lib/db';
import { authenticate, requireAdmin } from '@/lib/middleware/auth';
import Sweet from '@/lib/models/Sweet';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/sweets/:id
 * Get a single sweet by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid sweet ID.' },
        { status: 400 }
      );
    }

    const sweet = await Sweet.findById(id).populate('createdBy', 'username email');

    if (!sweet) {
      return NextResponse.json(
        { error: 'Sweet not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: sweet,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching sweet:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sweet.' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/sweets/:id
 * Update a sweet (Protected - requires authentication)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const { user, error } = await authenticate(request);
    if (error) return error;

    await connectDB();

    const { id } = params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid sweet ID.' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, description, price, category, imageUrl, quantity } = body;

    // Find the sweet
    const sweet = await Sweet.findById(id);

    if (!sweet) {
      return NextResponse.json(
        { error: 'Sweet not found.' },
        { status: 404 }
      );
    }

    // Check if user is admin or the creator of the sweet
    if (user!.role !== 'admin' && sweet.createdBy.toString() !== user!._id.toString()) {
      return NextResponse.json(
        { error: 'You do not have permission to update this sweet.' },
        { status: 403 }
      );
    }

    // Update sweet fields
    if (name !== undefined) sweet.name = name;
    if (description !== undefined) sweet.description = description;
    if (price !== undefined) sweet.price = price;
    if (category !== undefined) sweet.category = category;
    if (imageUrl !== undefined) sweet.imageUrl = imageUrl;
    if (quantity !== undefined) sweet.quantity = quantity;

    await sweet.save();
    await sweet.populate('createdBy', 'username email');

    return NextResponse.json(
      {
        success: true,
        message: 'Sweet updated successfully',
        data: sweet,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating sweet:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: messages },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update sweet.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/sweets/:id
 * Delete a sweet (Admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require admin privileges
    const { user, error } = await requireAdmin(request);
    if (error) return error;

    await connectDB();

    const { id } = params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid sweet ID.' },
        { status: 400 }
      );
    }

    const sweet = await Sweet.findByIdAndDelete(id);

    if (!sweet) {
      return NextResponse.json(
        { error: 'Sweet not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Sweet deleted successfully',
        data: sweet,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting sweet:', error);
    return NextResponse.json(
      { error: 'Failed to delete sweet.' },
      { status: 500 }
    );
  }
}
