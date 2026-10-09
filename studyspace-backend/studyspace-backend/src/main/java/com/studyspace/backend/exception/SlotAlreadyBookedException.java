package com.studyspace.backend.exception;

import org.springframework.http.HttpStatus;

public class SlotAlreadyBookedException extends ApiException {

    public SlotAlreadyBookedException() {
        super(HttpStatus.CONFLICT, "SLOT_ALREADY_BOOKED", "This slot has just been booked.");
    }
}