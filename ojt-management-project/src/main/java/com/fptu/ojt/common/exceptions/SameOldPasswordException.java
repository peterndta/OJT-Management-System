package com.fptu.ojt.common.exceptions;

import org.springframework.http.HttpStatus;

public class SameOldPasswordException extends CrudException {
    public SameOldPasswordException() {
        super("The new password matches your current password!", HttpStatus.BAD_REQUEST);
    }
}
