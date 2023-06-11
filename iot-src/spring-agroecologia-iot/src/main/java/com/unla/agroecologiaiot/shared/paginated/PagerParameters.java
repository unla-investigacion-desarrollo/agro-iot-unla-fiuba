package com.unla.agroecologiaiot.shared.paginated;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import com.unla.agroecologiaiot.shared.paginated.especification.FilterRequest;

import lombok.Data;

@Data
public class PagerParameters {

    private int pageSize;
    private int pageIndex;
    private String sortField;
    private String sortDirection;
    private List<FilterRequest> filters;

    public List<FilterRequest> getFilters() {
        if (Objects.isNull(this.filters)) return new ArrayList<>();
        return this.filters;
    }
}
