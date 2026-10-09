package com.studyspace.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import java.time.LocalDate;

/**
 * One booking of a room for one fixed slot on one date.
 * The "only one CONFIRMED booking per room+date+slot" rule is enforced by the partial
 * unique index created in BookingIndexInitializer, not by this class.
 */
@Entity
@Table(name = "bookings",
        indexes = @Index(name = "idx_bookings_student_created", columnList = "student_id, created_at"))
public class Booking {

    @Id
    @Column(name = "booking_id", length = 40, nullable = false)
    private String bookingId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "slot_id", nullable = false)
    private TimeSlot slot;

    @Column(name = "booking_date", nullable = false)
    private LocalDate bookingDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20, nullable = false)
    private BookingStatus status;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "cancelled_at")
    private Instant cancelledAt;

    @Column(name = "student_id", length = 20, nullable = false)
    private String studentId;

    protected Booking() {
    }

    public Booking(String bookingId, Room room, TimeSlot slot, LocalDate bookingDate,
                   BookingStatus status, Instant createdAt, String studentId) {
        this.bookingId = bookingId;
        this.room = room;
        this.slot = slot;
        this.bookingDate = bookingDate;
        this.status = status;
        this.createdAt = createdAt;
        this.studentId = studentId;
    }

    public void cancel(Instant cancelledAt) {
        this.status = BookingStatus.CANCELLED;
        this.cancelledAt = cancelledAt;
    }

    public String getBookingId() {
        return bookingId;
    }

    public Room getRoom() {
        return room;
    }

    public TimeSlot getSlot() {
        return slot;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getCancelledAt() {
        return cancelledAt;
    }

    public String getStudentId() {
        return studentId;
    }
}