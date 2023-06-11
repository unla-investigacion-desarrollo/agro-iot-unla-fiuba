package com.unla.agroecologiaiot.shared.paginated;

import lombok.Data;

@Data
public class PagerParametersModel {

    private int pageSize = 1;
    private int pageIndex = 0;
    private String sortField;
    private String sortDirection;
}
