import connectDB from '@/lib/db';
import { authenticate } from '@/lib/middleware/auth';
import Cart from '@/lib/models/Cart';
import Sweet from '@/lib/models/Sweet';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/cart/checkout
 * Checkout and purchase all items in cart
 */
export async function POST(request: NextRequest) {
  try {
    const { user, error } = await authenticate(request);
    if (error) return error;

    await connectDB();

    // Find user's cart
    const cart = await Cart.findOne({ user: user!._id }).populate({
      path: 'items.sweet',
      select: 'name description price category imageUrl quantity',
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty.' },
        { status: 400 }
      );
    }

    // Verify stock availability for all items
    const stockErrors = [];
    for (const item of cart.items) {
      const sweet: any = item.sweet;
      if (!sweet) {
        stockErrors.push({
          item: 'Unknown item',
          error: 'Item no longer exists',
        });
        continue;
      }

      if (sweet.quantity < item.quantity) {
        stockErrors.push({
          item: sweet.name,
          available: sweet.quantity,
          requested: item.quantity,
          error: 'Insufficient stock',
        });
      }
    }

    if (stockErrors.length > 0) {
      return NextResponse.json(
        {
          error: 'Some items have insufficient stock',
          details: stockErrors,
        },
        { status: 400 }
      );
    }

    // Process purchase - decrease quantities
    const purchasedItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const sweet = await Sweet.findById(item.sweet);
      if (sweet) {
        sweet.quantity -= item.quantity;
        await sweet.save();

        const itemTotal = item.priceAtAdd * item.quantity;
        totalAmount += itemTotal;

        purchasedItems.push({
          sweetId: sweet._id,
          name: sweet.name,
          quantity: item.quantity,
          pricePerItem: item.priceAtAdd,
          itemTotal,
        });
      }
    }

    // Generate order ID
    const orderId = `ORDER-${Date.now()}-${user!._id.toString().slice(-6)}`;

    // Clear cart after successful purchase
    cart.items = [];
    await cart.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Purchase completed successfully',
        data: {
          orderId,
          purchasedItems,
          totalAmount,
          totalItems: purchasedItems.reduce((sum, item) => sum + item.quantity, 0),
          purchasedBy: {
            id: user!._id,
            username: user!.username,
            email: user!.email,
          },
          purchaseDate: new Date(),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error during checkout:', error);
    return NextResponse.json(
      { error: 'Failed to complete checkout.' },
      { status: 500 }
    );
  }
}
