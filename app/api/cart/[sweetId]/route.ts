import connectDB from '@/lib/db';
import { authenticate } from '@/lib/middleware/auth';
import Cart from '@/lib/models/Cart';
import Sweet from '@/lib/models/Sweet';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

/**
 * PUT /api/cart/:sweetId
 * Update quantity of item in cart
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { sweetId: string } }
) {
  try {
    const { user, error } = await authenticate(request);
    if (error) return error;

    await connectDB();

    const { sweetId } = params;
    const body = await request.json();
    const { quantity } = body;

    // Validate input
    if (!quantity || quantity < 0) {
      return NextResponse.json(
        { error: 'Valid quantity is required.' },
        { status: 400 }
      );
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(sweetId)) {
      return NextResponse.json(
        { error: 'Invalid sweet ID.' },
        { status: 400 }
      );
    }

    // Find the sweet to check stock
    const sweet = await Sweet.findById(sweetId);

    if (!sweet) {
      return NextResponse.json(
        { error: 'Sweet not found.' },
        { status: 404 }
      );
    }

    // Check stock availability
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

    // Find cart
    const cart = await Cart.findOne({ user: user!._id });

    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found.' },
        { status: 404 }
      );
    }

    // Find item in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.sweet.toString() === sweetId
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Item not found in cart.' },
        { status: 404 }
      );
    }

    // Update quantity (or remove if quantity is 0)
    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].priceAtAdd = sweet.price; // Update price
    }

    await cart.save();

    // Populate and return updated cart
    await cart.populate({
      path: 'items.sweet',
      select: 'name description price category imageUrl quantity',
    });

    const totalPrice = await cart.getTotalPrice();
    const totalItems = cart.getTotalItems();

    return NextResponse.json(
      {
        success: true,
        message: quantity === 0 ? 'Item removed from cart' : 'Cart updated successfully',
        data: {
          cart,
          summary: {
            totalItems,
            totalPrice,
            itemCount: cart.items.length,
          },
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Failed to update cart.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cart/:sweetId
 * Remove item from cart
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { sweetId: string } }
) {
  try {
    const { user, error } = await authenticate(request);
    if (error) return error;

    await connectDB();

    const { sweetId } = params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(sweetId)) {
      return NextResponse.json(
        { error: 'Invalid sweet ID.' },
        { status: 400 }
      );
    }

    // Find cart
    const cart = await Cart.findOne({ user: user!._id });

    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found.' },
        { status: 404 }
      );
    }

    // Remove item from cart
    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item.sweet.toString() !== sweetId
    );

    if (cart.items.length === initialLength) {
      return NextResponse.json(
        { error: 'Item not found in cart.' },
        { status: 404 }
      );
    }

    await cart.save();

    // Populate and return updated cart
    await cart.populate({
      path: 'items.sweet',
      select: 'name description price category imageUrl quantity',
    });

    const totalPrice = await cart.getTotalPrice();
    const totalItems = cart.getTotalItems();

    return NextResponse.json(
      {
        success: true,
        message: 'Item removed from cart successfully',
        data: {
          cart,
          summary: {
            totalItems,
            totalPrice,
            itemCount: cart.items.length,
          },
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { error: 'Failed to remove item from cart.' },
      { status: 500 }
    );
  }
}
