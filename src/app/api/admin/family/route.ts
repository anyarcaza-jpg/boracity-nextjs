import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getFamilyBySlug, updateFamily, deleteFamily } from '@/lib/db/families';
import { revalidatePath } from 'next/cache';

// GET /api/admin/family?slug=xxx
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const family = await getFamilyBySlug(slug);

    if (!family) {
      return NextResponse.json({ error: 'Family not found' }, { status: 404 });
    }

    return NextResponse.json({ family });
  } catch (error) {
    console.error('Error fetching family:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/family?slug=xxx
export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const body = await request.json();
    const { name, category, description, thumbnail_url } = body;

    if (!name || !category || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Preparar datos para actualizar
    const updateData: any = { name, category, description };
    
    // Si se envió un nuevo thumbnail, incluirlo
    if (thumbnail_url) {
      updateData.thumbnail_url = thumbnail_url;
    }

    const updatedFamily = await updateFamily(slug, updateData);

    if (!updatedFamily) {
      return NextResponse.json({ error: 'Family not found' }, { status: 404 });
    }

   // ============================================
    // REVALIDACIÓN DE CACHE
    // ============================================
    // Invalidar cache del detalle específico de esta familia
    revalidatePath(`/revit/${updatedFamily.category}/${updatedFamily.slug}`);
    
    // Invalidar cache del listado admin
    revalidatePath('/admin/families');
    
    // Invalidar cache del listado público de esa categoría
    revalidatePath(`/revit/${updatedFamily.category}`);

    return NextResponse.json({ message: 'Family updated successfully', family: updatedFamily });
  } catch (error) {
    console.error('Error updating family:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/family?slug=xxx
export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const deleted = await deleteFamily(slug);

    if (!deleted) {
      return NextResponse.json({ error: 'Family not found' }, { status: 404 });
    }

    // ============================================
    // REVALIDACIÓN DE CACHE
    // ============================================
    // Invalidar cache del listado admin
    revalidatePath('/admin/families');
    
    // Invalidar cache de home pública
    revalidatePath('/revit');
    
    // Invalidar cache de todas las categorías
    revalidatePath('/revit/[category]', 'page');

    return NextResponse.json({ message: 'Family deleted successfully' });
  } catch (error) {
    console.error('Error deleting family:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}