package com.unla.agroecologiaiot.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.unla.agroecologiaiot.entities.Garden;

@Repository("gardenRepository")
public interface GardenRepository extends JpaRepository<Garden, Long>, JpaSpecificationExecutor<Garden> {

    public abstract Optional<Garden> findByName(String name);

    public abstract Optional<Garden> findByGardenIdAndIsDeleted(long gardenId,
            boolean isDeleted);

    @Query("SELECT DISTINCT g FROM Garden g LEFT JOIN FETCH g.sectors s LEFT JOIN FETCH s.metricAcceptationRange WHERE g.gardenId = :gard AND g.isDeleted = false")
    public abstract Garden findGardenId(@Param("gard")long gardenId);
    
    @Query("SELECT DISTINCT g FROM Garden g LEFT JOIN FETCH g.sectors s LEFT JOIN FETCH s.metricAcceptationRange WHERE g.gardenId = :gard AND g.isDeleted = false")
    public abstract Optional<Garden> findByGardenIdComplete(@Param("gard")long gardenId);

    @Query("SELECT DISTINCT g FROM Garden g LEFT JOIN FETCH g.sectors s LEFT JOIN FETCH s.metricAcceptationRange mar LEFT JOIN FETCH s.metricReadings mr WHERE g.isDeleted = false AND s.isDeleted = false AND (mr.readingDate IS NULL OR mr.readingDate = (SELECT MAX(mr2.readingDate) FROM MetricReading mr2 WHERE mr2.sector = s))")
    public abstract List<Garden> dashboardComplete();
}
