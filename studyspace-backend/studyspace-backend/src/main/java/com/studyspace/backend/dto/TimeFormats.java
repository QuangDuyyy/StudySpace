package com.studyspace.backend.dto;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

/** Slot times are always sent as 24-hour "HH:mm". */
public final class TimeFormats {

    private static final DateTimeFormatter HH_MM = DateTimeFormatter.ofPattern("HH:mm");

    private TimeFormats() {
    }

    public static String format(LocalTime time) {
        return HH_MM.format(time);
    }
}