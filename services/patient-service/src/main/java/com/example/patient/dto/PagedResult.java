package com.example.patient.dto;

import java.util.List;

public record PagedResult<T>(
        List<T> items,
        long total,
        int offset,
        int limit) {
}
