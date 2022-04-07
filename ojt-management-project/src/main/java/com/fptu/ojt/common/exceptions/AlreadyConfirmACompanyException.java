package com.fptu.ojt.common.exceptions;

import org.springframework.http.HttpStatus;

public class AlreadyConfirmACompanyException extends CrudException {
    public AlreadyConfirmACompanyException() {
        super("You have had a company to OJT. You can not apply for a position and confirm any application or offer anymore!", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
