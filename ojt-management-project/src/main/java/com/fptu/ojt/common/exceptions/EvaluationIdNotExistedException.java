package com.fptu.ojt.common.exceptions;

import org.springframework.http.HttpStatus;

public class EvaluationIdNotExistedException extends CrudException {
    public EvaluationIdNotExistedException() {
        super("Evaluation id not existed exception", HttpStatus.BAD_REQUEST);
    }
}
