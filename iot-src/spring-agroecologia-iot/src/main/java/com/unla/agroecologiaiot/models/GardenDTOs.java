package com.unla.agroecologiaiot.models;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class GardenDTOs {
    @Getter
    @Setter
    @NoArgsConstructor
    public static class GardenDTO {
        private Long gardenId;
        private String name;
        private String description;
        private String location;
        private UserDTO owner;
        private List<SectorDTO> sectors;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class SectorDTO {
        private Long sectorId;
        private String name;
        private String centralizerKey;
        private String crops;
        private MetricAcceptationRangeDTO metricAcceptationRange;
        
        @JsonProperty("readings")
        private List<IMetricReadingDTO> metricReadings;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class MetricReadingDTO {
        private Long metricReadingId;
        private String valueType;
        private Double taValue;
        private Double hrValue;
        private Double hsValue;
        private boolean rainForecast;
        private boolean irrigation;
        private String readingDate;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class MetricAcceptationRangeDTO {
        private Long metricAcceptationRangeId;
        private String name;
        private String description;
        private Double taStartValue;
        private Double taEndValue;
        private Double hrStartValue;
        private Double hrEndValue;
        private Double hsStartValue;
        private Double hsEndValue;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class UserDTO {
        private Long userId;
        private String username;
        private String email;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class IMetricReadingDTO {
        private Double metricReadingId;
        private Date readingDate;
        private Double taValue;
        private Double hrValue;
        private Double hsValue;
        private boolean rainForecast;
        private boolean irrigation;
        private String valueType;
        
        @JsonProperty("isCurrentReading")
        private boolean isCurrentReading;
    }
}