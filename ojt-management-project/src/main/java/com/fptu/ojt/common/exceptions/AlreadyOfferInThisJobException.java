package com.fptu.ojt.common.exceptions;

import org.springframework.http.HttpStatus;

public class AlreadyOfferInThisJobException extends CrudException {
    public AlreadyOfferInThisJobException() {
        super("Already exist an offer in this job.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
