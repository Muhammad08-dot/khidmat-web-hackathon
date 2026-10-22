import { useState, useEffect, useCallback } from 'react';
import type { Booking } from '../types';
import { queryCollectionDocs } from '../services/firebase';

interface UseBookingsOptions {
  userId?: string;
  role?: 'customer' | 'provider';
}

export const useBookings = ({ userId, role = 'customer' }: UseBookingsOptions) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    if (!userId) {
      setBookings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const field = role === 'provider' ? 'providerId' : 'customerId';
      const data = await queryCollectionDocs('bookings', field, '==', userId);
      setBookings(data as Booking[]);
    } catch (err: any) {
      console.error('Error fetching bookings:', err);
      setError(err?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, [userId, role]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, setBookings, loading, error, refetch: fetchBookings };
};
