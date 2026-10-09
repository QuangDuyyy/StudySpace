package com.studyspace.backend;

import static org.assertj.core.api.Assertions.assertThat;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.sql.DataSource;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Runs the real application on a random port against the real PostgreSQL database.
 * Every test uses dates in 2099 and removes those bookings before and after, so your
 * own data is never touched.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class BookingApiIntegrationTest {

    @Value("${local.server.port}")
    private int port;

    @Autowired
    private DataSource dataSource;

    private final HttpClient http = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_1_1)
            .build();

    @BeforeEach
    @AfterEach
    void removeTestBookings() throws SQLException {
        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement(
                     "DELETE FROM bookings WHERE booking_date >= DATE '2099-01-01'")) {
            statement.executeUpdate();
        }
    }

    @Test
    void test1_roomsEndpointReturnsAllFourteenRooms() throws Exception {
        HttpResponse<String> response = get("/api/rooms");

        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(count(response.body(), "\"capacity\":")).isEqualTo(14);
    }

    @Test
    void test2_availabilityReturnsSixFreeSlotsOnAFreshDate() throws Exception {
        HttpResponse<String> response = get("/api/availability?roomId=library-zone-b&date=2099-02-01");

        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(count(response.body(), "\"slotId\":")).isEqualTo(6);
        assertThat(count(response.body(), "\"available\":true")).isEqualTo(6);
    }

    @Test
    void test3to6_createConflictCancelAndRebook() throws Exception {
        String json = bookingJson("library-zone-b", "2099-02-02", 2);

        // Test 3: first booking succeeds
        HttpResponse<String> created = post(json);
        assertThat(created.statusCode()).isEqualTo(201);
        assertThat(created.body()).contains("\"status\":\"CONFIRMED\"");
        assertThat(created.body()).contains("\"bookingId\":\"SR-990202-2-");
        String bookingId = extract(created.body(), "\"bookingId\":\"([^\"]+)\"");

        // The slot is now unavailable
        HttpResponse<String> availability = get("/api/availability?roomId=library-zone-b&date=2099-02-02");
        assertThat(count(availability.body(), "\"available\":false")).isEqualTo(1);

        // Test 4: identical booking is rejected
        HttpResponse<String> duplicate = post(json);
        assertThat(duplicate.statusCode()).isEqualTo(409);
        assertThat(duplicate.body()).contains("\"error\":\"SLOT_ALREADY_BOOKED\"");

        // Test 5: cancelling marks it CANCELLED
        HttpResponse<String> cancelled = delete("/api/bookings/" + bookingId);
        assertThat(cancelled.statusCode()).isEqualTo(200);
        assertThat(cancelled.body()).contains("\"status\":\"CANCELLED\"");

        // Cancelling twice is a conflict
        HttpResponse<String> cancelledAgain = delete("/api/bookings/" + bookingId);
        assertThat(cancelledAgain.statusCode()).isEqualTo(409);
        assertThat(cancelledAgain.body()).contains("BOOKING_ALREADY_CANCELLED");

        // The slot was released
        HttpResponse<String> released = get("/api/availability?roomId=library-zone-b&date=2099-02-02");
        assertThat(count(released.body(), "\"available\":true")).isEqualTo(6);

        // Test 6: the same slot can be booked again
        HttpResponse<String> rebooked = post(json);
        assertThat(rebooked.statusCode()).isEqualTo(201);
    }

    @Test
    void unknownRoomSlotAndBadInputAreRejectedCleanly() throws Exception {
        assertThat(post(bookingJson("no-such-room", "2099-02-03", 1)).statusCode()).isEqualTo(404);
        assertThat(post(bookingJson("library-zone-b", "2099-02-03", 99)).statusCode()).isEqualTo(404);
        assertThat(post(bookingJson("library-zone-b", "not-a-date", 1)).statusCode()).isEqualTo(400);
        assertThat(post("{\"roomId\":\"\"}").statusCode()).isEqualTo(400);
        assertThat(get("/api/bookings/SR-DOES-NOT-EXIST").statusCode()).isEqualTo(404);
    }

    @Test
    void test7_simultaneousIdenticalBookingsProduceExactlyOneSuccess() throws Exception {
        final int threads = 8;

        for (String date : List.of("2099-04-01", "2099-04-02", "2099-04-03")) {
            ExecutorService pool = Executors.newFixedThreadPool(threads);
            CountDownLatch ready = new CountDownLatch(threads);
            CountDownLatch start = new CountDownLatch(1);
            List<Future<Integer>> results = new ArrayList<>();

            for (int i = 0; i < threads; i++) {
                results.add(pool.submit(() -> {
                    ready.countDown();
                    start.await();
                    return post(bookingJson("lab-a3-101", date, 1)).statusCode();
                }));
            }

            ready.await();
            start.countDown();

            int created = 0;
            int conflicts = 0;
            for (Future<Integer> result : results) {
                int status = result.get(30, TimeUnit.SECONDS);
                if (status == 201) {
                    created++;
                } else if (status == 409) {
                    conflicts++;
                }
            }
            pool.shutdown();

            assertThat(created).as("201 responses on " + date).isEqualTo(1);
            assertThat(conflicts).as("409 responses on " + date).isEqualTo(threads - 1);
            assertThat(countConfirmedRows("lab-a3-101", date, 1))
                    .as("CONFIRMED rows in the database on " + date).isEqualTo(1);
        }
    }

    // ---------- helpers ----------

    private String baseUrl() {
        return "http://localhost:" + port;
    }

    private HttpResponse<String> get(String path) throws Exception {
        return http.send(HttpRequest.newBuilder(URI.create(baseUrl() + path)).GET().build(),
                HttpResponse.BodyHandlers.ofString());
    }

    private HttpResponse<String> delete(String path) throws Exception {
        return http.send(HttpRequest.newBuilder(URI.create(baseUrl() + path)).DELETE().build(),
                HttpResponse.BodyHandlers.ofString());
    }

    private HttpResponse<String> post(String json) throws Exception {
        HttpRequest request = HttpRequest.newBuilder(URI.create(baseUrl() + "/api/bookings"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();
        return http.send(request, HttpResponse.BodyHandlers.ofString());
    }

    private static String bookingJson(String roomId, String date, int slotId) {
        return String.format("{\"roomId\":\"%s\",\"date\":\"%s\",\"slotId\":%d}", roomId, date, slotId);
    }

    private static int count(String text, String token) {
        return text.split(Pattern.quote(token), -1).length - 1;
    }

    private static String extract(String text, String regex) {
        Matcher matcher = Pattern.compile(regex).matcher(text);
        assertThat(matcher.find()).as("pattern " + regex + " in " + text).isTrue();
        return matcher.group(1);
    }

    private int countConfirmedRows(String roomId, String date, int slotId) throws SQLException {
        String sql = "SELECT COUNT(*) FROM bookings "
                + "WHERE room_id = ? AND booking_date = ? AND slot_id = ? AND status = 'CONFIRMED'";
        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, roomId);
            statement.setDate(2, Date.valueOf(LocalDate.parse(date)));
            statement.setInt(3, slotId);
            try (ResultSet rows = statement.executeQuery()) {
                rows.next();
                return rows.getInt(1);
            }
        }
    }
}