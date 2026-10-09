package com.studyspace.backend.repository;

import com.studyspace.backend.entity.TimeSlot;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, Integer> {

    List<TimeSlot> findAllByOrderByIdAsc();
}