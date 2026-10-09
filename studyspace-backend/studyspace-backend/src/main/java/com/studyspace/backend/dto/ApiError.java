package com.studyspace.backend.dto;

/** The single error format returned by every failing endpoint. */
public record ApiError(int status, String error, String message, String path) {
}