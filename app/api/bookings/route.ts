import { NextRequest, NextResponse } from 'next/server';
import { generateBookingReference } from '@/lib/utils';
import { z } from 'zod';
import { MOCK_SPACES } from '@/lib/mock-data';
import { checkAvailability } from '@/lib/availability';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendBookingRequestEmail(data: {
  referenceId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
  spaceName: string;
  startDate: Date;
  endDate: Date;
  numberOfPeople: number;
  totalPrice: number;
  locale: string;
}) {
  const formatDate = (d: Date) =>
    d.toLocaleDateString(data.locale === 'fr' ? 'fr-FR' : 'en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

  const formatTime = (d: Date) =>
    d.toLocaleTimeString(data.locale === 'fr' ? 'fr-FR' : 'en-US', {
      hour: '2-digit', minute: '2-digit',
    });

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: 'info@wote-space.com',
    replyTo: data.email,
    subject: `[Demande de réservation] ${data.referenceId} — ${data.firstName} ${data.lastName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"></head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Wote Space</h1>
          <p style="margin: 4px 0 0; font-size: 14px;">Nouvelle demande de réservation</p>
        </div>
        <div style="padding: 24px; background-color: #f9f9f9;">
          <p style="font-size: 16px; font-weight: bold; color: #dc2626;">Référence : ${data.referenceId}</p>

          <h2 style="color: #333; border-bottom: 2px solid #dc2626; padding-bottom: 8px;">Espace demandé</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; width: 160px; color: #555;">Espace :</td>
              <td style="padding: 6px 0;">${data.spaceName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #555;">Début :</td>
              <td style="padding: 6px 0;">${formatDate(data.startDate)} à ${formatTime(data.startDate)}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #555;">Fin :</td>
              <td style="padding: 6px 0;">${formatDate(data.endDate)} à ${formatTime(data.endDate)}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #555;">Participants :</td>
              <td style="padding: 6px 0;">${data.numberOfPeople}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #555;">Coût estimé :</td>
              <td style="padding: 6px 0; font-weight: bold; color: #dc2626;">$${data.totalPrice}</td>
            </tr>
          </table>

          <h2 style="color: #333; border-bottom: 2px solid #dc2626; padding-bottom: 8px; margin-top: 24px;">Contact</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; width: 160px; color: #555;">Nom :</td>
              <td style="padding: 6px 0;">${data.firstName} ${data.lastName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #555;">Email :</td>
              <td style="padding: 6px 0;"><a href="mailto:${data.email}" style="color: #dc2626;">${data.email}</a></td>
            </tr>
            ${data.phone ? `<tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Téléphone :</td><td style="padding: 6px 0;">${data.phone}</td></tr>` : ''}
            ${data.company ? `<tr><td style="padding: 6px 0; font-weight: bold; color: #555;">Organisation :</td><td style="padding: 6px 0;">${data.company}</td></tr>` : ''}
          </table>

          ${data.notes ? `
          <h2 style="color: #333; border-bottom: 2px solid #dc2626; padding-bottom: 8px; margin-top: 24px;">Notes</h2>
          <p style="white-space: pre-wrap; background: white; padding: 12px; border-left: 4px solid #dc2626;">${data.notes}</p>
          ` : ''}
        </div>
        <div style="text-align: center; padding: 16px; color: #999; font-size: 12px;">
          <p>Wote Space &mdash; 112, Boulevard Julien Paluku, Quartier Murara, Goma, RDC</p>
        </div>
      </body>
      </html>
    `,
  });
}

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

    // Check availability before accepting booking
    const availabilityCheck = await checkAvailability(startDate, endDate);
    if (!availabilityCheck.available) {
      return NextResponse.json(
        {
          error: 'Room is not available for the selected time slot',
          conflicts: availabilityCheck.conflicts,
        },
        { status: 409 } // 409 Conflict
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

    // Send booking request email to Wote Space team
    try {
      await sendBookingRequestEmail({
        referenceId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        company: data.company,
        notes: data.notes,
        spaceName: data.locale === 'fr' ? space.nameFr : space.nameEn,
        startDate,
        endDate,
        numberOfPeople: data.numberOfPeople,
        totalPrice: data.totalPrice,
        locale: data.locale,
      });
    } catch (emailError) {
      console.error('Failed to send booking email:', emailError);
      // Don't block the response if email fails
    }

    return NextResponse.json({
      success: true,
      referenceId,
      booking: {
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
