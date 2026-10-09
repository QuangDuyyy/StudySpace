package com.studyspace.backend.dto;

import com.studyspace.backend.entity.BookingStatus;

/** completed is true for a CONFIRMED booking whose slot has already ended. */
public record BookingResponse(
        String bookingId,
        String createdAt,
        String roomId,
        String roomName,
        String location,
        String imageUrl,
        String date,
        int slotId,
        String startTime,
        String endTime,
        BookingStatus status,
        boolean completed) {
}