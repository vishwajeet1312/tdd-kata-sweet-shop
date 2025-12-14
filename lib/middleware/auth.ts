import connectDB from '@/lib/db';
import User, { IUser } from '@/lib/models/User';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

export interface AuthenticatedRequest extends NextRequest {
  user?: IUser;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Generate JWT token
 */
export function generateToken(userId: string, email: string, role: string): string {
  return jwt.sign({ userId, email, role }, JWT_SECRET, {
    expiresIn: '7d', // Token expires in 7 days
  });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Middleware to authenticate requests
 */
export async function authenticate(request: NextRequest): Promise<{ user: IUser | null; error: NextResponse | null }> {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        user: null,
        error: NextResponse.json(
          { error: 'No token provided. Please authenticate.' },
          { status: 401 }
        ),
      };
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return {
        user: null,
        error: NextResponse.json(
          { error: 'Invalid or expired token.' },
          { status: 401 }
        ),
      };
    }

    // Connect to database and get user
    await connectDB();
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return {
        user: null,
        error: NextResponse.json(
          { error: 'User not found.' },
          { status: 401 }
        ),
      };
    }

    return { user, error: null };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      user: null,
      error: NextResponse.json(
        { error: 'Authentication failed.' },
        { status: 500 }
      ),
    };
  }
}

/**
 * Middleware to check if user is admin
 */
export async function requireAdmin(request: NextRequest): Promise<{ user: IUser | null; error: NextResponse | null }> {
  const { user, error } = await authenticate(request);
  
  if (error) {
    return { user: null, error };
  }

  if (user?.role !== 'admin') {
    return {
      user: null,
      error: NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      ),
    };
  }

  return { user, error: null };
}
