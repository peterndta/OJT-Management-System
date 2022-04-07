package com.fptu.ojt.common.exceptions;

import org.springframework.http.HttpStatus;

public class JobNotAllowedUpdateException extends CrudException {
    public JobNotAllowedUpdateException() {
        super("You can't allow update this job!", HttpStatus.FORBIDDEN);
    }
}
