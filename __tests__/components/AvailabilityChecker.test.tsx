import { render, screen, waitFor } from '@testing-library/react';
import AvailabilityChecker from '@/components/AvailabilityChecker';

// Mock fetch
global.fetch = jest.fn();

describe('AvailabilityChecker', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    (global.fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should not render anything when fields are incomplete', () => {
    const { container } = render(
      <AvailabilityChecker
        startDate=""
        startTime=""
        endDate=""
        endTime=""
        locale="en"
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should show checking state initially', () => {
    render(
      <AvailabilityChecker
        startDate="2026-01-28"
        startTime="10:00"
        endDate="2026-01-28"
        endTime="12:00"
        locale="en"
      />
    );

    expect(screen.getByText(/checking availability/i)).toBeInTheDocument();
  });

  it('should show available when slot is available', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ available: true, conflicts: [] }),
    });

    render(
      <AvailabilityChecker
        startDate="2026-01-28"
        startTime="10:00"
        endDate="2026-01-28"
        endTime="12:00"
        locale="en"
      />
    );

    // Advance timers to trigger debounced check
    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(screen.getByText('Available')).toBeInTheDocument();
      expect(screen.getByText(/the room is available for these dates/i)).toBeInTheDocument();
    });
  });

  it('should show not available when slot is booked', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        available: false,
        conflicts: [{
          id: 'test-1',
          startDate: '2026-01-28T10:00:00',
          endDate: '2026-01-28T12:00:00',
          spaceName: 'Setup M',
          customerName: 'John Doe',
        }]
      }),
    });

    render(
      <AvailabilityChecker
        startDate="2026-01-28"
        startTime="10:00"
        endDate="2026-01-28"
        endTime="12:00"
        locale="en"
      />
    );

    // Advance timers to trigger debounced check
    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(screen.getByText('Not Available')).toBeInTheDocument();
      expect(screen.getByText(/the room is already booked/i)).toBeInTheDocument();
    });
  });

  it('should display conflict information', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        available: false,
        conflicts: [{
          id: 'test-1',
          startDate: '2026-01-28T10:00:00',
          endDate: '2026-01-28T12:00:00',
          spaceName: 'Setup M',
          customerName: 'John Doe',
        }]
      }),
    });

    render(
      <AvailabilityChecker
        startDate="2026-01-28"
        startTime="10:00"
        endDate="2026-01-28"
        endTime="12:00"
        locale="en"
      />
    );

    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(screen.getByText(/existing bookings/i)).toBeInTheDocument();
      expect(screen.getByText('Setup M')).toBeInTheDocument();
    });
  });

  it('should show French text when locale is fr', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ available: true, conflicts: [] }),
    });

    render(
      <AvailabilityChecker
        startDate="2026-01-28"
        startTime="10:00"
        endDate="2026-01-28"
        endTime="12:00"
        locale="fr"
      />
    );

    // Should show French checking text initially
    expect(screen.getByText(/vérification de la disponibilité/i)).toBeInTheDocument();

    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(screen.getByText('Disponible')).toBeInTheDocument();
      expect(screen.getByText(/la salle est disponible pour ces dates/i)).toBeInTheDocument();
    });
  });

  it('should call onAvailabilityChange callback', async () => {
    const onAvailabilityChange = jest.fn();

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ available: true, conflicts: [] }),
    });

    render(
      <AvailabilityChecker
        startDate="2026-01-28"
        startTime="10:00"
        endDate="2026-01-28"
        endTime="12:00"
        locale="en"
        onAvailabilityChange={onAvailabilityChange}
      />
    );

    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(onAvailabilityChange).toHaveBeenCalledWith(true);
    });
  });

  it('should debounce API calls', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ available: true, conflicts: [] }),
    });

    const { rerender } = render(
      <AvailabilityChecker
        startDate="2026-01-28"
        startTime="10:00"
        endDate="2026-01-28"
        endTime="12:00"
        locale="en"
      />
    );

    // Advance partially through debounce period
    jest.advanceTimersByTime(300);

    // Update props before debounce completes
    rerender(
      <AvailabilityChecker
        startDate="2026-01-28"
        startTime="10:00"
        endDate="2026-01-28"
        endTime="13:00"
        locale="en"
      />
    );

    // Complete debounce period
    jest.advanceTimersByTime(500);

    await waitFor(() => {
      // Should only call once after debounce
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  it('should handle API errors gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    render(
      <AvailabilityChecker
        startDate="2026-01-28"
        startTime="10:00"
        endDate="2026-01-28"
        endTime="12:00"
        locale="en"
      />
    );

    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalled();
    });

    // Should not show any availability status on error
    expect(screen.queryByText('Available')).not.toBeInTheDocument();
    expect(screen.queryByText('Not Available')).not.toBeInTheDocument();

    consoleError.mockRestore();
  });

  it('should reset state when fields are cleared', () => {
    const { rerender } = render(
      <AvailabilityChecker
        startDate="2026-01-28"
        startTime="10:00"
        endDate="2026-01-28"
        endTime="12:00"
        locale="en"
      />
    );

    expect(screen.getByText(/checking/i)).toBeInTheDocument();

    // Clear fields
    rerender(
      <AvailabilityChecker
        startDate=""
        startTime=""
        endDate=""
        endTime=""
        locale="en"
      />
    );

    // Should not show anything
    expect(screen.queryByText(/checking/i)).not.toBeInTheDocument();
  });
});
