import connectDB from '@/lib/db';
import { authenticate } from '@/lib/middleware/auth';
import Cart from '@/lib/models/Cart';
import Sweet from '@/lib/models/Sweet';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/cart
 * Get user's shopping cart
 */
export async function GET(request: NextRequest) {
  try {
    const { user, error } = await authenticate(request);
    if (error) return error;

    await connectDB();

    let cart = await Cart.findOne({ user: user!._id }).populate({
      path: 'items.sweet',
      select: 'name description price category imageUrl quantity',
    });

    // Create empty cart if doesn't exist
    if (!cart) {
      cart = new Cart({
        user: user!._id,
        items: [],
      });
      await cart.save();
    }

    const totalPrice = await cart.getTotalPrice();
    const totalItems = cart.getTotalItems();

    return NextResponse.json(
      {
        success: true,
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
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cart
 * Add item to cart
 */
export async function POST(request: NextRequest) {
  try {
    const { user, error } = await authenticate(request);
    if (error) return error;

    await connectDB();

    const body = await request.json();
    const { sweetId, quantity = 1 } = body;

    // Validate input
    if (!sweetId) {
      return NextResponse.json(
        { error: 'Sweet ID is required.' },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      return NextResponse.json(
        { error: 'Quantity must be at least 1.' },
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

    // Find the sweet
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

    // Find or create cart
    let cart = await Cart.findOne({ user: user!._id });

    if (!cart) {
      cart = new Cart({
        user: user!._id,
        items: [],
      });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.sweet.toString() === sweetId
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;

      // Check if total quantity exceeds stock
      if (sweet.quantity < newQuantity) {
        return NextResponse.json(
          {
            error: 'Insufficient stock for requested quantity.',
            available: sweet.quantity,
            inCart: cart.items[existingItemIndex].quantity,
            requested: quantity,
          },
          { status: 400 }
        );
      }

      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].priceAtAdd = sweet.price; // Update price
    } else {
      // Add new item to cart
      cart.items.push({
        sweet: new mongoose.Types.ObjectId(sweetId),
        quantity,
        priceAtAdd: sweet.price,
      });
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
        message: 'Item added to cart successfully',
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
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cart
 * Clear entire cart
 */
export async function DELETE(request: NextRequest) {
  try {
    const { user, error } = await authenticate(request);
    if (error) return error;

    await connectDB();

    const cart = await Cart.findOne({ user: user!._id });

    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found.' },
        { status: 404 }
      );
    }

    cart.items = [];
    await cart.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Cart cleared successfully',
        data: { cart },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { error: 'Failed to clear cart.' },
      { status: 500 }
    );
  }
}
