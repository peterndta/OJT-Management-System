package com.fptu.ojt.common.exceptions;

import org.springframework.http.HttpStatus;

import java.util.Set;
import java.util.stream.Collectors;

public class MajorNotExistedException extends CrudException {
    public MajorNotExistedException() {
        super("Major does not exist", HttpStatus.BAD_REQUEST);
    }

    public MajorNotExistedException(Set<Long> ids){
        super(String.format("Major with ids: %s does not exist.", ids.stream().map(String::valueOf).collect(Collectors.joining(", "))), HttpStatus.BAD_REQUEST);
    }
}
