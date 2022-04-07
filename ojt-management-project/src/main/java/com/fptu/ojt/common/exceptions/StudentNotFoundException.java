package com.fptu.ojt.common.exceptions;

import org.springframework.http.HttpStatus;

public class StudentNotFoundException extends CrudException{

    public StudentNotFoundException() {
        super("Student Not Found", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
