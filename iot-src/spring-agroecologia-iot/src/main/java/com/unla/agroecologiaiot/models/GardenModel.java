package com.unla.agroecologiaiot.models;

import java.util.Date;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class GardenModel {
    
    private long gardenId;

    private String name;
    private String description;
    private String location;

    private long ownerId;
    private Date createdAt;

    private List<SectorModel> sectors; 
}
