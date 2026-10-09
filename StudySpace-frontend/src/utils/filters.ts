import type { Room } from '../types/room';
import type { FilterState } from '../types/filters';

export function filterRooms(
  rooms: readonly Room[],
  filters: FilterState,
): readonly Room[] {
  return rooms.filter((room) => {
    // Building
    if (
      filters.building !== 'All buildings' &&
      room.building !== filters.building
    ) {
      return false;
    }

    // Capacity
    if (filters.capacity !== 'Any') {
      const minimumSeats = Number.parseInt(filters.capacity, 10);

      if (room.seats < minimumSeats) {
        return false;
      }
    }

    // Availability
    if (
      filters.availability !== 'Any' &&
      filters.availability === 'Available now' &&
      room.status !== 'available'
    ) {
      return false;
    }

    if (
      filters.availability === 'Occupied' &&
      room.status !== 'occupied'
    ) {
      return false;
    }

    // Facilities
    if (
      filters.facilities !== 'Any' &&
      !room.facilities.includes(filters.facilities)
    ) {
      return false;
    }

    return true;
  });
}