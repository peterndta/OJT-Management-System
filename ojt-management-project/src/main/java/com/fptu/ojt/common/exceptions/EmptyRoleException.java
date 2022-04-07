package com.fptu.ojt.common.exceptions;

import org.springframework.http.HttpStatus;

public class EmptyRoleException extends CrudException {

    public EmptyRoleException() {
        super("Role can not be empty", HttpStatus.BAD_REQUEST);
    }
}
