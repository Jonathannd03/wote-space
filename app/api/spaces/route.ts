import { NextResponse } from 'next/server';
import { MOCK_SPACES } from '@/lib/mock-data';

export async function GET() {
  try {
    // Using mock data - replace with database query when DATABASE_URL is configured
    const spaces = MOCK_SPACES
      .filter(space => space.available)
      .sort((a, b) => a.capacity - b.capacity)
      .map(space => ({
        id: space.id,
        nameEn: space.nameEn,
        nameFr: space.nameFr,
        capacity: space.capacity,
        pricePerHour: space.pricePerHour,
        pricePerDay: space.pricePerDay,
      }));

    return NextResponse.json(spaces);
  } catch (error) {
    console.error('Error fetching spaces:', error);
    return NextResponse.json(
      { error: 'Failed to fetch spaces' },
      { status: 500 }
    );
  }
}
