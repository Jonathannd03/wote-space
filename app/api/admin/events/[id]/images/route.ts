import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { addImagesToEvent } from '@/lib/admin-data';

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
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `events/${id}/${Date.now()}-${urls.length}.${ext}`;
    const blob = await put(filename, file, { access: 'public' });
    urls.push(blob.url);
  }

  await addImagesToEvent(id, urls);
  return NextResponse.json({ ok: true, added: urls.length });
}
