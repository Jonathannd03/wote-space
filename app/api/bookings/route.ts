import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateBookingReference } from '@/lib/utils';
import { sendBookingConfirmation } from '@/lib/email';
import { z } from 'zod';

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

    // Check if space exists
    const space = await prisma.space.findUnique({
      where: { id: data.spaceId },
    });

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

    // Check for conflicting bookings (double booking prevention)
    const conflictingBookings = await prisma.booking.findMany({
      where: {
        spaceId: data.spaceId,
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
        OR: [
          {
            // New booking starts during existing booking
            AND: [
              { startDate: { lte: startDate } },
              { endDate: { gt: startDate } },
            ],
          },
          {
            // New booking ends during existing booking
            AND: [
              { startDate: { lt: endDate } },
              { endDate: { gte: endDate } },
            ],
          },
          {
            // New booking completely contains existing booking
            AND: [
              { startDate: { gte: startDate } },
              { endDate: { lte: endDate } },
            ],
          },
          {
            // Existing booking completely contains new booking
            AND: [
              { startDate: { lte: startDate } },
              { endDate: { gte: endDate } },
            ],
          },
        ],
      },
    });

    if (conflictingBookings.length > 0) {
      return NextResponse.json(
        { error: 'This space is not available for the selected time period' },
        { status: 409 }
      );
    }

    // Generate unique reference ID
    const referenceId = generateBookingReference();

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        referenceId,
        spaceId: data.spaceId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        startDate,
        endDate,
        numberOfPeople: data.numberOfPeople,
        totalPrice: data.totalPrice,
        notes: data.notes || null,
        status: 'CONFIRMED',
      },
      include: {
        space: true,
      },
    });

    // Send confirmation email
    try {
      await sendBookingConfirmation(booking, data.locale);
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the booking if email fails
    }

    return NextResponse.json({
      success: true,
      referenceId: booking.referenceId,
      booking: {
        id: booking.id,
        referenceId: booking.referenceId,
        startDate: booking.startDate,
        endDate: booking.endDate,
        totalPrice: booking.totalPrice,
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
    const bookings = await prisma.booking.findMany({
      include: {
        space: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
