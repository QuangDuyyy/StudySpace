import { useMutation } from '@tanstack/react-query';

import { createBooking } from '../api/roomsApi';

export function useCreateBooking() {
  return useMutation({
    mutationFn: createBooking,
  });
}