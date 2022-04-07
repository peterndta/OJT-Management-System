package com.fptu.ojt.common.exceptions;

import org.springframework.http.HttpStatus;

public class StudentNotExistedException extends CrudException {
    public StudentNotExistedException() {
        super("Student does not existed!", HttpStatus.BAD_REQUEST);
    }
}
