package com.studyspace.backend.config;

import com.studyspace.backend.entity.Room;
import com.studyspace.backend.entity.TimeSlot;
import com.studyspace.backend.repository.RoomRepository;
import com.studyspace.backend.repository.TimeSlotRepository;
import java.time.LocalTime;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/** Inserts the 14 rooms and 6 slots. Rows that already exist are skipped, so restarts are safe. */
@Component
@Order(2)
public class DataSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private record RoomSeed(String id, String name, String building, int floor, int capacity,
                            String imageUrl, List<String> facilities) {
    }

    private static final List<RoomSeed> ROOMS = List.of(
            new RoomSeed("lab-a3-101", "Lab A3-101", "Anderson Hall", 3, 12,
                    "photo-1497366811353-6870744d04b2",
                    List.of("Display", "Whiteboard", "Power outlets")),
            new RoomSeed("library-zone-b", "Library Zone B", "Morrison Library", 2, 8,
                    "photo-1741707596397-efaae09503b5",
                    List.of("Quiet zone", "Natural light", "Whiteboard")),
            new RoomSeed("collab-studio-4", "Collab Studio 4", "Innovation Center", 1, 6,
                    "photo-1628062699790-7c45262b82b4",
                    List.of("Video call", "Display", "AirPlay")),
            new RoomSeed("reading-room-2", "Reading Room 2", "Morrison Library", 4, 16,
                    "photo-1637455587265-2a3c2cbbcc84",
                    List.of("Quiet zone", "Power outlets", "Accessible")),
            new RoomSeed("lab-a3-102", "Lab A3-102", "Anderson Hall", 3, 16,
                    "photo-1789654499247-67ddedd251cc",
                    List.of("Display", "Whiteboard", "Power outlets")),
            new RoomSeed("study-room-b2-201", "Study Room B2-201", "Baker Hall", 2, 6,
                    "photo-1495576775051-8af0d10f19b1",
                    List.of("Whiteboard", "Power outlets")),
            new RoomSeed("study-room-b2-202", "Study Room B2-202", "Baker Hall", 2, 8,
                    "photo-1661169399398-dd271af8f651",
                    List.of("Display", "Whiteboard")),
            new RoomSeed("library-zone-c", "Library Zone C", "Morrison Library", 3, 20,
                    "photo-1789654499248-bf7d80de86d4",
                    List.of("Display", "Power outlets")),
            new RoomSeed("research-room-c1", "Research Room C1", "Innovation Center", 1, 10,
                    "photo-1758413350815-7b06dbbfb9a7",
                    List.of("Display", "Whiteboard", "Power outlets")),
            new RoomSeed("meeting-room-d1", "Meeting Room D1", "Dawson Hall", 1, 12,
                    "photo-1431540015161-0bf868a2d407",
                    List.of("Display", "Whiteboard")),
            new RoomSeed("multimedia-room-e2", "Multimedia Room E2", "Evans Hall", 2, 15,
                    "photo-1497366858526-0766cadbe8fa",
                    List.of("Display", "Power outlets")),
            new RoomSeed("quiet-study-f1", "Quiet Study F1", "Franklin Hall", 1, 4,
                    "photo-1737018363337-c11847e9f39b",
                    List.of("Power outlets")),
            new RoomSeed("collaboration-room-g3", "Collaboration Room G3", "Green Hall", 3, 10,
                    "photo-1637665662134-db459c1bbb46",
                    List.of("Display", "Whiteboard")),
            new RoomSeed("seminar-room-h1", "Seminar Room H1", "Hamilton Hall", 1, 24,
                    "photo-1503423571797-2d2bb372094a",
                    List.of("Display", "Whiteboard", "Power outlets")));

    private final RoomRepository roomRepository;
    private final TimeSlotRepository timeSlotRepository;

    public DataSeeder(RoomRepository roomRepository, TimeSlotRepository timeSlotRepository) {
        this.roomRepository = roomRepository;
        this.timeSlotRepository = timeSlotRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        int slotsAdded = seedTimeSlots();
        int roomsAdded = seedRooms();
        log.info("Seed complete: {} slot(s) and {} room(s) added.", slotsAdded, roomsAdded);
    }

    /** Slots 1-6 = 09:00-10:00 ... 14:00-15:00. */
    private int seedTimeSlots() {
        int added = 0;
        for (int slotId = 1; slotId <= 6; slotId++) {
            if (!timeSlotRepository.existsById(slotId)) {
                LocalTime start = LocalTime.of(8 + slotId, 0);
                timeSlotRepository.save(new TimeSlot(slotId, start, start.plusHours(1)));
                added++;
            }
        }
        return added;
    }

    private int seedRooms() {
        int added = 0;
        for (int index = 0; index < ROOMS.size(); index++) {
            RoomSeed seed = ROOMS.get(index);
            if (!roomRepository.existsById(seed.id())) {
                roomRepository.save(new Room(seed.id(), seed.name(), seed.building(), seed.floor(),
                        seed.capacity(), seed.imageUrl(), index + 1, seed.facilities()));
                added++;
            }
        }
        return added;
    }
}