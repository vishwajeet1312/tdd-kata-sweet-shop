import connectDB from '@/lib/db';
import { authenticate } from '@/lib/middleware/auth';
import Sweet from '@/lib/models/Sweet';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/sweets/:id/purchase
 * Purchase a sweet (Protected - requires authentication)
 * Decreases the quantity of the sweet
 */
export async function POST(
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
    const { quantity = 1 } = body;

    // Validate quantity
    if (quantity < 1) {
      return NextResponse.json(
        { error: 'Quantity must be at least 1.' },
        { status: 400 }
      );
    }

    // Find the sweet
    const sweet = await Sweet.findById(id);

    if (!sweet) {
      return NextResponse.json(
        { error: 'Sweet not found.' },
        { status: 404 }
      );
    }

    // Check if enough stock is available
    if (sweet.quantity < quantity) {
      return NextResponse.json(
        {
          error: 'Insufficient stock.',
          available: sweet.quantity,
          requested: quantity,
        },
        { status: 400 }
      );
    }

    // Decrease quantity
    sweet.quantity -= quantity;
    await sweet.save();
    await sweet.populate('createdBy', 'username email');

    return NextResponse.json(
      {
        success: true,
        message: `Successfully purchased ${quantity} ${sweet.name}(s)`,
        data: {
          sweet,
          purchasedQuantity: quantity,
          remainingStock: sweet.quantity,
          totalPrice: sweet.price * quantity,
          purchasedBy: {
            id: user!._id,
            username: user!.username,
            email: user!.email,
          },
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error purchasing sweet:', error);
    return NextResponse.json(
      { error: 'Failed to purchase sweet.' },
      { status: 500 }
    );
  }
}
