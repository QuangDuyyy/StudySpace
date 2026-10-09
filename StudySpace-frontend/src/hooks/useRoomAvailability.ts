import { useQuery } from '@tanstack/react-query';

import { fetchRoomAvailability } from '../api/roomsApi';

export function useRoomAvailability(
  roomId: string,
  date: Date,
) {
  const dateKey = date.toISOString().slice(0, 10);

  return useQuery({
    queryKey: ['room-availability', roomId, dateKey],
    queryFn: () => fetchRoomAvailability(roomId, date),
  });
}