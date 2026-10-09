package com.studyspace.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/** No authentication yet: every request belongs to the sample student. */
@Component
public class DemoStudentProvider implements CurrentStudentProvider {

    private final String studentId;

    public DemoStudentProvider(@Value("${studyspace.demo-student-id:NB-204817}") String studentId) {
        this.studentId = studentId;
    }

    @Override
    public String currentStudentId() {
        return studentId;
    }
}