package com.studyspace.backend.dto;

public record SlotAvailability(
        int slotId,
        String startTime,
        String endTime,
        boolean available) {
}