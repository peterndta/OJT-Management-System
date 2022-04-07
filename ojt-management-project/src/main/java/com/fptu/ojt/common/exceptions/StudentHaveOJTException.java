package com.fptu.ojt.common.exceptions;

import org.springframework.http.HttpStatus;

public class StudentHaveOJTException extends CrudException {
    public StudentHaveOJTException() {
        super("This student have had a company to OJT. You can not offer this student anymore!", HttpStatus.METHOD_NOT_ALLOWED);
    }
}
