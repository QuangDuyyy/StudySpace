package com.studyspace.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/** date is "yyyy-MM-dd". It is parsed in the service so a bad value gives a clean 400. */
public record CreateBookingRequest(
        @NotBlank String roomId,
        @NotBlank String date,
        @NotNull Integer slotId) {
}