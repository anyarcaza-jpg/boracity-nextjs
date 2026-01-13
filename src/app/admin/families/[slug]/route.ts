import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getFamilyBySlug, updateFamily, deleteFamily } from '@/lib/db/families';

// GET /api/admin/families/[slug] - Obtener una familia por slug
export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    // Verificar autenticación
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await params (Next.js 15)
    const { slug } = await context.params;
    const family = await getFamilyBySlug(slug);

    if (!family) {
      return NextResponse.json({ error: 'Family not found' }, { status: 404 });
    }

    return NextResponse.json({ family });
  } catch (error) {
    console.error('Error fetching family:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/families/[slug] - Actualizar una familia
export async function PUT(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    // Verificar autenticación
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await params (Next.js 15)
    const { slug } = await context.params;
    const body = await request.json();

    // Validar datos requeridos
    const { name, category, description } = body;
    if (!name || !category || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Actualizar familia
    const updatedFamily = await updateFamily(slug, {
      name,
      category,
      description,
    });

    if (!updatedFamily) {
      return NextResponse.json({ error: 'Family not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Family updated successfully',
      family: updatedFamily,
    });
  } catch (error) {
    console.error('Error updating family:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/families/[slug] - Eliminar una familia
export async function DELETE(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    // Verificar autenticación
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await params (Next.js 15)
    const { slug } = await context.params;

    // Eliminar familia
    const deleted = await deleteFamily(slug);

    if (!deleted) {
      return NextResponse.json({ error: 'Family not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Family deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting family:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}