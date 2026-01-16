import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/neon';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ids = searchParams.get('ids');

    if (!ids) {
      return NextResponse.json(
        { error: 'Missing ids parameter' },
        { status: 400 }
      );
    }

    const idArray = ids.split(',').filter(id => id.trim());

    if (idArray.length === 0) {
      return NextResponse.json({ families: [] });
    }

    const families = await sql`
      SELECT 
        id,
        name,
        slug,
        category,
        description,
        thumbnail_url as "thumbnailUrl",
        rfa_url as "rfaUrl",
        file_size as "fileSize",
        revit_version as "revitVersion",
        downloads,
        views,
        created_at as "createdAt"
      FROM families
      WHERE id = ANY(${idArray})
    `;

    const formattedFamilies = families.map(family => ({
      id: family.id,
      name: family.name,
      slug: family.slug,
      category: family.category,
      description: family.description,
      images: {
        thumbnail: family.thumbnailUrl || '/assets/images/placeholder.png',
        gallery: []
      },
      file: {
        downloadUrl: family.rfaUrl || '',
        size: family.fileSize || 'N/A',
        revitVersions: family.revitVersion ? [family.revitVersion] : ['2024']
      },
      metadata: {
        downloads: family.downloads || 0,
        views: family.views || 0,
        author: 'Boracity Team',
        uploadDate: family.createdAt
      }
    }));

    return NextResponse.json({ families: formattedFamilies });

  } catch (error) {
    console.error('Error fetching families:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}