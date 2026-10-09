package com.studyspace.backend.service;

import com.studyspace.backend.dto.BookingResponse;
import com.studyspace.backend.dto.CreateBookingRequest;
import com.studyspace.backend.entity.Booking;
import com.studyspace.backend.entity.BookingStatus;
import com.studyspace.backend.entity.Room;
import com.studyspace.backend.entity.TimeSlot;
import com.studyspace.backend.exception.BookingAlreadyCancelledException;
import com.studyspace.backend.exception.ConstraintViolations;
import com.studyspace.backend.exception.InvalidRequestException;
import com.studyspace.backend.exception.ResourceNotFoundException;
import com.studyspace.backend.exception.SlotAlreadyBookedException;
import com.studyspace.backend.repository.BookingRepository;
import com.studyspace.backend.repository.RoomRepository;
import com.studyspace.backend.repository.TimeSlotRepository;
import java.security.SecureRandom;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.List;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookingService {

    private static final char[] ID_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".toCharArray();
    private static final DateTimeFormatter ID_DATE = DateTimeFormatter.ofPattern("yyMMdd");
    private static final SecureRandom RANDOM = new SecureRandom();

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final CurrentStudentProvider studentProvider;
    private final BookingMapper mapper;
    private final Clock clock;

    public BookingService(BookingRepository bookingRepository,
                          RoomRepository roomRepository,
                          TimeSlotRepository timeSlotRepository,
                          CurrentStudentProvider studentProvider,
                          BookingMapper mapper,
                          Clock clock) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.timeSlotRepository = timeSlotRepository;
        this.studentProvider = studentProvider;
        this.mapper = mapper;
        this.clock = clock;
    }

    @Transactional
    public BookingResponse createBooking(CreateBookingRequest request) {
        LocalDate date = parseDate(request.date());
        Room room = roomRepository.findById(request.roomId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "ROOM_NOT_FOUND", "Room not found: " + request.roomId()));
        TimeSlot slot = timeSlotRepository.findById(request.slotId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "SLOT_NOT_FOUND", "Time slot not found: " + request.slotId()));

        // Friendly fast path only. The database index below is the real guarantee.
        long existing = bookingRepository.countForSlot(
                room.getId(), date, slot.getId(), BookingStatus.CONFIRMED);
        if (existing > 0) {
            throw new SlotAlreadyBookedException();
        }

        Booking booking = new Booking(
                generateBookingId(date, slot.getId()),
                room,
                slot,
                date,
                BookingStatus.CONFIRMED,
                // Real wall-clock time: createdAt must reflect creation order.
// The fixed demo clock is only for deciding "completed".
Instant.now().truncatedTo(ChronoUnit.MILLIS),
studentProvider.currentStudentId());

        try {
            // Flush now so a unique-index violation surfaces here, not later at commit.
            Booking saved = bookingRepository.saveAndFlush(booking);
            return mapper.toResponse(saved);
        } catch (DataIntegrityViolationException ex) {
            if (ConstraintViolations.isConfirmedSlotConflict(ex)) {
                throw new SlotAlreadyBookedException();
            }
            throw ex;
        }
    }

    /** The current student's bookings, newest first. */
    @Transactional(readOnly = true)
    public List<BookingResponse> getBookings() {
        return bookingRepository.findAllByStudent(studentProvider.currentStudentId()).stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public BookingResponse getBooking(String bookingId) {
        return mapper.toResponse(findOwnedBooking(bookingId));
    }

    /** Soft cancel: the row stays as history and its slot becomes bookable again. */
    @Transactional
    public BookingResponse cancelBooking(String bookingId) {
        Booking booking = findOwnedBooking(bookingId);
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BookingAlreadyCancelledException();
        }
        booking.cancel(Instant.now(clock).truncatedTo(ChronoUnit.MILLIS));
        return mapper.toResponse(booking);
    }

    private Booking findOwnedBooking(String bookingId) {
        return bookingRepository.findByIdAndStudent(bookingId, studentProvider.currentStudentId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "BOOKING_NOT_FOUND", "Booking not found: " + bookingId));
    }

    private LocalDate parseDate(String text) {
        try {
            return LocalDate.parse(text.trim());
        } catch (DateTimeParseException ex) {
            throw new InvalidRequestException("INVALID_DATE", "date must use the format yyyy-MM-dd.");
        }
    }

    /** "SR-251014-2-MUW17CC8": booking date, slot id, 8 random characters. */
    private String generateBookingId(LocalDate date, int slotId) {
        StringBuilder id = new StringBuilder("SR-")
                .append(ID_DATE.format(date))
                .append('-')
                .append(slotId)
                .append('-');
        for (int i = 0; i < 8; i++) {
            id.append(ID_ALPHABET[RANDOM.nextInt(ID_ALPHABET.length)]);
        }
        return id.toString();
    }
}