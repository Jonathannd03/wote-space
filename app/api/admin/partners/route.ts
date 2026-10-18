import { NextResponse } from 'next/server';
import { getPartners, addPartner, deletePartner } from '@/lib/admin-data';
import { put } from '@vercel/blob';

export async function GET() {
  const partners = await getPartners();
  return NextResponse.json(partners);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = formData.get('name') as string;
  const file = formData.get('logo') as File | null;

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  let logoUrl = '';
  if (file && file.size > 0) {
    try {
      const ext = file.name.split('.').pop() || 'png';
      const filename = `partners/${Date.now()}-${name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.${ext}`;
      const blob = await put(filename, file, { access: 'public' });
      logoUrl = blob.url;
    } catch (err) {
      console.warn('[partners] Blob upload failed — adding partner without logo:', (err as Error).message);
    }
  }

  await addPartner(name, logoUrl);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await deletePartner(id);
  return NextResponse.json({ ok: true });
}
