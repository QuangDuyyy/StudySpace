import { useQuery } from '@tanstack/react-query';

import { fetchRooms } from '../api/roomsApi';

export function useRooms(date: Date) {
  const dateKey = date.toISOString().slice(0, 10);

  return useQuery({
    queryKey: ['rooms', dateKey],
    queryFn: () => fetchRooms(date),
  });
}