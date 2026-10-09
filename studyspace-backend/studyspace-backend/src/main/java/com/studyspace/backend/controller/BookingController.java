package com.studyspace.backend.controller;

import com.studyspace.backend.dto.BookingResponse;
import com.studyspace.backend.dto.CreateBookingRequest;
import com.studyspace.backend.service.BookingService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    public List<BookingResponse> getBookings() {
        return bookingService.getBookings();
    }

    @GetMapping("/{bookingId}")
    public BookingResponse getBooking(@PathVariable("bookingId") String bookingId) {
        return bookingService.getBooking(bookingId);
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody CreateBookingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createBooking(request));
    }

    /** Cancels (soft) and returns the updated booking. */
    @DeleteMapping("/{bookingId}")
    public BookingResponse cancelBooking(@PathVariable("bookingId") String bookingId) {
        return bookingService.cancelBooking(bookingId);
    }
}