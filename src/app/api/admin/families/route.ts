// API para crear familias
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/neon';

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
    const { name, slug, category, description } = body;

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
      INSERT INTO families (name, slug, category, description, downloads, views)
      VALUES (${name}, ${slug}, ${category}, ${description}, 0, 0)
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