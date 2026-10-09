package com.studyspace.backend.config;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ClockConfig {

    /**
     * Demo campus time used by the Figma/StudySpace prototype.
     *
     * October 8, 2025 at 12:00 PM, GMT-4.
     */
    @Bean
    public Clock clock() {
        return Clock.fixed(
                Instant.parse("2025-10-08T16:00:00Z"),
                ZoneOffset.ofHours(-4));
    }
}