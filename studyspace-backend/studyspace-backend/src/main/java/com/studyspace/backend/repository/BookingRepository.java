package com.studyspace.backend.repository;

import com.studyspace.backend.entity.Booking;
import com.studyspace.backend.entity.BookingStatus;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookingRepository extends JpaRepository<Booking, String> {

    @Query("""
            select count(b) from Booking b
            where b.room.id = :roomId
              and b.bookingDate = :date
              and b.slot.id = :slotId
              and b.status = :status
            """)
    long countForSlot(@Param("roomId") String roomId,
                      @Param("date") LocalDate date,
                      @Param("slotId") Integer slotId,
                      @Param("status") BookingStatus status);

    @Query("""
            select b.slot.id from Booking b
            where b.room.id = :roomId
              and b.bookingDate = :date
              and b.status = :status
            """)
    List<Integer> findSlotIds(@Param("roomId") String roomId,
                              @Param("date") LocalDate date,
                              @Param("status") BookingStatus status);

    @Query("""
            select new com.studyspace.backend.repository.BookedSlot(b.room.id, b.slot.id)
            from Booking b
            where b.bookingDate = :date
              and b.status = :status
            """)
    List<BookedSlot> findBookedSlots(@Param("date") LocalDate date,
                                     @Param("status") BookingStatus status);

    @Query("""
            select b from Booking b
            join fetch b.room
            join fetch b.slot
            where b.studentId = :studentId
            order by b.createdAt desc, b.bookingId desc
            """)
    List<Booking> findAllByStudent(@Param("studentId") String studentId);

    @Query("""
            select b from Booking b
            join fetch b.room
            join fetch b.slot
            where b.bookingId = :bookingId
              and b.studentId = :studentId
            """)
    Optional<Booking> findByIdAndStudent(@Param("bookingId") String bookingId,
                                         @Param("studentId") String studentId);
}