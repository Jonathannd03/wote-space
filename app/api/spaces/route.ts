import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const spaces = await prisma.space.findMany({
      where: { available: true },
      orderBy: { capacity: 'asc' },
      select: {
        id: true,
        nameEn: true,
        nameFr: true,
        capacity: true,
        pricePerHour: true,
        pricePerDay: true,
      },
    });

    return NextResponse.json(spaces);
  } catch (error) {
    console.error('Error fetching spaces:', error);
    return NextResponse.json(
      { error: 'Failed to fetch spaces' },
      { status: 500 }
    );
  }
}
