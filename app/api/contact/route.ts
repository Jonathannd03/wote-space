import { NextRequest, NextResponse } from 'next/server';
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

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: 'info@wote-space.com',
      replyTo: email,
      subject: `[Contact Wote Space] ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"></head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Wote Space</h1>
            <p style="margin: 4px 0 0; font-size: 14px;">Nouveau message de contact</p>
          </div>
          <div style="padding: 24px; background-color: #f9f9f9;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 120px; color: #555;">Nom :</td>
                <td style="padding: 8px 0;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Email :</td>
                <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #dc2626;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Sujet :</td>
                <td style="padding: 8px 0;">${subject}</td>
              </tr>
            </table>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;">
            <p style="font-weight: bold; color: #555; margin-bottom: 8px;">Message :</p>
            <p style="white-space: pre-wrap; background: white; padding: 16px; border-radius: 4px; border-left: 4px solid #dc2626;">${message}</p>
          </div>
          <div style="text-align: center; padding: 16px; color: #999; font-size: 12px;">
            <p>Wote Space &mdash; 112, Boulevard Julien Paluku, Quartier Murara, Goma, RDC</p>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending contact email:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
