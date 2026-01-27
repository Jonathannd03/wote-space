import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';

// Mock fetch
global.fetch = jest.fn();

describe('AvailabilityCalendar', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({ year: 2026, month: 0, bookings: [] }),
    });
  });

  it('should render calendar with current month', async () => {
    render(<AvailabilityCalendar locale="en" />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /previous month/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next month/i })).toBeInTheDocument();
    });
  });

  it('should display week day headers in English', async () => {
    render(<AvailabilityCalendar locale="en" />);

    await waitFor(() => {
      expect(screen.getByText('Mon')).toBeInTheDocument();
      expect(screen.getByText('Tue')).toBeInTheDocument();
      expect(screen.getByText('Wed')).toBeInTheDocument();
      expect(screen.getByText('Thu')).toBeInTheDocument();
      expect(screen.getByText('Fri')).toBeInTheDocument();
      expect(screen.getByText('Sat')).toBeInTheDocument();
      expect(screen.getByText('Sun')).toBeInTheDocument();
    });
  });

  it('should display week day headers in French', async () => {
    render(<AvailabilityCalendar locale="fr" />);

    await waitFor(() => {
      expect(screen.getByText('Lun')).toBeInTheDocument();
      expect(screen.getByText('Mar')).toBeInTheDocument();
      expect(screen.getByText('Mer')).toBeInTheDocument();
      expect(screen.getByText('Jeu')).toBeInTheDocument();
      expect(screen.getByText('Ven')).toBeInTheDocument();
      expect(screen.getByText('Sam')).toBeInTheDocument();
      expect(screen.getByText('Dim')).toBeInTheDocument();
    });
  });

  it('should fetch bookings on mount', async () => {
    render(<AvailabilityCalendar locale="en" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/availability/calendar')
      );
    });
  });

  it('should navigate to previous month', async () => {
    render(<AvailabilityCalendar locale="en" />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /previous month/i })).toBeInTheDocument();
    });

    const prevButton = screen.getByRole('button', { name: /previous month/i });
    fireEvent.click(prevButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2); // Initial + after navigation
    });
  });

  it('should navigate to next month', async () => {
    render(<AvailabilityCalendar locale="en" />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /next month/i })).toBeInTheDocument();
    });

    const nextButton = screen.getByRole('button', { name: /next month/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2); // Initial + after navigation
    });
  });

  it('should call onDateSelect when a date is clicked', async () => {
    const onDateSelect = jest.fn();

    render(<AvailabilityCalendar locale="en" onDateSelect={onDateSelect} />);

    await waitFor(() => {
      // Wait for calendar to render
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Find a day button (any button with just a number)
    const dayButtons = screen.getAllByRole('button').filter(button => {
      const text = button.textContent;
      return text && /^\d+$/.test(text) && !button.disabled;
    });

    if (dayButtons.length > 0) {
      fireEvent.click(dayButtons[0]);
      expect(onDateSelect).toHaveBeenCalled();
    }
  });

  it('should display legend with correct labels in English', async () => {
    render(<AvailabilityCalendar locale="en" />);

    await waitFor(() => {
      expect(screen.getByText('Selected')).toBeInTheDocument();
      expect(screen.getByText('Booked')).toBeInTheDocument();
      expect(screen.getByText('Today')).toBeInTheDocument();
    });
  });

  it('should display legend with correct labels in French', async () => {
    render(<AvailabilityCalendar locale="fr" />);

    await waitFor(() => {
      expect(screen.getByText('Sélectionné')).toBeInTheDocument();
      expect(screen.getByText('Réservé')).toBeInTheDocument();
      expect(screen.getByText("Aujourd'hui")).toBeInTheDocument();
    });
  });

  it('should show loading state', () => {
    render(<AvailabilityCalendar locale="en" />);

    // Should initially show loading (before fetch resolves)
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should highlight selected date', async () => {
    const selectedDate = new Date(2026, 0, 15); // January 15, 2026

    render(
      <AvailabilityCalendar
        locale="en"
        selectedDate={selectedDate}
      />
    );

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // The selected date should have the selected styling
    const dayButton = screen.getAllByRole('button').find(button =>
      button.textContent === '15' && button.className.includes('bg-brand-red')
    );

    expect(dayButton).toBeInTheDocument();
  });

  it('should mark booked dates', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        year: 2026,
        month: 0,
        bookings: [{
          id: 'test-1',
          startDate: '2026-01-15T10:00:00',
          endDate: '2026-01-15T12:00:00',
          spaceName: 'Test Space',
          customerName: 'Test Customer',
        }]
      }),
    });

    render(<AvailabilityCalendar locale="en" />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Booked dates should be disabled and have special styling
    const dayButtons = screen.getAllByRole('button').filter(button =>
      button.textContent === '15' && button.disabled
    );

    expect(dayButtons.length).toBeGreaterThan(0);
  });
});
