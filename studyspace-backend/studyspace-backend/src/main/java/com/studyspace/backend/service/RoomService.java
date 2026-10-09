package com.studyspace.backend.service;

import com.studyspace.backend.dto.RoomAvailabilityResponse;
import com.studyspace.backend.dto.RoomResponse;
import com.studyspace.backend.dto.TimeFormats;
import com.studyspace.backend.entity.BookingStatus;
import com.studyspace.backend.entity.Room;
import com.studyspace.backend.entity.TimeSlot;
import com.studyspace.backend.exception.ResourceNotFoundException;
import com.studyspace.backend.repository.BookedSlot;
import com.studyspace.backend.repository.BookingRepository;
import com.studyspace.backend.repository.RoomRepository;
import com.studyspace.backend.repository.TimeSlotRepository;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final BookingRepository bookingRepository;

    public RoomService(RoomRepository roomRepository,
                       TimeSlotRepository timeSlotRepository,
                       BookingRepository bookingRepository) {
        this.roomRepository = roomRepository;
        this.timeSlotRepository = timeSlotRepository;
        this.bookingRepository = bookingRepository;
    }

    /** All rooms in display order. When date is given, each room carries that day's availability. */
    @Transactional(readOnly = true)
    public List<RoomResponse> getRooms(LocalDate date) {
        List<Room> rooms = roomRepository.findAllByOrderByDisplayOrderAsc();
        if (date == null) {
            return rooms.stream().map(room -> toResponse(room, null)).toList();
        }

        List<TimeSlot> slots = timeSlotRepository.findAllByOrderByIdAsc();
        Map<String, Set<Integer>> bookedByRoom = bookingRepository
                .findBookedSlots(date, BookingStatus.CONFIRMED).stream()
                .collect(Collectors.groupingBy(
                        BookedSlot::roomId,
                        Collectors.mapping(BookedSlot::slotId, Collectors.toSet())));

        return rooms.stream()
                .map(room -> toResponse(room, summarize(date, slots,
                        bookedByRoom.getOrDefault(room.getId(), Set.of()))))
                .toList();
    }

    @Transactional(readOnly = true)
    public RoomResponse getRoom(String roomId, LocalDate date) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "ROOM_NOT_FOUND", "Room not found: " + roomId));
        if (date == null) {
            return toResponse(room, null);
        }

        List<TimeSlot> slots = timeSlotRepository.findAllByOrderByIdAsc();
        Set<Integer> booked = new HashSet<>(
                bookingRepository.findSlotIds(roomId, date, BookingStatus.CONFIRMED));
        return toResponse(room, summarize(date, slots, booked));
    }

    private RoomAvailabilityResponse summarize(LocalDate date, List<TimeSlot> slots,
                                               Set<Integer> bookedSlotIds) {
        List<TimeSlot> free = slots.stream()
                .filter(slot -> !bookedSlotIds.contains(slot.getId()))
                .toList();
        String next = free.isEmpty() ? null : TimeFormats.format(free.get(0).getStartTime());
        return new RoomAvailabilityResponse(
                date.toString(),
                slots.size(),
                free.size(),
                next,
                free.isEmpty() ? "OCCUPIED" : "AVAILABLE");
    }

    private RoomResponse toResponse(Room room, RoomAvailabilityResponse availability) {
        return new RoomResponse(
                room.getId(),
                room.getName(),
                room.getBuilding(),
                room.getFloor(),
                room.getLocation(),
                room.getCapacity(),
                room.getImageUrl(),
                List.copyOf(room.getFacilities()),
                availability);
    }
}