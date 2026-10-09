import { useQuery } from '@tanstack/react-query';

import { fetchBookings } from '../api/roomsApi';

export function useBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: fetchBookings,
  });
}