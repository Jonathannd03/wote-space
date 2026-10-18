import { NextResponse } from 'next/server';
import { getPricing } from '@/lib/admin-data';

export async function GET() {
  try {
    const spaces = await getPricing();
    return NextResponse.json(spaces);
  } catch (error) {
    console.error('Error fetching spaces:', error);
    return NextResponse.json({ error: 'Failed to fetch spaces' }, { status: 500 });
  }
}
