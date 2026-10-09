package com.studyspace.backend.repository;

/** Query projection: one confirmed (room, slot) pair for a date. */
public record BookedSlot(String roomId, Integer slotId) {
}