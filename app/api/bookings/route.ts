import { NextRequest, NextResponse } from 'next/server';
import { generateBookingReference } from '@/lib/utils';
import { z } from 'zod';
import { MOCK_SPACES } from '@/lib/mock-data';

const bookingSchema = z.object({
  spaceId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  numberOfPeople: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  notes: z.string().optional(),
  totalPrice: z.number(),
  locale: z.enum(['fr', 'en']).optional().default('fr'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = bookingSchema.parse(body);

    // Convert date strings to Date objects
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    // Validate dates
    if (startDate >= endDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    if (startDate < new Date()) {
      return NextResponse.json(
        { error: 'Start date cannot be in the past' },
        { status: 400 }
      );
    }

    // Check if space exists (using mock data)
    const space = MOCK_SPACES.find(s => s.id === data.spaceId);

    if (!space) {
      return NextResponse.json(
        { error: 'Space not found' },
        { status: 404 }
      );
    }

    if (!space.available) {
      return NextResponse.json(
        { error: 'Space is not available' },
        { status: 400 }
      );
    }

    // Check capacity
    if (data.numberOfPeople > space.capacity) {
      return NextResponse.json(
        { error: `Space capacity exceeded. Maximum capacity is ${space.capacity}` },
        { status: 400 }
      );
    }

    // Generate unique reference ID
    const referenceId = generateBookingReference();

    // DEMO MODE: Booking data is not saved (database not configured)
    // In production, this would save to database and send confirmation email
    console.log('DEMO BOOKING:', {
      referenceId,
      space: space.nameEn,
      customer: `${data.firstName} ${data.lastName}`,
      email: data.email,
      startDate,
      endDate,
      totalPrice: data.totalPrice,
    });

    // Return success response for preview/demo
    return NextResponse.json({
      success: true,
      referenceId,
      message: 'Booking preview successful! In production, this will save to database and send confirmation email.',
      booking: {
        id: `demo-${Date.now()}`,
        referenceId,
        startDate,
        endDate,
        totalPrice: data.totalPrice,
        spaceName: data.locale === 'fr' ? space.nameFr : space.nameEn,
      },
    });
  } catch (error) {
    console.error('Error creating booking:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid booking data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // DEMO MODE: No bookings saved yet (database not configured)
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
