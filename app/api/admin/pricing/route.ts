import { NextResponse } from 'next/server';
import { getPricing, savePricing } from '@/lib/admin-data';

export async function GET() {
  const pricing = await getPricing();
  return NextResponse.json(pricing);
}

export async function PUT(request: Request) {
  const body = await request.json();
  await savePricing(body);
  return NextResponse.json({ ok: true });
}
