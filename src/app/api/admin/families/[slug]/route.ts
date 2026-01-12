// API para obtener y actualizar una familia específica
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/neon';

// GET: Obtener una familia por slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const family = await sql`
      SELECT id, name, slug, category, description, downloads, views, created_at
      FROM families
      WHERE slug = ${params.slug}
    `;

    if (family.length === 0) {
      return NextResponse.json(
        { error: 'Family not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ family: family[0] });
  } catch (error) {
    console.error('Error fetching family:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: Actualizar una familia
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
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
    const { name, category, description } = body;

    // Validaciones
    if (!name || !category || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Actualizar en la base de datos
    const result = await sql`
      UPDATE families
      SET name = ${name}, category = ${category}, description = ${description}
      WHERE slug = ${params.slug}
      RETURNING id, slug
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Family not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      family: result[0],
    });

  } catch (error) {
    console.error('Error updating family:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar una familia (lo haremos después)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await sql`DELETE FROM families WHERE slug = ${params.slug}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting family:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}