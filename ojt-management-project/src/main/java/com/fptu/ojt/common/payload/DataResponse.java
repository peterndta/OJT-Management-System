package com.fptu.ojt.common.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class DataResponse<T> extends Response {
    private T data;

    public DataResponse(String status, String message, T data) {
        super(status, message);
        this.data = data;
    }
}
