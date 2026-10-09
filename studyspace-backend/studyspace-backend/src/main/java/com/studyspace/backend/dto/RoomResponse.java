package com.studyspace.backend.dto;

import java.util.List;

/** availability is null unless the request included ?date=yyyy-MM-dd. */
public record RoomResponse(
        String id,
        String name,
        String building,
        int floor,
        String location,
        int capacity,
        String imageUrl,
        List<String> facilities,
        RoomAvailabilityResponse availability) {
}