import { NextResponse } from 'next/server';
import { getPricing } from '@/lib/admin-data';

export async function GET() {
  try {
    const spaces = getPricing()
      .sort((a, b) => a.capacity - b.capacity)
      .map(space => ({
        id: space.id,
        nameEn: space.nameEn,
        nameFr: space.nameFr,
        capacity: space.capacity,
        priceHalfDay: space.priceHalfDay,
        priceFullDay: space.priceFullDay,
        priceBundle5: space.priceBundle5,
        priceBundle10: space.priceBundle10,
      }));

    return NextResponse.json(spaces);
  } catch (error) {
    console.error('Error fetching spaces:', error);
    return NextResponse.json({ error: 'Failed to fetch spaces' }, { status: 500 });
  }
}
