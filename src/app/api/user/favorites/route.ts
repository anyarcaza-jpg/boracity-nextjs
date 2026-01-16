/**
 * API Endpoint: User Favorites
 * Handles CRUD operations for authenticated user favorites
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import {
  getUserFavorites,
  addFavorite,
  removeFavorite,
  getFavoritesCount,
  migrateFavorites,
} from '@/lib/db/user-favorites';

/**
 * GET /api/user/favorites
 * Get all favorites for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const favorites = await getUserFavorites(session.user.id);
    const count = await getFavoritesCount(session.user.id);

    return NextResponse.json({
      favorites,
      count,
    });

  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/favorites
 * Add a family to favorites or migrate from localStorage
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { familyId, migrate, familyIds } = body;

    if (migrate && familyIds && Array.isArray(familyIds)) {
      const migratedCount = await migrateFavorites(session.user.id, familyIds);
      
      return NextResponse.json({
        success: true,
        message: 'Migrated ' + migratedCount + ' favorites',
        migratedCount,
      });
    }

    if (!familyId) {
      return NextResponse.json(
        { error: 'familyId is required' },
        { status: 400 }
      );
    }

    const success = await addFavorite(session.user.id, familyId);

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Added to favorites',
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to add favorite' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/user/favorites
 * Remove a family from favorites
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const familyId = searchParams.get('familyId');

    if (!familyId) {
      return NextResponse.json(
        { error: 'familyId is required' },
        { status: 400 }
      );
    }

    const success = await removeFavorite(session.user.id, familyId);

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Removed from favorites',
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to remove favorite' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}