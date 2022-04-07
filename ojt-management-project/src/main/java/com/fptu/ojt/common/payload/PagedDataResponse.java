package com.fptu.ojt.common.payload;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PagedDataResponse<T> {
    private String status;
    private String message;
    private List<T> data;
    private long totalElements;
    private int totalPages;
    private int currentPage;


    public PagedDataResponse(String status, String message, List<T> data, long totalElements, int totalPages, int currentPage) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.currentPage = currentPage;
    }
}
