package com.studyspace.backend.exception;

/** Recognises a violation of the partial unique index that guards confirmed slots. */
public final class ConstraintViolations {

    /** Name of the PostgreSQL index created by BookingIndexInitializer. */
    public static final String CONFIRMED_SLOT_INDEX = "uq_bookings_confirmed_slot";

    private ConstraintViolations() {
    }

    /**
     * PostgreSQL reports "duplicate key value violates unique constraint "<index name>"".
     * Hibernate and Spring wrap that error, so the whole cause chain is searched for the index name.
     */
    public static boolean isConfirmedSlotConflict(Throwable error) {
        Throwable current = error;
        while (current != null) {
            String message = current.getMessage();
            if (message != null && message.contains(CONFIRMED_SLOT_INDEX)) {
                return true;
            }
            current = current.getCause();
        }
        return false;
    }
}