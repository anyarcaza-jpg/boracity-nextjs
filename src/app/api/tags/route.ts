import { NextResponse } from 'next/server';
import { getAllTags } from '@/lib/families';
import { logger } from '@/lib/logger';

/**
 * API ENDPOINT: Get all available tags
 * 
 * Usage: GET /api/tags
 * 
 * Response:
 * {
 *   "success": true,
 *   "tags": ["modern", "wooden", "office", ...],
 *   "count": 15
 * }
 */
export async function GET() {
  try {
    logger.info('Fetching all tags');
    
    const tags = await getAllTags();
    
    logger.info('Tags fetched successfully', { count: tags.length });
    
    return NextResponse.json(
      {
        success: true,
        tags,
        count: tags.length,
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error('Error fetching tags', {
      error: error instanceof Error ? error.message : 'Unknown',
    });
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch tags',
      },
      { status: 500 }
    );
  }
}