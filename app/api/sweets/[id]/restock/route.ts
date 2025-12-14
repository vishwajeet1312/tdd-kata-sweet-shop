import connectDB from '@/lib/db';
import { requireAdmin } from '@/lib/middleware/auth';
import Sweet from '@/lib/models/Sweet';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/sweets/:id/restock
 * Restock a sweet (Admin only)
 * Increases the quantity of the sweet
 */
export async function POST(
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

    const body = await request.json();
    const { quantity } = body;

    // Validate quantity
    if (!quantity || quantity < 1) {
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

    const previousQuantity = sweet.quantity;

    // Increase quantity
    sweet.quantity += quantity;
    await sweet.save();
    await sweet.populate('createdBy', 'username email');

    return NextResponse.json(
      {
        success: true,
        message: `Successfully restocked ${quantity} ${sweet.name}(s)`,
        data: {
          sweet,
          restockedQuantity: quantity,
          previousStock: previousQuantity,
          newStock: sweet.quantity,
          restockedBy: {
            id: user!._id,
            username: user!.username,
            email: user!.email,
          },
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error restocking sweet:', error);
    return NextResponse.json(
      { error: 'Failed to restock sweet.' },
      { status: 500 }
    );
  }
}
