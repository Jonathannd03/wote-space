import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { addImagesToEvent, deleteEventImage } from '@/lib/admin-data';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const formData = await request.formData();
  const files = formData.getAll('images') as File[];

  for (const file of files) {
    if (file.size > 0 && !ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: `Invalid file type: ${file.type}` }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Each image must be under 10 MB' }, { status: 400 });
    }
  }

  const urls: string[] = [];
  for (const file of files) {
    if (file.size === 0) continue;
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const filename = `events/${id}/${Date.now()}-${urls.length}.${ext}`;
      const blob = await put(filename, file, { access: 'public' });
      urls.push(blob.url);
    } catch (err) {
      console.warn('[events/images] Blob upload failed — skipping image:', (err as Error).message);
    }
  }

  if (urls.length === 0 && files.filter(f => f.size > 0).length > 0) {
    return NextResponse.json({ error: 'Image upload unavailable in this environment. Deploy to Vercel to upload photos.' }, { status: 503 });
  }

  await addImagesToEvent(id, urls);
  return NextResponse.json({ ok: true, added: urls.length });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await params;
  try {
    const { imageId } = await request.json();
    if (!imageId) return NextResponse.json({ error: 'imageId required' }, { status: 400 });
    await deleteEventImage(imageId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
