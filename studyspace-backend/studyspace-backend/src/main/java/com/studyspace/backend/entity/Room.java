package com.studyspace.backend.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @Column(name = "id", length = 64, nullable = false)
    private String id;

    @Column(name = "name", length = 120, nullable = false)
    private String name;

    @Column(name = "building", length = 120, nullable = false)
    private String building;

    @Column(name = "floor", nullable = false)
    private int floor;

    @Column(name = "capacity", nullable = false)
    private int capacity;

    @Column(name = "image_url", length = 255, nullable = false)
    private String imageUrl;

    /** Keeps the 14 rooms in the same order as the frontend list. */
    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @ElementCollection
    @CollectionTable(name = "room_facilities", joinColumns = @JoinColumn(name = "room_id"))
    @OrderColumn(name = "facility_order")
    @Column(name = "facility", length = 60, nullable = false)
    private List<String> facilities = new ArrayList<>();

    protected Room() {
    }

    public Room(String id, String name, String building, int floor, int capacity,
                String imageUrl, int displayOrder, List<String> facilities) {
        this.id = id;
        this.name = name;
        this.building = building;
        this.floor = floor;
        this.capacity = capacity;
        this.imageUrl = imageUrl;
        this.displayOrder = displayOrder;
        this.facilities = new ArrayList<>(facilities);
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getBuilding() {
        return building;
    }

    public int getFloor() {
        return floor;
    }

    public int getCapacity() {
        return capacity;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public int getDisplayOrder() {
        return displayOrder;
    }

    public List<String> getFacilities() {
        return Collections.unmodifiableList(facilities);
    }

    /** "Morrison Library · Floor 2" (\u00B7 is the middle dot). */
    public String getLocation() {
        return building + " \u00B7 Floor " + floor;
    }
}