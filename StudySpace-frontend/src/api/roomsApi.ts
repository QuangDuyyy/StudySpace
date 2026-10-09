import type { Room } from '../types/room';
import { formatLocalDate } from '../utils/dates';
const API_BASE_URL = 'http://192.168.100.249:8080';

type ApiRoom = {
  id: string;
  name: string;
  building: string;
  floor: number;
  location: string;
  capacity: number;
  imageUrl: string;
  facilities: string[];
  availability: {
    date: string;
    totalSlots: number;
    availableSlots: number;
    nextAvailableStartTime: string | null;
    status: 'AVAILABLE' | 'OCCUPIED';
  };
};

function formatNextLabel(
  status: ApiRoom['availability']['status'],
  nextAvailableStartTime: string | null,
): string {
  if (status === 'OCCUPIED' && nextAvailableStartTime) {
    const [hourString, minute] = nextAvailableStartTime.split(':');
    const hour = Number(hourString);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;

    return `Free at ${displayHour}:${minute} ${period}`;
  }

  if (nextAvailableStartTime) {
    const [hourString, minute] = nextAvailableStartTime.split(':');
    const hour = Number(hourString);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;

    return `Next: ${displayHour}:${minute} ${period}`;
  }

  return status === 'OCCUPIED' ? 'Occupied' : 'Available now';
}

function mapApiRoom(room: ApiRoom): Room {
  return {
    id: room.id,
    name: room.name,
    building: room.building,
    floor: room.floor,
    seats: room.capacity,
    facilities: room.facilities as Room['facilities'],
    status: room.availability.status === 'AVAILABLE' ? 'available' : 'occupied',
    nextLabel: formatNextLabel(
      room.availability.status,
      room.availability.nextAvailableStartTime,
    ),
  };
}

export async function fetchRooms(date: Date): Promise<readonly Room[]> {
  const dateString = formatLocalDate(date);

  const response = await fetch(
    `${API_BASE_URL}/api/rooms?date=${dateString}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch rooms: ${response.status}`);
  }

  const rooms: ApiRoom[] = await response.json();

  return rooms.map(mapApiRoom);
}
export type AvailabilitySlot = {
  slotId: number;
  startTime: string;
  endTime: string;
  available: boolean;
};

export async function fetchRoomAvailability(
  roomId: string,
  date: Date,
): Promise<readonly AvailabilitySlot[]> {
  const dateString = formatLocalDate(date);

  const response = await fetch(
    `${API_BASE_URL}/api/availability?roomId=${encodeURIComponent(roomId)}&date=${dateString}`,
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch availability: ${response.status}`,
    );
  }

  return response.json();
}
export type CreateBookingRequest = {
  roomId: string;
  date: string;
  slotId: number;
};
export type Booking = {
  bookingId: string;
  createdAt: string;
  roomId: string;
  roomName: string;
  location: string;
  imageUrl: string;
  date: string;
  slotId: number;
  startTime: string;
  endTime: string;
  status: 'CONFIRMED' | 'CANCELLED';
  completed: boolean;
};

export async function fetchBookings(): Promise<readonly Booking[]> {
  console.log('BOOKINGS: START');

  const url = `${API_BASE_URL}/api/bookings`;

  console.log('BOOKINGS: URL', url);

  const response = await fetch(url);

  console.log('BOOKINGS: STATUS', response.status);

  if (!response.ok) {
    const message = await response.text();

    console.error('BOOKINGS: ERROR', message);

    throw new Error(
      message || `Failed to fetch bookings: ${response.status}`,
    );
  }

  const data: Booking[] = await response.json();

  console.log(
    'BOOKINGS: RESPONSE',
    JSON.stringify(data),
  );

  console.log(
    'BOOKINGS: LENGTH',
    data.length,
  );

  return data;
}
export type BookingResponse = {
  bookingId: string;
  createdAt: string;
  roomId: string;
  roomName: string;
  location: string;
  imageUrl: string;
  date: string;
  slotId: number;
  startTime: string;
  endTime: string;
  status: 'CONFIRMED' | 'CANCELLED';
  completed: boolean;
};

export async function createBooking(
  request: CreateBookingRequest,
): Promise<BookingResponse> {
  const response = await fetch(`${API_BASE_URL}/api/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      message || `Failed to create booking: ${response.status}`,
    );
  }

  return response.json();
}

async function readErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  const text = await response.text();

  try {
    const body = JSON.parse(text) as { message?: unknown };

    if (typeof body.message === 'string' && body.message.length > 0) {
      return body.message;
    }
  } catch {
    // Response body is not JSON.
  }

  return text || fallback;
}

export async function cancelBooking(
  bookingId: string,
): Promise<BookingResponse> {
  let response: Response;

  try {
    response = await fetch(
      `${API_BASE_URL}/api/bookings/${encodeURIComponent(bookingId)}`,
      { method: 'DELETE' },
    );
  } catch {
    throw new Error(
      'Could not reach the server. Check your connection and try again.',
    );
  }

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(
        response,
        `Failed to cancel booking: ${response.status}`,
      ),
    );
  }

  return response.json();
}


