import connectDB from '@/lib/db';
import { authenticate } from '@/lib/middleware/auth';
import Sweet from '@/lib/models/Sweet';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/purchase
 * Legacy endpoint - redirects to /api/sweets/:id/purchase
 * Kept for backward compatibility
 */
export async function POST(request: NextRequest) {
  try {
    const { sweetId, quantity = 1 } = await request.json();

    if (!sweetId) {
      return NextResponse.json({ error: 'Sweet ID is required.' }, { status: 400 });
    }

    // Authenticate user
    const { user, error } = await authenticate(request);
    if (error) return error;

    await connectDB();

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(sweetId)) {
      return NextResponse.json({ error: 'Invalid sweet ID.' }, { status: 400 });
    }

    // Find the sweet
    const sweet = await Sweet.findById(sweetId);

    if (!sweet) {
      return NextResponse.json({ error: 'Sweet not found.' }, { status: 404 });
    }

    // Check stock
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

    return NextResponse.json({
      success: true,
      orderId: `ORDER-${Date.now()}`,
      message: 'Purchase successful',
      data: {
        sweetId: sweet._id,
        sweetName: sweet.name,
        quantity,
        totalPrice: sweet.price * quantity,
        remainingStock: sweet.quantity,
      },
    });
  } catch (error) {
    console.error('Purchase error:', error);
    return NextResponse.json({ error: 'Purchase failed' }, { status: 500 });
  }
}
