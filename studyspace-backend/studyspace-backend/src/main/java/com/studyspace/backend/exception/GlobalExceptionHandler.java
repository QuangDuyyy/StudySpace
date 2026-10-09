package com.studyspace.backend.exception;

import com.studyspace.backend.dto.ApiError;
import jakarta.servlet.http.HttpServletRequest;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiError> handleApiException(ApiException ex, HttpServletRequest request) {
        return build(ex.getStatus().value(), ex.getCode(), ex.getMessage(), request);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex,
                                                     HttpServletRequest request) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining("; "));
        if (message.isBlank()) {
            message = "Request validation failed.";
        }
        return build(400, "VALIDATION_ERROR", message, request);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> handleUnreadableBody(HttpMessageNotReadableException ex,
                                                         HttpServletRequest request) {
        return build(400, "MALFORMED_REQUEST", "Request body is missing or malformed.", request);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiError> handleTypeMismatch(MethodArgumentTypeMismatchException ex,
                                                       HttpServletRequest request) {
        return build(400, "INVALID_PARAMETER",
                "Invalid value for parameter '" + ex.getName() + "'.", request);
    }

    /** Safety net: the service already converts the expected slot conflict to a 409. */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> handleDataIntegrity(DataIntegrityViolationException ex,
                                                        HttpServletRequest request) {
        if (ConstraintViolations.isConfirmedSlotConflict(ex)) {
            return build(409, "SLOT_ALREADY_BOOKED", "This slot has just been booked.", request);
        }
        log.warn("Data integrity violation on {}", request.getRequestURI(), ex);
        return build(409, "DATA_CONFLICT", "The request conflicts with existing data.", request);
    }

    /** Spring's own MVC errors (404 unknown path, 405, missing parameter...) keep their status. */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleUnexpected(Exception ex, HttpServletRequest request) {
        if (ex instanceof ErrorResponse frameworkError) {
            HttpStatusCode status = frameworkError.getStatusCode();
            HttpStatus resolved = HttpStatus.resolve(status.value());
            String code = resolved != null ? resolved.name() : "ERROR";
            String detail = frameworkError.getBody().getDetail();
            return build(status.value(), code,
                    detail != null ? detail : "Request could not be processed.", request);
        }
        log.error("Unexpected error on {}", request.getRequestURI(), ex);
        return build(500, "INTERNAL_ERROR", "Something went wrong. Please try again.", request);
    }

    private ResponseEntity<ApiError> build(int status, String code, String message,
                                           HttpServletRequest request) {
        return ResponseEntity.status(status)
                .body(new ApiError(status, code, message, request.getRequestURI()));
    }
}