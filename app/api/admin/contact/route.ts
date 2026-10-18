import { NextResponse } from 'next/server';
import { getContactInfo, saveContactInfo } from '@/lib/admin-data';

export async function GET() {
  try {
    const info = await getContactInfo();
    return NextResponse.json(info);
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await saveContactInfo(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error saving contact info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
