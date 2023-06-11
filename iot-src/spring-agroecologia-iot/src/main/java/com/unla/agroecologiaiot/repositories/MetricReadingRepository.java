package com.unla.agroecologiaiot.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.unla.agroecologiaiot.entities.MetricReading;

@Repository("metricReadingRepository")
public interface MetricReadingRepository
                extends JpaRepository<MetricReading, Long>, JpaSpecificationExecutor<MetricReading> {

        public abstract Optional<MetricReading> findByValueType(String valueType);

        @Query("SELECT m FROM MetricReading m JOIN FETCH m.sector s where s.sectorId = (:id) order by m.readingDate desc")
        public abstract List<MetricReading> findBySectorAndOrderByReadingDate(@Param("id") long id);

}



