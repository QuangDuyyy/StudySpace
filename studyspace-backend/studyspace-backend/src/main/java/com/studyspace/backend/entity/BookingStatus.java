package com.studyspace.backend.entity;

/** Stored statuses only. "Completed" is derived at read time, never stored. */
public enum BookingStatus {
    CONFIRMED,
    CANCELLED
}