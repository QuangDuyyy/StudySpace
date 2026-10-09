import type { Room } from '../types/room';

/** "Anderson Hall · Floor 3" */
export function getRoomLocation(room: Room): string {
  return `${room.building} · Floor ${room.floor}`;
}

/** Matches the room name or building. Temporary: replaced by the real filter logic later. */
export function searchRooms(rooms: readonly Room[], query: string): readonly Room[] {
  const term = query.trim().toLowerCase();
  if (term === '') return rooms;

  return rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(term) || room.building.toLowerCase().includes(term),
  );
}