package com.unla.agroecologiaiot.models;

import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SectorModel {
    private long sectorId;

    private String name;
    private String centralizerKey;

    private long gardenId;
    private Date createdAt;
    private String crops;

    private List<Long> metricAcceptationRangeIds;
}
