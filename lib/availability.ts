/**
 * Availability checking utilities for Wote Space
 * Since we have ONE physical room with different setup configurations,
 * any booking blocks the entire room for all setups
 */

export interface TimeSlot {
  startDate: Date;
  endDate: Date;
}

export interface BookingConflict {
  id: string;
  startDate: Date;
  endDate: Date;
  spaceName: string;
  customerName: string;
}

/**
 * Check if two time ranges overlap
 */
export function doTimeRangesOverlap(
  range1Start: Date,
  range1End: Date,
  range2Start: Date,
  range2End: Date
): boolean {
  // Two ranges overlap if:
  // - range1 starts before range2 ends AND
  // - range1 ends after range2 starts
  return range1Start < range2End && range1End > range2Start;
}

/**
 * Check if a booking exists in a given time slot
 * For demo purposes, returns mock availability
 * In production, this would query the database
 */
export async function checkAvailability(
  startDate: Date,
  endDate: Date
): Promise<{
  available: boolean;
  conflicts?: BookingConflict[];
}> {
  // For now, return mock data
  // In production, you would:
  // 1. Query the database for all bookings that overlap with this time range
  // 2. Filter for CONFIRMED and PENDING bookings only (ignore CANCELLED/COMPLETED)
  // 3. Return conflicts if any exist

  // Example query (pseudo-code):
  // const bookings = await prisma.booking.findMany({
  //   where: {
  //     status: { in: ['CONFIRMED', 'PENDING'] },
  //     OR: [
  //       {
  //         AND: [
  //           { startDate: { lte: endDate } },
  //           { endDate: { gte: startDate } }
  //         ]
  //       }
  //     ]
  //   }
  // });

  // For demo: always available
  return {
    available: true,
    conflicts: [],
  };
}

/**
 * Get all bookings for a specific date range
 * Useful for calendar view
 */
export async function getBookingsInRange(
  startDate: Date,
  endDate: Date
): Promise<BookingConflict[]> {
  // For demo, return empty array
  // In production, query database for bookings in this range
  return [];
}

/**
 * Get bookings for a specific month (for calendar display)
 */
export async function getBookingsForMonth(
  year: number,
  month: number
): Promise<BookingConflict[]> {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0, 23, 59, 59);

  return getBookingsInRange(startDate, endDate);
}

/**
 * Get available time slots for a given day
 * Returns time slots that are NOT booked
 */
export async function getAvailableTimeSlots(
  date: Date,
  slotDurationHours: number = 2
): Promise<TimeSlot[]> {
  // Define business hours (9 AM to 9 PM)
  const businessStart = 9;
  const businessEnd = 21;

  const availableSlots: TimeSlot[] = [];
  const dayStart = new Date(date);
  dayStart.setHours(businessStart, 0, 0, 0);

  const dayEnd = new Date(date);
  dayEnd.setHours(businessEnd, 0, 0, 0);

  // Get all bookings for this day
  const dayEndForQuery = new Date(date);
  dayEndForQuery.setHours(23, 59, 59, 999);
  const bookings = await getBookingsInRange(dayStart, dayEndForQuery);

  // Generate time slots
  let currentSlotStart = new Date(dayStart);

  while (currentSlotStart < dayEnd) {
    const currentSlotEnd = new Date(currentSlotStart);
    currentSlotEnd.setHours(currentSlotStart.getHours() + slotDurationHours);

    // Check if this slot conflicts with any booking
    const hasConflict = bookings.some(booking =>
      doTimeRangesOverlap(
        currentSlotStart,
        currentSlotEnd,
        booking.startDate,
        booking.endDate
      )
    );

    if (!hasConflict) {
      availableSlots.push({
        startDate: new Date(currentSlotStart),
        endDate: new Date(currentSlotEnd),
      });
    }

    // Move to next slot (every hour)
    currentSlotStart.setHours(currentSlotStart.getHours() + 1);
  }

  return availableSlots;
}
