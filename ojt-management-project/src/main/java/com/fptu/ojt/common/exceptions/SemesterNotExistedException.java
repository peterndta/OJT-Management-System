package com.fptu.ojt.common.exceptions;

import org.springframework.http.HttpStatus;

public class SemesterNotExistedException extends CrudException {
    public SemesterNotExistedException() {
        super("Semester does not existed!", HttpStatus.BAD_REQUEST);
    }
}
