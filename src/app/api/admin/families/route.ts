// API para crear y listar familias
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/neon';

/**
 * GET /api/admin/families
 * Obtener todas las familias
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Obtener todas las familias
    const families = await sql`
      SELECT 
        id,
        name,
        slug,
        category,
        description,
        thumbnail_url,
        rfa_url,
        file_size,
        revit_version,
        downloads,
        views,
        created_at
      FROM families
      ORDER BY created_at DESC
    `;

    return NextResponse.json({
      success: true,
      families: families,
      count: families.length,
    });

  } catch (error) {
    console.error('Error fetching families:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/families
 * Crear una nueva familia
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Obtener datos del body
    const body = await request.json();
    const { 
      name, 
      slug, 
      category, 
      description,
      revit_version,
      rfa_url,
      thumbnail_url,
      file_size,
    } = body;

    // Validaciones
    if (!name || !slug || !category || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verificar que el slug no exista
    const existing = await sql`
      SELECT id FROM families WHERE slug = ${slug}
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'A family with this slug already exists' },
        { status: 400 }
      );
    }

    // Insertar en la base de datos
    const result = await sql`
      INSERT INTO families (
        name, 
        slug, 
        category, 
        description, 
        revit_version,
        rfa_url,
        thumbnail_url,
        file_size,
        downloads, 
        views
      )
      VALUES (
        ${name}, 
        ${slug}, 
        ${category}, 
        ${description},
        ${revit_version || null},
        ${rfa_url || null},
        ${thumbnail_url || null},
        ${file_size || null},
        0, 
        0
      )
      RETURNING id, slug
    `;

    return NextResponse.json({
      success: true,
      family: result[0],
    });

  } catch (error) {
    console.error('Error creating family:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}