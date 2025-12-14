import connectDB from '@/lib/db';
import Sweet from '@/lib/models/Sweet';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/sweets/search
 * Search sweets by name, category, or price range
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    // Build query object
    const query: any = {};

    // Search by name (case-insensitive partial match)
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    // Search by category (exact match, case-insensitive)
    if (category) {
      query.category = category.toLowerCase();
    }

    // Search by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        query.price.$lte = parseFloat(maxPrice);
      }
    }

    const sweets = await Sweet.find(query)
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        count: sweets.length,
        query: {
          name,
          category,
          minPrice,
          maxPrice,
        },
        data: sweets,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error searching sweets:', error);
    return NextResponse.json(
      { error: 'Failed to search sweets.' },
      { status: 500 }
    );
  }
}
