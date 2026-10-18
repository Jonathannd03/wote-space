import { NextResponse } from 'next/server';
import { getContactInfo, saveContactInfo } from '@/lib/admin-data';

export async function GET() {
  return NextResponse.json(getContactInfo());
}

export async function PUT(request: Request) {
  const body = await request.json();
  saveContactInfo(body);
  return NextResponse.json({ ok: true });
}
