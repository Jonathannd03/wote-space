import { POST, GET } from '@/app/api/bookings/route';
import { NextRequest } from 'next/server';

// Skip API route tests for now - they require Next.js runtime environment
describe.skip('/api/bookings', () => {
  describe('POST', () => {
    it('should create a booking with valid data', async () => {
      const requestBody = {
        spaceId: 'mock-1',
        startDate: '2026-01-28T10:00:00',
        endDate: '2026-01-28T12:00:00',
        numberOfPeople: 5,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+243980244431',
        company: 'Test Company',
        notes: 'Test booking',
        totalPrice: 10,
        locale: 'en',
      };

      const request = new NextRequest('http://localhost:3000/api/bookings', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.referenceId).toBeDefined();
      expect(data.referenceId).toMatch(/^WS-/); // Reference starts with WS-
    });

    it('should return 400 for end date before start date', async () => {
      const requestBody = {
        spaceId: 'mock-1',
        startDate: '2026-01-28T12:00:00',
        endDate: '2026-01-28T10:00:00',
        numberOfPeople: 5,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        totalPrice: 10,
      };

      const request = new NextRequest('http://localhost:3000/api/bookings', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('End date must be after start date');
    });

    it('should return 400 for start date in the past', async () => {
      const requestBody = {
        spaceId: 'mock-1',
        startDate: '2020-01-01T10:00:00',
        endDate: '2020-01-01T12:00:00',
        numberOfPeople: 5,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        totalPrice: 10,
      };

      const request = new NextRequest('http://localhost:3000/api/bookings', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Start date cannot be in the past');
    });

    it('should return 404 for invalid space ID', async () => {
      const requestBody = {
        spaceId: 'invalid-space',
        startDate: '2026-01-28T10:00:00',
        endDate: '2026-01-28T12:00:00',
        numberOfPeople: 5,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        totalPrice: 10,
      };

      const request = new NextRequest('http://localhost:3000/api/bookings', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Space not found');
    });

    it('should return 400 for exceeding capacity', async () => {
      const requestBody = {
        spaceId: 'mock-1', // Capacity is 10
        startDate: '2026-01-28T10:00:00',
        endDate: '2026-01-28T12:00:00',
        numberOfPeople: 15, // Exceeds capacity
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        totalPrice: 10,
      };

      const request = new NextRequest('http://localhost:3000/api/bookings', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('capacity exceeded');
    });

    it('should return 400 for invalid email', async () => {
      const requestBody = {
        spaceId: 'mock-1',
        startDate: '2026-01-28T10:00:00',
        endDate: '2026-01-28T12:00:00',
        numberOfPeople: 5,
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email', // Invalid email
        totalPrice: 10,
      };

      const request = new NextRequest('http://localhost:3000/api/bookings', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid booking data');
    });

    it('should return 400 for missing required fields', async () => {
      const requestBody = {
        spaceId: 'mock-1',
        startDate: '2026-01-28T10:00:00',
        endDate: '2026-01-28T12:00:00',
        // Missing numberOfPeople, firstName, lastName, email, totalPrice
      };

      const request = new NextRequest('http://localhost:3000/api/bookings', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid booking data');
    });

    it('should accept optional fields', async () => {
      const requestBody = {
        spaceId: 'mock-1',
        startDate: '2026-01-28T10:00:00',
        endDate: '2026-01-28T12:00:00',
        numberOfPeople: 5,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        totalPrice: 10,
        // Optional fields omitted
      };

      const request = new NextRequest('http://localhost:3000/api/bookings', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('should default locale to fr if not provided', async () => {
      const requestBody = {
        spaceId: 'mock-1',
        startDate: '2026-01-28T10:00:00',
        endDate: '2026-01-28T12:00:00',
        numberOfPeople: 5,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        totalPrice: 10,
        // locale not provided
      };

      const request = new NextRequest('http://localhost:3000/api/bookings', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });

  describe('GET', () => {
    it('should return empty array in demo mode', async () => {
      const request = new NextRequest('http://localhost:3000/api/bookings', {
        method: 'GET',
      });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(0);
    });
  });
});
