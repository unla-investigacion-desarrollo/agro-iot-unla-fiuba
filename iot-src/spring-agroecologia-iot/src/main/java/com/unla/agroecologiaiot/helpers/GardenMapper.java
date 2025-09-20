package com.unla.agroecologiaiot.helpers;

import com.unla.agroecologiaiot.entities.Garden;
import com.unla.agroecologiaiot.entities.MetricAcceptationRange;
import com.unla.agroecologiaiot.entities.MetricReading;
import com.unla.agroecologiaiot.entities.Sector;
import com.unla.agroecologiaiot.models.GardenDTOs.GardenDTO;
import com.unla.agroecologiaiot.models.GardenDTOs.MetricAcceptationRangeDTO;
import com.unla.agroecologiaiot.models.GardenDTOs.MetricReadingDTO;
import com.unla.agroecologiaiot.models.GardenDTOs.SectorDTO;

import org.mapstruct.Mapper;


@Mapper(componentModel = "spring")
public interface GardenMapper {
    GardenDTO toDto(Garden garden);
    SectorDTO toDto(Sector sector);
    MetricReadingDTO toDto(MetricReading reading);
    MetricAcceptationRangeDTO toDto(MetricAcceptationRange mar);
}
