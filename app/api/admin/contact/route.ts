import { NextResponse } from 'next/server';
import { getContactInfo, saveContactInfo } from '@/lib/admin-data';

export async function GET() {
  const info = await getContactInfo();
  return NextResponse.json(info);
}

export async function PUT(request: Request) {
  const body = await request.json();
  await saveContactInfo(body);
  return NextResponse.json({ ok: true });
}
