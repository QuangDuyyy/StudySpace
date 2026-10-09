package com.studyspace.backend.service;

import com.studyspace.backend.dto.SlotAvailability;
import com.studyspace.backend.dto.TimeFormats;
import com.studyspace.backend.entity.BookingStatus;
import com.studyspace.backend.exception.ResourceNotFoundException;
import com.studyspace.backend.repository.BookingRepository;
import com.studyspace.backend.repository.RoomRepository;
import com.studyspace.backend.repository.TimeSlotRepository;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AvailabilityService {

    private final RoomRepository roomRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final BookingRepository bookingRepository;

    public AvailabilityService(RoomRepository roomRepository,
                               TimeSlotRepository timeSlotRepository,
                               BookingRepository bookingRepository) {
        this.roomRepository = roomRepository;
        this.timeSlotRepository = timeSlotRepository;
        this.bookingRepository = bookingRepository;
    }

    /** Every fixed slot, marked unavailable only when a CONFIRMED booking exists for it. */
    @Transactional(readOnly = true)
    public List<SlotAvailability> getAvailability(String roomId, LocalDate date) {
        if (!roomRepository.existsById(roomId)) {
            throw new ResourceNotFoundException("ROOM_NOT_FOUND", "Room not found: " + roomId);
        }

        Set<Integer> booked = new HashSet<>(
                bookingRepository.findSlotIds(roomId, date, BookingStatus.CONFIRMED));

        return timeSlotRepository.findAllByOrderByIdAsc().stream()
                .map(slot -> new SlotAvailability(
                        slot.getId(),
                        TimeFormats.format(slot.getStartTime()),
                        TimeFormats.format(slot.getEndTime()),
                        !booked.contains(slot.getId())))
                .toList();
    }
}