package com.studyspace.backend.dto;

/** Availability summary of one room on one date. status is AVAILABLE or OCCUPIED. */
public record RoomAvailabilityResponse(
        String date,
        int totalSlots,
        int availableSlots,
        String nextAvailableStartTime,
        String status) {
}