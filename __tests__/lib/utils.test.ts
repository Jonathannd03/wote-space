import { formatPrice, generateBookingReference } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('formatPrice', () => {
    it('should format prices correctly', () => {
      expect(formatPrice(10)).toBe('$10.00');
      expect(formatPrice(100)).toBe('$100.00');
      expect(formatPrice(1000)).toBe('$1,000.00');
    });

    it('should handle decimal prices', () => {
      expect(formatPrice(10.5)).toBe('$10.50');
      expect(formatPrice(99.99)).toBe('$99.99');
    });

    it('should handle zero', () => {
      expect(formatPrice(0)).toBe('$0.00');
    });

    it('should handle large numbers', () => {
      expect(formatPrice(1000000)).toBe('$1,000,000');
    });
  });

  describe('generateBookingReference', () => {
    it('should generate a reference starting with WS-', () => {
      const ref = generateBookingReference();
      expect(ref).toMatch(/^WS-/);
    });

    it('should generate unique references', () => {
      const ref1 = generateBookingReference();
      const ref2 = generateBookingReference();
      expect(ref1).not.toBe(ref2);
    });

    it('should have correct format', () => {
      const ref = generateBookingReference();
      // Format: WS-XXXXXXXX-XXXX (WS- followed by two groups of characters separated by -)
      expect(ref).toMatch(/^WS-[A-Z0-9]{8}-[A-Z0-9]{4}$/);
    });

    it('should generate multiple unique references', () => {
      const references = new Set();
      for (let i = 0; i < 100; i++) {
        references.add(generateBookingReference());
      }
      // All 100 references should be unique
      expect(references.size).toBe(100);
    });
  });
});
