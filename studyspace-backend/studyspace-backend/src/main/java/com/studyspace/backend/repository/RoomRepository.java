package com.studyspace.backend.repository;

import com.studyspace.backend.entity.Room;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room, String> {

    List<Room> findAllByOrderByDisplayOrderAsc();
}