package com.fptu.ojt.common.exceptions;

import org.springframework.http.HttpStatus;

public class AlreadyHaveApplicationInThisJobException extends CrudException {
    public AlreadyHaveApplicationInThisJobException() {
        super("Already exist a application in this job. You can not apply for this position anymore!", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
