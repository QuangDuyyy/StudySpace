package com.studyspace.backend.exception;

import org.springframework.http.HttpStatus;

public class BookingAlreadyCancelledException extends ApiException {

    public BookingAlreadyCancelledException() {
        super(HttpStatus.CONFLICT, "BOOKING_ALREADY_CANCELLED", "This booking has already been cancelled.");
    }
}