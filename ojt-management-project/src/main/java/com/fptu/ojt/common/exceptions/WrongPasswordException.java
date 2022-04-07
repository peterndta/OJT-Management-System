package com.fptu.ojt.common.exceptions;

import org.springframework.http.HttpStatus;

public class WrongPasswordException extends CrudException {
    public WrongPasswordException() {
        super("Password wrong!", HttpStatus.BAD_REQUEST);
    }
}
