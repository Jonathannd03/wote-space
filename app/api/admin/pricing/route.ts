import { NextResponse } from 'next/server';
import { getPricing, savePricing } from '@/lib/admin-data';

export async function GET() {
  try {
    const pricing = await getPricing();
    return NextResponse.json(pricing);
  } catch (error) {
    console.error('Error fetching pricing:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await savePricing(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error saving pricing:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
