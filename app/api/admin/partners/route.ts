import { NextResponse } from 'next/server';
import { getPartners, savePartners } from '@/lib/admin-data';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function GET() {
  return NextResponse.json(getPartners());
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = formData.get('name') as string;
  const file = formData.get('logo') as File | null;

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  let logoPath = '';
  if (file && file.size > 0) {
    const ext = file.name.split('.').pop() || 'png';
    const filename = `${Date.now()}-${name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(process.cwd(), 'public', 'partners', filename), buffer);
    logoPath = `/partners/${filename}`;
  }

  const id = `${Date.now()}-${name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;
  const partners = getPartners();
  partners.push({ id, name, logo: logoPath });
  savePartners(partners);

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const partners = getPartners().filter(p => p.id !== id);
  savePartners(partners);
  return NextResponse.json({ ok: true });
}
