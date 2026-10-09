import { create } from 'zustand';

const INITIAL_DATE = new Date(2025, 9, 14);

export type Booking = {
  bookingId: string;
  roomId: string;
  date: string;
  slotId: string;
  createdAt: number;
};

type BookingState = {
  selectedDate: Date;
  bookings: Booking[];

  setSelectedDate: (date: Date) => void;
  addBooking: (booking: Booking) => void;
  removeBooking: (bookingId: string) => void;
};

export const useBookingStore = create<BookingState>((set) => ({
  selectedDate: INITIAL_DATE,
  bookings: [],

  setSelectedDate: (date) => {
    set({ selectedDate: date });
  },

  addBooking: (booking) => {
    set((state) => ({
      bookings: [...state.bookings, booking],
    }));
  },

  removeBooking: (bookingId) => {
    set((state) => ({
      bookings: state.bookings.filter(
        (booking) => booking.bookingId !== bookingId
      ),
    }));
  },
}));