package com.unla.agroecologiaiot.repositories;

import org.springframework.stereotype.Repository;

import com.unla.agroecologiaiot.entities.Garden;
import com.unla.agroecologiaiot.entities.Sector;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository("sectorRepository")
public interface SectorRepository extends JpaRepository<Sector, Long>, JpaSpecificationExecutor<Sector>{

    public abstract List<Sector> findByGarden(Garden garden);

    @Query("SELECT DISTINCT s FROM Sector s LEFT JOIN FETCH s.metricAcceptationRange WHERE s.garden.gardenId = :gard")
    public abstract List<Sector> findSectorGarden(@Param("gard")long gardenId);
    
    public abstract Optional<Sector> findByCentralizerKey(String centralizerKey);

    @Query("SELECT DISTINCT s FROM Sector s LEFT JOIN FETCH s.metricReadings r WHERE s.garden.id = :gardenId AND s.isDeleted = false AND r.readingDate >= :fromDate")
    List<Sector> findSectorWithReadingDateAfter(@Param("gardenId") long gardenId, @Param("fromDate") LocalDateTime fromDate);

}
