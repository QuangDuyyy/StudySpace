export type RoomStatus = 'available' | 'occupied';

export type Facility =
  | 'Display'
  | 'Whiteboard'
  | 'Power outlets'
  | 'Quiet zone'
  | 'Natural light'
  | 'Video call'
  | 'AirPlay'
  | 'Accessible';

export type Room = {
  id: string;
  name: string;
  building: string;
  floor: number;
  seats: number;
  facilities: readonly Facility[];
  /** Status for the initial date (Oct 14, 2025). Becomes date-dependent in the logic phase. */
  status: RoomStatus;
  /** "Next: 10:00 AM" or "Free at 1:00 PM", exactly as in the spec. */
  nextLabel: string;
};