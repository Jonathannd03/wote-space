import nodemailer from 'nodemailer';
import { Booking, Space } from '@prisma/client';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendBookingConfirmation(
  booking: Booking & { space: Space },
  locale: 'fr' | 'en' = 'fr'
) {
  const dateLocale = locale === 'fr' ? fr : enUS;
  const startDate = format(booking.startDate, 'PPP à HH:mm', { locale: dateLocale });
  const endDate = format(booking.endDate, 'PPP à HH:mm', { locale: dateLocale });

  const translations = {
    fr: {
      subject: 'Confirmation de réservation - Wote Space',
      greeting: `Bonjour ${booking.firstName} ${booking.lastName},`,
      confirmation: 'Votre réservation a été confirmée !',
      details: 'Détails de la réservation :',
      reference: 'Numéro de référence',
      space: 'Espace',
      dates: 'Dates',
      from: 'Du',
      to: 'au',
      people: 'Nombre de personnes',
      total: 'Prix total',
      thanks: 'Merci d\'avoir choisi Wote Space !',
      questions: 'Pour toute question, n\'hésitez pas à nous contacter.',
    },
    en: {
      subject: 'Booking Confirmation - Wote Space',
      greeting: `Hello ${booking.firstName} ${booking.lastName},`,
      confirmation: 'Your booking has been confirmed!',
      details: 'Booking details:',
      reference: 'Reference number',
      space: 'Space',
      dates: 'Dates',
      from: 'From',
      to: 'to',
      people: 'Number of people',
      total: 'Total price',
      thanks: 'Thank you for choosing Wote Space!',
      questions: 'If you have any questions, please don\'t hesitate to contact us.',
    },
  };

  const t = translations[locale];
  const spaceName = locale === 'fr' ? booking.space.nameFr : booking.space.nameEn;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="${locale}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${t.subject}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #0ea5e9; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">Wote Space</h1>
      </div>

      <div style="padding: 20px; background-color: #f9f9f9;">
        <p>${t.greeting}</p>
        <p style="font-size: 18px; font-weight: bold; color: #0ea5e9;">${t.confirmation}</p>

        <div style="background-color: white; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h2 style="color: #0ea5e9; margin-top: 0;">${t.details}</h2>
          <p><strong>${t.reference}:</strong> ${booking.referenceId}</p>
          <p><strong>${t.space}:</strong> ${spaceName}</p>
          <p><strong>${t.dates}:</strong><br>
             ${t.from} ${startDate}<br>
             ${t.to} ${endDate}
          </p>
          <p><strong>${t.people}:</strong> ${booking.numberOfPeople}</p>
          <p><strong>${t.total}:</strong> $${booking.totalPrice}</p>
        </div>

        <p>${t.thanks}</p>
        <p style="color: #666; font-size: 14px;">${t.questions}</p>
      </div>

      <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
        <p>Wote Space &copy; 2024</p>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: booking.email,
    subject: t.subject,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);

    // Send notification to admin if configured
    if (process.env.ADMIN_EMAIL) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: process.env.ADMIN_EMAIL,
        subject: `New Booking: ${booking.referenceId}`,
        html: htmlContent,
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
