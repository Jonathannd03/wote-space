import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { createDbEvent, getDbEvents } from '@/lib/admin-data';

export async function GET() {
  const events = await getDbEvents();
  return NextResponse.json(events);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const nameFr = formData.get('nameFr') as string;
  const nameEn = (formData.get('nameEn') as string) || nameFr;
  const date = formData.get('date') as string;
  const descriptionFr = (formData.get('descriptionFr') as string) || '';
  const descriptionEn = (formData.get('descriptionEn') as string) || '';
  const files = formData.getAll('images') as File[];

  if (!nameFr || !date) {
    return NextResponse.json({ error: 'French name and date are required' }, { status: 400 });
  }

  // Validate file types server-side
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  for (const file of files) {
    if (file.size > 0 && !allowed.includes(file.type)) {
      return NextResponse.json({ error: `Invalid file type: ${file.type}` }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Each image must be under 10 MB' }, { status: 400 });
    }
  }

  const imageUrls: string[] = [];
  for (const file of files) {
    if (file.size === 0) continue;
    const ext = file.name.split('.').pop() || 'jpg';
    const slug = nameFr.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const filename = `events/${slug}/${Date.now()}-${imageUrls.length}.${ext}`;
    const blob = await put(filename, file, { access: 'public' });
    imageUrls.push(blob.url);
  }

  const id = await createDbEvent({
    nameFr,
    nameEn,
    date: new Date(date),
    descriptionFr,
    descriptionEn,
    imageUrls,
  });

  return NextResponse.json({ ok: true, id });
}
