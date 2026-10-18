import { NextResponse } from 'next/server';
import { getPricing, savePricing } from '@/lib/admin-data';

export async function GET() {
  return NextResponse.json(getPricing());
}

export async function PUT(request: Request) {
  const body = await request.json();
  savePricing(body);
  return NextResponse.json({ ok: true });
}
