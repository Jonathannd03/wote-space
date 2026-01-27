import { NextRequest, NextResponse } from 'next/server';
import { getBookingsForMonth } from '@/lib/availability';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    if (!year || !month) {
      return NextResponse.json(
        { error: 'year and month are required' },
        { status: 400 }
      );
    }

    const yearNum = parseInt(year);
    const monthNum = parseInt(month);

    if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 0 || monthNum > 11) {
      return NextResponse.json(
        { error: 'Invalid year or month' },
        { status: 400 }
      );
    }

    // Get bookings for the month
    const bookings = await getBookingsForMonth(yearNum, monthNum);

    return NextResponse.json({
      year: yearNum,
      month: monthNum,
      bookings,
    });
  } catch (error) {
    console.error('Error fetching calendar bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calendar data' },
      { status: 500 }
    );
  }
}
