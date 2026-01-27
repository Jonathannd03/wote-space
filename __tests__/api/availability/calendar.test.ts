import { GET } from '@/app/api/availability/calendar/route';
import { NextRequest } from 'next/server';

// Skip API route tests for now - they require Next.js runtime environment
describe.skip('/api/availability/calendar', () => {
  describe('GET', () => {
    it('should return bookings for a valid month', async () => {
      const url = new URL('http://localhost:3000/api/availability/calendar');
      url.searchParams.set('year', '2026');
      url.searchParams.set('month', '0'); // January

      const request = new NextRequest(url);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.year).toBe(2026);
      expect(data.month).toBe(0);
      expect(Array.isArray(data.bookings)).toBe(true);
    });

    it('should return 400 for missing year parameter', async () => {
      const url = new URL('http://localhost:3000/api/availability/calendar');
      url.searchParams.set('month', '0');

      const request = new NextRequest(url);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('year and month are required');
    });

    it('should return 400 for missing month parameter', async () => {
      const url = new URL('http://localhost:3000/api/availability/calendar');
      url.searchParams.set('year', '2026');

      const request = new NextRequest(url);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('year and month are required');
    });

    it('should return 400 for invalid year', async () => {
      const url = new URL('http://localhost:3000/api/availability/calendar');
      url.searchParams.set('year', 'invalid');
      url.searchParams.set('month', '0');

      const request = new NextRequest(url);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid year or month');
    });

    it('should return 400 for invalid month (negative)', async () => {
      const url = new URL('http://localhost:3000/api/availability/calendar');
      url.searchParams.set('year', '2026');
      url.searchParams.set('month', '-1');

      const request = new NextRequest(url);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid year or month');
    });

    it('should return 400 for invalid month (> 11)', async () => {
      const url = new URL('http://localhost:3000/api/availability/calendar');
      url.searchParams.set('year', '2026');
      url.searchParams.set('month', '12');

      const request = new NextRequest(url);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid year or month');
    });

    it('should handle December (month 11)', async () => {
      const url = new URL('http://localhost:3000/api/availability/calendar');
      url.searchParams.set('year', '2026');
      url.searchParams.set('month', '11');

      const request = new NextRequest(url);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.month).toBe(11);
    });

    it('should handle January (month 0)', async () => {
      const url = new URL('http://localhost:3000/api/availability/calendar');
      url.searchParams.set('year', '2026');
      url.searchParams.set('month', '0');

      const request = new NextRequest(url);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.month).toBe(0);
    });
  });
});
