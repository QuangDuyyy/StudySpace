package com.studyspace.backend.service;

import com.studyspace.backend.dto.BookingResponse;
import com.studyspace.backend.dto.TimeFormats;
import com.studyspace.backend.entity.Booking;
import com.studyspace.backend.entity.BookingStatus;
import com.studyspace.backend.entity.Room;
import com.studyspace.backend.entity.TimeSlot;
import java.time.Clock;
import java.time.LocalDateTime;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {

    private final Clock clock;

    public BookingMapper(Clock clock) {
        this.clock = clock;
    }

    public BookingResponse toResponse(Booking booking) {
        Room room = booking.getRoom();
        TimeSlot slot = booking.getSlot();
        LocalDateTime slotEnd = LocalDateTime.of(booking.getBookingDate(), slot.getEndTime());
        boolean completed = booking.getStatus() == BookingStatus.CONFIRMED
                && slotEnd.isBefore(LocalDateTime.now(clock));

        return new BookingResponse(
                booking.getBookingId(),
                booking.getCreatedAt().toString(),
                room.getId(),
                room.getName(),
                room.getLocation(),
                room.getImageUrl(),
                booking.getBookingDate().toString(),
                slot.getId(),
                TimeFormats.format(slot.getStartTime()),
                TimeFormats.format(slot.getEndTime()),
                booking.getStatus(),
                completed);
    }
}