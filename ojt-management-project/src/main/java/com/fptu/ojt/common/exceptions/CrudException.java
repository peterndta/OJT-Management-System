package com.fptu.ojt.common.exceptions;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter

public class CrudException extends Exception {
    private final HttpStatus status;
    private final String message;

    public CrudException(String message, HttpStatus status) {
        super(message);
        this.message = message;
        this.status = status;
    }
}
