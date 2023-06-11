package com.unla.agroecologiaiot.models;

import java.util.List;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class GardenBasicInfoModel {
    
    private long gardenId;
    private String name;
    private String description;
    private String location;
    private List<SectorBasicDataModel> sectorRangesBasicData;
}