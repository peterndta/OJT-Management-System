package com.fptu.ojt.common.exceptions;

import org.springframework.http.HttpStatus;

public class ApplicationDenied extends CrudException{
    public ApplicationDenied() {
        super("This application was denied by the student's university. You can't modify.\n Contact the university to get more information.", HttpStatus.BAD_REQUEST);
    }
}
