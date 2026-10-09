
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { cancelBooking } from '../api/roomsApi';
import type { BookingResponse } from '../api/roomsApi';

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation<BookingResponse, Error, string>({
    mutationFn: cancelBooking,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });
}
