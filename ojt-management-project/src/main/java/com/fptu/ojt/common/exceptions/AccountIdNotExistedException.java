package com.fptu.ojt.common.exceptions;

import org.springframework.http.HttpStatus;

public class AccountIdNotExistedException extends CrudException {
    public AccountIdNotExistedException() {
        super("Account ID dose not existed!", HttpStatus.BAD_REQUEST);
    }
}
