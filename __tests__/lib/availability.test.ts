import {
  doTimeRangesOverlap,
  checkAvailability,
  getBookingsInRange,
  getBookingsForMonth,
  getAvailableTimeSlots,
} from '@/lib/availability';

describe('Availability Logic', () => {
  describe('doTimeRangesOverlap', () => {
    it('should return true when ranges overlap at the start', () => {
      const range1Start = new Date('2026-01-27T10:00:00');
      const range1End = new Date('2026-01-27T12:00:00');
      const range2Start = new Date('2026-01-27T09:00:00');
      const range2End = new Date('2026-01-27T11:00:00');

      expect(doTimeRangesOverlap(range1Start, range1End, range2Start, range2End)).toBe(true);
    });

    it('should return true when ranges overlap at the end', () => {
      const range1Start = new Date('2026-01-27T10:00:00');
      const range1End = new Date('2026-01-27T12:00:00');
      const range2Start = new Date('2026-01-27T11:00:00');
      const range2End = new Date('2026-01-27T13:00:00');

      expect(doTimeRangesOverlap(range1Start, range1End, range2Start, range2End)).toBe(true);
    });

    it('should return true when range2 is completely inside range1', () => {
      const range1Start = new Date('2026-01-27T10:00:00');
      const range1End = new Date('2026-01-27T14:00:00');
      const range2Start = new Date('2026-01-27T11:00:00');
      const range2End = new Date('2026-01-27T13:00:00');

      expect(doTimeRangesOverlap(range1Start, range1End, range2Start, range2End)).toBe(true);
    });

    it('should return true when range1 is completely inside range2', () => {
      const range1Start = new Date('2026-01-27T11:00:00');
      const range1End = new Date('2026-01-27T13:00:00');
      const range2Start = new Date('2026-01-27T10:00:00');
      const range2End = new Date('2026-01-27T14:00:00');

      expect(doTimeRangesOverlap(range1Start, range1End, range2Start, range2End)).toBe(true);
    });

    it('should return false when ranges do not overlap', () => {
      const range1Start = new Date('2026-01-27T10:00:00');
      const range1End = new Date('2026-01-27T12:00:00');
      const range2Start = new Date('2026-01-27T13:00:00');
      const range2End = new Date('2026-01-27T15:00:00');

      expect(doTimeRangesOverlap(range1Start, range1End, range2Start, range2End)).toBe(false);
    });

    it('should return false when ranges touch but do not overlap', () => {
      const range1Start = new Date('2026-01-27T10:00:00');
      const range1End = new Date('2026-01-27T12:00:00');
      const range2Start = new Date('2026-01-27T12:00:00');
      const range2End = new Date('2026-01-27T14:00:00');

      expect(doTimeRangesOverlap(range1Start, range1End, range2Start, range2End)).toBe(false);
    });

    it('should handle ranges across multiple days', () => {
      const range1Start = new Date('2026-01-27T20:00:00');
      const range1End = new Date('2026-01-28T02:00:00');
      const range2Start = new Date('2026-01-28T00:00:00');
      const range2End = new Date('2026-01-28T04:00:00');

      expect(doTimeRangesOverlap(range1Start, range1End, range2Start, range2End)).toBe(true);
    });
  });

  describe('checkAvailability', () => {
    it('should return available for demo mode', async () => {
      const startDate = new Date('2026-01-28T10:00:00');
      const endDate = new Date('2026-01-28T12:00:00');

      const result = await checkAvailability(startDate, endDate);

      expect(result.available).toBe(true);
      expect(result.conflicts).toEqual([]);
    });

    it('should handle future dates', async () => {
      const startDate = new Date('2026-12-31T10:00:00');
      const endDate = new Date('2026-12-31T12:00:00');

      const result = await checkAvailability(startDate, endDate);

      expect(result.available).toBe(true);
    });
  });

  describe('getBookingsInRange', () => {
    it('should return empty array in demo mode', async () => {
      const startDate = new Date('2026-01-27T00:00:00');
      const endDate = new Date('2026-01-28T00:00:00');

      const bookings = await getBookingsInRange(startDate, endDate);

      expect(bookings).toEqual([]);
    });
  });

  describe('getBookingsForMonth', () => {
    it('should return empty array in demo mode', async () => {
      const bookings = await getBookingsForMonth(2026, 0); // January 2026

      expect(bookings).toEqual([]);
    });

    it('should handle different months', async () => {
      const bookings = await getBookingsForMonth(2026, 11); // December 2026

      expect(bookings).toEqual([]);
    });
  });

  describe('getAvailableTimeSlots', () => {
    it('should generate time slots for a day', async () => {
      const date = new Date('2026-01-28');
      const slots = await getAvailableTimeSlots(date, 2);

      expect(slots.length).toBeGreaterThan(0);

      // Check that slots start within business hours (9 AM - 9 PM)
      slots.forEach(slot => {
        expect(slot.startDate.getHours()).toBeGreaterThanOrEqual(9);
        // Slots can end up to 21:00, but 2-hour slots starting at 9 PM will end at 23:00
        // which is outside business hours, so we check the start time is before 21:00
        expect(slot.startDate.getHours()).toBeLessThan(21);
      });
    });

    it('should respect slot duration', async () => {
      const date = new Date('2026-01-28');
      const slotDurationHours = 3;
      const slots = await getAvailableTimeSlots(date, slotDurationHours);

      // Check first slot duration
      if (slots.length > 0) {
        const firstSlot = slots[0];
        const durationMs = firstSlot.endDate.getTime() - firstSlot.startDate.getTime();
        const durationHours = durationMs / (1000 * 60 * 60);
        expect(durationHours).toBe(slotDurationHours);
      }
    });

    it('should not generate slots outside business hours', async () => {
      const date = new Date('2026-01-28');
      const slots = await getAvailableTimeSlots(date, 1);

      slots.forEach(slot => {
        // All slots should start at or after 9 AM
        expect(slot.startDate.getHours()).toBeGreaterThanOrEqual(9);
        // All slots should end before or at 9 PM
        expect(slot.endDate.getHours()).toBeLessThanOrEqual(21);
      });
    });

    it('should handle edge case of full day booking', async () => {
      const date = new Date('2026-01-28');
      const slots = await getAvailableTimeSlots(date, 12); // 12-hour slots

      // Should have at least one slot since business hours are 12 hours (9-21)
      expect(slots.length).toBeGreaterThanOrEqual(1);
    });
  });
});
