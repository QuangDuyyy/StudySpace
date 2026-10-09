package com.studyspace.backend.config;

import com.studyspace.backend.exception.ConstraintViolations;
import java.sql.Connection;
import java.sql.Statement;
import javax.sql.DataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Creates the database rule that makes double booking impossible:
 * only ONE row per (room, date, slot) may have status CONFIRMED.
 *
 * Hibernate (ddl-auto=update) builds the tables first, then this runner adds the partial
 * unique index, which Hibernate cannot declare itself. CANCELLED rows are outside the index,
 * so a cancelled slot can be booked again. IF NOT EXISTS makes every startup safe.
 */
@Component
@Order(1)
public class BookingIndexInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(BookingIndexInitializer.class);

    private static final String CREATE_INDEX_SQL =
            "CREATE UNIQUE INDEX IF NOT EXISTS " + ConstraintViolations.CONFIRMED_SLOT_INDEX
                    + " ON bookings (room_id, booking_date, slot_id) WHERE status = 'CONFIRMED'";

    private final DataSource dataSource;

    public BookingIndexInitializer(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        try (Connection connection = dataSource.getConnection();
             Statement statement = connection.createStatement()) {
            statement.execute(CREATE_INDEX_SQL);
        }
        log.info("Booking conflict index '{}' is in place.", ConstraintViolations.CONFIRMED_SLOT_INDEX);
    }
}