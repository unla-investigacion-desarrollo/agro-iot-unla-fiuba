package com.unla.agroecologiaiot.shared.paginated;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PaginatedList<T> {
    
    private List<T> list;
    private long count;
    private long index;
}
